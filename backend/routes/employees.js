const express = require('express');
const router = express.Router();
const pool = require('../database/pool');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `SELECT id, employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti FROM users WHERE role = 'karyawan'`;
    let countQuery = `SELECT COUNT(*) FROM users WHERE role = 'karyawan'`;
    const params = [];
    const countParams = [];
    
    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR employee_id ILIKE $${params.length + 1})`;
      countQuery += ` AND (name ILIKE $${countParams.length + 1} OR email ILIKE $${countParams.length + 1} OR employee_id ILIKE $${countParams.length + 1})`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }
    
    query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));
    
    const [dataResult, countResult] = await Promise.all([
      pool.query(query, params),
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
    console.error('Get employees error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employee by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get employee error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get employee leave status
router.get('/:id/leave-status', async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti FROM users WHERE id = $1',
      [req.params.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    const user = userResult.rows[0];
    const totalAvailable = user.total_cuti_tahunan + user.sisa_cuti_tahun_lalu;
    const used = totalAvailable - user.sisa_cuti;
    
    res.json({
      total_cuti_tersedia: totalAvailable,
      sisa_tahun_lalu: user.sisa_cuti_tahun_lalu,
      cuti_tahun_ini: user.total_cuti_tahunan,
      sisa_cuti: user.sisa_cuti,
      used: used,
      percentage_remaining: totalAvailable > 0 ? Math.round((user.sisa_cuti / totalAvailable) * 100) : 0
    });
  } catch (err) {
    console.error('Get leave status error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new employee
router.post('/', async (req, res) => {
  try {
    const { employee_id, name, email, gender, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu } = req.body;
    const sisa_cuti = (total_cuti_tahunan || 12) + (sisa_cuti_tahun_lalu || 0);
    
    const result = await pool.query(
      `INSERT INTO users (employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti) 
       VALUES ($1, $2, $3, $4, 'karyawan', $5, $6, $7, $8, $9) RETURNING *`,
      [employee_id, name, email, gender || 'Male', department, tanggal_masuk, total_cuti_tahunan || 12, sisa_cuti_tahun_lalu || 0, sisa_cuti]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create employee error:', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Employee ID or email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, gender, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti } = req.body;
    
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, gender=$3, department=$4, tanggal_masuk=$5, total_cuti_tahunan=$6, sisa_cuti_tahun_lalu=$7, sisa_cuti=$8, updated_at=CURRENT_TIMESTAMP 
       WHERE id=$9 RETURNING *`,
      [name, email, gender, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update employee error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Delete employee error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
