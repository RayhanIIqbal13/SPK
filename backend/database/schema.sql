-- =============================================
-- Portal Cuti SPK - Database Schema
-- =============================================

CREATE DATABASE portal_cuti;

\c portal_cuti;

-- Users table (employees + approvers)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    gender VARCHAR(10) NOT NULL DEFAULT 'Male',
    role VARCHAR(20) NOT NULL DEFAULT 'karyawan', -- 'karyawan' or 'approver'
    department VARCHAR(100),
    tanggal_masuk DATE NOT NULL DEFAULT CURRENT_DATE,
    total_cuti_tahunan INT NOT NULL DEFAULT 12,
    sisa_cuti_tahun_lalu INT NOT NULL DEFAULT 0,
    sisa_cuti INT NOT NULL DEFAULT 12,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    jenis_cuti VARCHAR(50) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    total_hari INT NOT NULL DEFAULT 1,
    alasan TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    alamat_darurat TEXT,
    no_telepon VARCHAR(20),
    no_hp VARCHAR(20),
    processed_by INT REFERENCES users (id),
    processed_at TIMESTAMP,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPK Criteria table
CREATE TABLE IF NOT EXISTS criteria (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    sumber_data TEXT,
    bobot DECIMAL(5, 2) NOT NULL DEFAULT 0,
    tipe VARCHAR(10) NOT NULL DEFAULT 'benefit', -- 'cost' or 'benefit'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX idx_leave_requests_user_id ON leave_requests (user_id);

CREATE INDEX idx_leave_requests_status ON leave_requests (status);

CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_users_employee_id ON users (employee_id);