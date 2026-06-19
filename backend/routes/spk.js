const express = require('express');
const router = express.Router();
const pool = require('../database/pool');

// Helper: get alternative data for pending leave requests
async function getAlternatives() {
  // Get all pending leave requests with employee data
  const pendingResult = await pool.query(`
    SELECT 
      lr.id as leave_id,
      lr.user_id,
      lr.jenis_cuti,
      lr.tanggal_mulai,
      lr.tanggal_selesai,
      lr.total_hari,
      lr.created_at,
      u.employee_id,
      u.name,
      u.email,
      u.tanggal_masuk,
      u.sisa_cuti,
      u.total_cuti_tahunan,
      u.sisa_cuti_tahun_lalu
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    WHERE lr.status = 'Pending'
    ORDER BY lr.created_at ASC
  `);

  // For each employee, get aggregate stats
  const alternatives = [];
  for (const pending of pendingResult.rows) {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_pengajuan,
        COUNT(*) FILTER (WHERE status = 'Approved') as approved,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'Rejected') as rejected
      FROM leave_requests
      WHERE user_id = $1
    `, [pending.user_id]);

    const stats = statsResult.rows[0];
    const totalPengajuan = parseInt(stats.total_pengajuan);
    const approvedCount = parseInt(stats.approved);
    const approvalRate = totalPengajuan > 0 ? (approvedCount / totalPengajuan) * 100 : 0;
    
    // Calculate masa kerja (work tenure in days)
    const masukDate = new Date(pending.tanggal_masuk);
    const today = new Date();
    const masaKerja = Math.floor((today - masukDate) / (1000 * 60 * 60 * 24));

    // Sum of pending leave days for this request
    const sumLeave = pending.total_hari;

    alternatives.push({
      leave_id: pending.leave_id,
      user_id: pending.user_id,
      employee_id: pending.employee_id,
      name: pending.name,
      email: pending.email,
      jenis_cuti: pending.jenis_cuti,
      tanggal_mulai: pending.tanggal_mulai,
      tanggal_selesai: pending.tanggal_selesai,
      total_hari: sumLeave,
      // Raw data for alternative source table
      sum_leave: sumLeave,
      total_pengajuan: totalPengajuan,
      approved: approvedCount,
      pending_count: parseInt(stats.pending_count),
      rejected: parseInt(stats.rejected),
      // Calculated metrics
      approval_rate: parseFloat(approvalRate.toFixed(2)),
      rejection_rate: parseFloat((totalPengajuan > 0 ? (parseInt(stats.rejected) / totalPengajuan) * 100 : 0).toFixed(2)),
      
      // Quota metrics
      sisa_cuti: pending.sisa_cuti,
      total_cuti_tahunan: pending.total_cuti_tahunan || 12,
      sisa_cuti_tahun_lalu: pending.sisa_cuti_tahun_lalu || 0,
      total_cuti_tersedia: (pending.total_cuti_tahunan || 12) + (pending.sisa_cuti_tahun_lalu || 0),
      total_cuti_diambil: ((pending.total_cuti_tahunan || 12) + (pending.sisa_cuti_tahun_lalu || 0)) - pending.sisa_cuti,
      cuti_usage_rate: parseFloat((((pending.total_cuti_tahunan || 12) + (pending.sisa_cuti_tahun_lalu || 0) - pending.sisa_cuti) / ((pending.total_cuti_tahunan || 12) + (pending.sisa_cuti_tahun_lalu || 0)) * 100).toFixed(2)),
      
      // Tenure metrics
      masa_kerja: masaKerja,
      masa_kerja_tahun: parseFloat((masaKerja / 365).toFixed(1)),
      tanggal_masuk: pending.tanggal_masuk,
      avg_leave_days: approvedCount > 0 ? parseFloat(((((pending.total_cuti_tahunan || 12) + (pending.sisa_cuti_tahun_lalu || 0)) - pending.sisa_cuti) / approvedCount).toFixed(1)) : 0,
      // C1-C5 values
      c1: sumLeave,                                    // Total Hari Cuti Diajukan (cost)
      c2: totalPengajuan,                              // Total Pengajuan (cost)
      c3: parseFloat(approvalRate.toFixed(2)),          // Approval Rate % (benefit)
      c4: pending.sisa_cuti,                           // Sisa Akhir Cuti (benefit)
      c5: masaKerja                                    // Masa Kerja Hari (benefit)
    });
  }

  return alternatives;
}

// Helper: perform SAW calculation
async function calculateSAW(alternatives) {
  // Get criteria
  const criteriaResult = await pool.query('SELECT * FROM criteria ORDER BY kode ASC');
  const criteria = criteriaResult.rows;

  if (alternatives.length === 0 || criteria.length === 0) {
    return { matrix: [], normalized: [], preference: [], ranking: [], criteria };
  }

  // Build decision matrix (X) — keep original alt data attached
  const matrix = alternatives.map((alt, index) => ({
    no: index + 1,
    alternative: `A${index + 1}`,
    name: alt.name,
    // Carry forward original data
    jenis_cuti: alt.jenis_cuti,
    tanggal_mulai: alt.tanggal_mulai,
    tanggal_selesai: alt.tanggal_selesai,
    masa_kerja: alt.masa_kerja,
    leave_id: alt.leave_id,
    employee_id: alt.employee_id,
    email: alt.email,
    total_hari: alt.total_hari,
    values: criteria.map(c => {
      // Use sumber_data column if available, fallback to kode (c1, c2, etc.)
      if (c.sumber_data && alt[c.sumber_data] !== undefined) {
        return alt[c.sumber_data] || 0;
      }
      const key = c.kode.toLowerCase();
      return alt[key] || 0;
    })
  }));

  // Find max and min for each criterion
  const maxValues = criteria.map((c, i) =>
    Math.max(...matrix.map(row => row.values[i]))
  );
  const minValues = criteria.map((c, i) =>
    Math.min(...matrix.map(row => row.values[i]))
  );

  // Normalize: benefit = Xij / Max(Xi), cost = Min(Xi) / Xij
  const normalized = matrix.map(row => ({
    ...row,
    normalizedValues: row.values.map((val, i) => {
      if (val === 0) return 0;
      if (criteria[i].tipe === 'benefit') {
        return maxValues[i] === 0 ? 0 : parseFloat((val / maxValues[i]).toFixed(3));
      } else {
        // cost
        return val === 0 ? 0 : parseFloat((minValues[i] / val).toFixed(3));
      }
    })
  }));

  // Calculate preference values: Vi = Sum(Wj * Rij)
  const weights = criteria.map(c => parseFloat(c.bobot) / 100);
  
  const preference = normalized.map(row => {
    const vValues = row.normalizedValues.map((r, i) =>
      parseFloat((weights[i] * r).toFixed(3))
    );
    const score = parseFloat(vValues.reduce((sum, v) => sum + v, 0).toFixed(4));
    
    return {
      ...row,
      vValues,
      score,
      antiTieScore: score // Can add tiebreaker logic
    };
  });

  // Sort by score descending
  const ranking = [...preference]
    .sort((a, b) => b.score - a.score)
    .map((item, index) => {
      let recommendation;
      let recommendationDetail;
      const rank = index + 1;
      const totalAlts = preference.length;
      const topPercent = (rank / totalAlts) * 100;

      if (rank === 1) {
        recommendation = 'Approve dulu';
        recommendationDetail = 'Pengajuan paling layak diproses pertama menurut SPK.';
      } else if (topPercent <= 15 || item.score >= 0.80) {
        recommendation = 'Review prioritas';
        recommendationDetail = 'Prioritas tinggi, proses setelah prioritas 1.';
      } else if (topPercent <= 40 || item.score >= 0.50) {
        recommendation = 'Review normal';
        recommendationDetail = 'Prioritas menengah; tidak urgent tetapi tetap perlu diputuskan.';
      } else {
        recommendation = 'Tahan dulu';
        recommendationDetail = 'Peringkat di bawah ambang di atas.';
      }

      return {
        ...item,
        rank,
        recommendation,
        recommendationDetail
      };
    });

  return { matrix, normalized, preference, ranking, criteria, weights, maxValues, minValues };
}

// GET /api/spk/alternatives - Get alternatives data
router.get('/alternatives', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const alternatives = await getAlternatives();
    const total = alternatives.length;
    const offset = (page - 1) * limit;
    const paged = alternatives.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    // Get criteria for mapping
    const criteriaResult = await pool.query('SELECT * FROM criteria ORDER BY kode ASC');

    res.json({
      data: paged.map((a, i) => ({ ...a, alt_label: `A${parseInt(offset) + i + 1}` })),
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      criteria: criteriaResult.rows
    });
  } catch (err) {
    console.error('Get alternatives error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/spk/matrix - Get decision matrix, normalized matrix, preference values
router.get('/matrix', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const alternatives = await getAlternatives();
    const result = await calculateSAW(alternatives);
    
    const total = result.matrix.length;
    const offset = (page - 1) * limit;
    
    res.json({
      matrix: result.matrix.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
      normalized: result.normalized.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
      preference: result.preference.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
      criteria: result.criteria,
      weights: result.weights,
      maxValues: result.maxValues,
      minValues: result.minValues,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    console.error('Get matrix error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/spk/ranking - Get final ranking with recommendations
router.get('/ranking', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const alternatives = await getAlternatives();
    const result = await calculateSAW(alternatives);
    
    const total = result.ranking.length;
    const offset = (page - 1) * limit;

    res.json({
      data: result.ranking.slice(parseInt(offset), parseInt(offset) + parseInt(limit)),
      criteria: result.criteria,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    console.error('Get ranking error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
