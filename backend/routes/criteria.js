const express = require('express');
const router = express.Router();
const pool = require('../database/pool');

// Get all criteria
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM criteria ORDER BY kode ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Get criteria error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new criterion
router.post('/', async (req, res) => {
  try {
    const { kode, nama, sumber_data, bobot, tipe } = req.body;
    const result = await pool.query(
      'INSERT INTO criteria (kode, nama, sumber_data, bobot, tipe) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [kode, nama, sumber_data, parseFloat(bobot), tipe]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create criterion error:', err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Criterion code already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Update criterion
router.put('/:id', async (req, res) => {
  try {
    const { nama, sumber_data, bobot, tipe } = req.body;
    const result = await pool.query(
      'UPDATE criteria SET nama=$1, sumber_data=$2, bobot=$3, tipe=$4, updated_at=CURRENT_TIMESTAMP WHERE id=$5 RETURNING *',
      [nama, sumber_data, parseFloat(bobot), tipe, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Criterion not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update criterion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete criterion
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM criteria WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Criterion not found' });
    }
    res.json({ message: 'Criterion deleted successfully' });
  } catch (err) {
    console.error('Delete criterion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
