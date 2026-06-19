const express = require('express');
const router = express.Router();
const pool = require('../database/pool');

// Get all approvers
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [dataResult, countResult] = await Promise.all([
      pool.query(
        `SELECT id, employee_id, name, email, gender, department, tanggal_masuk FROM users WHERE role = 'approver' ORDER BY id ASC LIMIT $1 OFFSET $2`,
        [parseInt(limit), parseInt(offset)]
      ),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'approver'`)
    ]);

    res.json({
      data: dataResult.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit))
    });
  } catch (err) {
    console.error('Get approvers error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create approver
router.post('/', async (req, res) => {
  try {
    const { employee_id, name, email, gender, department, tanggal_masuk } = req.body;
    const result = await pool.query(
      `INSERT INTO users (employee_id, name, email, gender, role, department, tanggal_masuk) 
       VALUES ($1, $2, $3, $4, 'approver', $5, $6) RETURNING *`,
      [employee_id, name, email, gender || 'Male', department, tanggal_masuk]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create approver error:', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Employee ID or email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update approver
router.put('/:id', async (req, res) => {
  try {
    const { name, email, gender, department } = req.body;
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, gender=$3, department=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 AND role='approver' RETURNING *`,
      [name, email, gender, department, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Approver not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update approver error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete approver
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND role = $2 RETURNING id',
      [req.params.id, 'approver']
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Approver not found' });
    }
    res.json({ message: 'Approver deleted successfully' });
  } catch (err) {
    console.error('Delete approver error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
