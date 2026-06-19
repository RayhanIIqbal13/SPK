const express = require('express');
const router = express.Router();
const pool = require('../database/pool');

// Login with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }

    // Check credentials (using simple plaintext for now, should use bcrypt in prod)
    const result = await pool.query(
      'SELECT id, employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti FROM users WHERE email = $1 AND password = $2 LIMIT 1',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, gender, department, password, role } = req.body;
    
    if (!name || !email || !gender || !department || !password || !role) {
      return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
    }
    
    // Check if email already exists
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }
    
    // Generate simple employee ID
    const prefix = role === 'approver' ? 'AP' : 'KA';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const employee_id = `${prefix}${randomNum}`;

    const result = await pool.query(
      `INSERT INTO users (employee_id, name, email, password, role, gender, department, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 12, 0, 12) RETURNING id, employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti`,
      [employee_id, name, email, password, role, gender, department]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mendaftar.' });
  }
});

// Login as specific user
router.post('/login/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
