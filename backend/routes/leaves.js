const express = require('express');
const router = express.Router();
const pool = require('../database/pool');

// Get all leave requests with filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, user_id } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    const conditions = [];

    if (status && status !== 'Semua') {
      params.push(status);
      conditions.push(`lr.status = $${params.length}`);
    }

    if (user_id) {
      params.push(parseInt(user_id));
      conditions.push(`lr.user_id = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const countQuery = `SELECT COUNT(*) FROM leave_requests lr ${whereClause}`;
    const dataQuery = `
      SELECT lr.*, u.name as employee_name, u.email as employee_email, u.employee_id as emp_id, u.gender as employee_gender,
             p.name as processor_name
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      LEFT JOIN users p ON lr.processed_by = p.id
      ${whereClause}
      ORDER BY lr.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countParams = [...params];
    params.push(parseInt(limit), parseInt(offset));

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
    });
  } catch (err) {
    console.error('Get leaves error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending leave requests
router.get('/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lr.*, u.name as employee_name, u.email as employee_email, u.employee_id as emp_id, u.gender as employee_gender
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      WHERE lr.status = 'Pending'
      ORDER BY lr.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Get pending leaves error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'Pending') as pending,
        COUNT(*) FILTER (WHERE status = 'Approved') as approved,
        COUNT(*) FILTER (WHERE status = 'Rejected') as rejected
      FROM leave_requests
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit new leave request
router.post('/', async (req, res) => {
  try {
    const { user_id, jenis_cuti, tanggal_mulai, tanggal_selesai, alasan, alamat_darurat, no_telepon, no_hp } = req.body;
    
    // Calculate total days
    const start = new Date(tanggal_mulai);
    const end = new Date(tanggal_selesai);
    const total_hari = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const result = await pool.query(
      `INSERT INTO leave_requests (user_id, jenis_cuti, tanggal_mulai, tanggal_selesai, total_hari, alasan, alamat_darurat, no_telepon, no_hp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [user_id, jenis_cuti, tanggal_mulai, tanggal_selesai, total_hari, alasan, alamat_darurat, no_telepon, no_hp]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Submit leave error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve leave request
router.put('/:id/approve', async (req, res) => {
  try {
    const { processed_by, catatan } = req.body;
    
    const result = await pool.query(
      `UPDATE leave_requests SET status='Approved', processed_by=$1, processed_at=CURRENT_TIMESTAMP, catatan=$2, updated_at=CURRENT_TIMESTAMP
       WHERE id=$3 AND status='Pending' RETURNING *`,
      [processed_by, catatan || 'Disetujui', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found or already processed' });
    }

    // Update employee sisa_cuti
    const leave = result.rows[0];
    await pool.query(
      'UPDATE users SET sisa_cuti = sisa_cuti - $1, updated_at=CURRENT_TIMESTAMP WHERE id = $2',
      [leave.total_hari, leave.user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Approve leave error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject leave request
router.put('/:id/reject', async (req, res) => {
  try {
    const { processed_by, catatan } = req.body;
    
    const result = await pool.query(
      `UPDATE leave_requests SET status='Rejected', processed_by=$1, processed_at=CURRENT_TIMESTAMP, catatan=$2, updated_at=CURRENT_TIMESTAMP
       WHERE id=$3 AND status='Pending' RETURNING *`,
      [processed_by, catatan || 'Ditolak', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Leave request not found or already processed' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Reject leave error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get approval history
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const params = [];
    let statusFilter = "lr.status IN ('Approved', 'Rejected')";

    if (status && status !== 'Semua') {
      params.push(status);
      statusFilter = `lr.status = $${params.length}`;
    }

    const countQuery = `SELECT COUNT(*) FROM leave_requests lr WHERE ${statusFilter}`;
    const dataQuery = `
      SELECT lr.*, u.name as employee_name, u.email as employee_email, u.employee_id as emp_id,
             p.name as processor_name
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.id
      LEFT JOIN users p ON lr.processed_by = p.id
      WHERE ${statusFilter}
      ORDER BY lr.processed_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const countParams = [...params];
    params.push(parseInt(limit), parseInt(offset));

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, params),
      pool.query(countQuery, countParams)
    ]);

    res.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
    });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
