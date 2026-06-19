-- =============================================
-- Portal Cuti SPK - Seed Data
-- =============================================

-- Insert Approvers
INSERT INTO users (employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti) VALUES
('AP0001', 'Budi Santoso', 'budi.santoso@kpc.co.id', 'Male', 'approver', 'HRD', '2018-03-15', 12, 0, 12),
('AP0002', 'Siti Rahayu', 'siti.rahayu@kpc.co.id', 'Female', 'approver', 'Finance', '2019-07-01', 12, 2, 14);

-- Insert Employees (39 karyawan)
INSERT INTO users (employee_id, name, email, gender, role, department, tanggal_masuk, total_cuti_tahunan, sisa_cuti_tahun_lalu, sisa_cuti) VALUES
('HH3185', 'Rian Mulyadi', 'rian.mulyadi@kpc.co.id', 'Male', 'karyawan', 'IT', '2019-08-01', 12, 2, 14),
('VW4634', 'Sari Handayani', 'sari.handayani@kpc.co.id', 'Female', 'karyawan', 'HRD', '2020-03-15', 12, 1, 12),
('SG7127', 'Joko Susanto', 'joko.susanto@kpc.co.id', 'Male', 'karyawan', 'Finance', '2018-11-20', 12, 1, 12),
('VF6551', 'Budi Santoso Jr', 'budi.santoso.jr@kpc.co.id', 'Male', 'karyawan', 'IT', '2019-05-10', 12, 1, 12),
('MB5413', 'Nina Marlina', 'nina.marlina@kpc.co.id', 'Female', 'karyawan', 'Marketing', '2017-02-14', 12, 3, 14),
('RK8821', 'Rayhan Iqbal', 'rayhan.iqbal@kpc.co.id', 'Male', 'karyawan', 'IT', '2023-01-10', 12, 0, 6),
('PL2290', 'Rina Wijaya', 'rina.wijaya@kpc.co.id', 'Female', 'karyawan', 'Finance', '2021-06-01', 12, 0, 6),
('TN7742', 'Eko Hartono', 'eko.hartono@kpc.co.id', 'Male', 'karyawan', 'Operations', '2022-04-20', 12, 0, 6),
('DW3318', 'Maya Putri', 'maya.putri@kpc.co.id', 'Female', 'karyawan', 'Marketing', '2020-09-01', 12, 1, 8),
('BY1192', 'Fajar Nugroho', 'fajar.nugroho@kpc.co.id', 'Male', 'karyawan', 'IT', '2018-12-01', 12, 3, 15),
('KL4423', 'Salsa Gunawan', 'salsa.gunawan@kpc.co.id', 'Female', 'karyawan', 'HRD', '2016-10-15', 12, 3, 15),
('MN5567', 'Ahmad Lestari', 'ahmad.lestari@kpc.co.id', 'Male', 'karyawan', 'Finance', '2019-04-22', 12, 2, 14),
('OP7789', 'Rizki Maulana', 'rizki.maulana@kpc.co.id', 'Male', 'karyawan', 'IT', '2021-01-05', 12, 1, 11),
('QR9912', 'Doni Saputra', 'doni.saputra@kpc.co.id', 'Male', 'karyawan', 'Operations', '2019-11-10', 12, 2, 13),
('ST1234', 'Kartika Kusuma', 'kartika.kusuma@kpc.co.id', 'Female', 'karyawan', 'Marketing', '2020-05-20', 12, 1, 11),
('UV3456', 'Farhan Siregar', 'farhan.siregar@kpc.co.id', 'Male', 'karyawan', 'Finance', '2017-08-01', 12, 3, 15),
('WX5678', 'Omar Ramadhan', 'omar.ramadhan@kpc.co.id', 'Male', 'karyawan', 'IT', '2022-07-15', 12, 0, 8),
('YZ7890', 'Taufik Rahmawati', 'taufik.rahmawati@kpc.co.id', 'Male', 'karyawan', 'HRD', '2021-03-10', 12, 1, 10),
('AB2345', 'Dewi Anggraeni', 'dewi.anggraeni@kpc.co.id', 'Female', 'karyawan', 'Operations', '2018-06-25', 12, 2, 13),
('CD4567', 'Hendra Wijaya', 'hendra.wijaya@kpc.co.id', 'Male', 'karyawan', 'Finance', '2020-01-15', 12, 1, 11),
('EF6789', 'Linda Permata', 'linda.permata@kpc.co.id', 'Female', 'karyawan', 'Marketing', '2019-09-01', 12, 2, 12),
('GH8901', 'Arif Budiman', 'arif.budiman@kpc.co.id', 'Male', 'karyawan', 'IT', '2017-11-20', 12, 3, 14),
('IJ0123', 'Putri Wulandari', 'putri.wulandari@kpc.co.id', 'Female', 'karyawan', 'HRD', '2020-08-10', 12, 1, 11),
('KM2345', 'Rendi Pratama', 'rendi.pratama@kpc.co.id', 'Male', 'karyawan', 'Operations', '2021-12-01', 12, 0, 9),
('NO4567', 'Siska Melati', 'siska.melati@kpc.co.id', 'Female', 'karyawan', 'Finance', '2019-02-20', 12, 2, 13),
('PQ6789', 'Yoga Hermawan', 'yoga.hermawan@kpc.co.id', 'Male', 'karyawan', 'Marketing', '2018-04-10', 12, 2, 14),
('RS8901', 'Anisa Fitriani', 'anisa.fitriani@kpc.co.id', 'Female', 'karyawan', 'IT', '2022-02-15', 12, 0, 8),
('TU0123', 'Bayu Setiawan', 'bayu.setiawan@kpc.co.id', 'Male', 'karyawan', 'HRD', '2020-06-01', 12, 1, 11),
('VW2345', 'Mega Purnama', 'mega.purnama@kpc.co.id', 'Female', 'karyawan', 'Operations', '2019-10-15', 12, 2, 12),
('XY4567', 'Irfan Hakim', 'irfan.hakim@kpc.co.id', 'Male', 'karyawan', 'Finance', '2017-07-20', 12, 3, 15),
('ZA6789', 'Ratna Sari', 'ratna.sari@kpc.co.id', 'Female', 'karyawan', 'Marketing', '2021-05-10', 12, 0, 10),
('BC8901', 'Gilang Ramadhan', 'gilang.ramadhan@kpc.co.id', 'Male', 'karyawan', 'IT', '2018-09-01', 12, 2, 14),
('DE0123', 'Wulan Dari', 'wulan.dari@kpc.co.id', 'Female', 'karyawan', 'HRD', '2020-11-20', 12, 1, 10),
('FG2345', 'Andi Prasetyo', 'andi.prasetyo@kpc.co.id', 'Male', 'karyawan', 'Operations', '2019-03-15', 12, 2, 13),
('HI4567', 'Cindy Oktavia', 'cindy.oktavia@kpc.co.id', 'Female', 'karyawan', 'Finance', '2022-01-10', 12, 0, 9),
('JK6789', 'Dimas Kurniawan', 'dimas.kurniawan@kpc.co.id', 'Male', 'karyawan', 'Marketing', '2018-05-25', 12, 3, 14),
('LM8901', 'Elsa Maharani', 'elsa.maharani@kpc.co.id', 'Female', 'karyawan', 'IT', '2021-08-01', 12, 0, 10),
('NP0123', 'Ferry Gunawan', 'ferry.gunawan@kpc.co.id', 'Male', 'karyawan', 'HRD', '2019-06-15', 12, 2, 12),
('QS2345', 'Gita Permatasari', 'gita.permatasari@kpc.co.id', 'Female', 'karyawan', 'Operations', '2020-04-01', 12, 1, 11);

-- Insert Criteria (C1-C5)
INSERT INTO criteria (kode, nama, sumber_data, bobot, tipe) VALUES
('C1', 'Total Hari Cuti Diajukan', 'Jumlah hari cuti pada pengajuan pending ini (total_day / rentang tanggal)', 30, 'cost'),
('C2', 'Total Pengajuan', 'Jumlah seluruh pengajuan cuti karyawan (semua status)', 20, 'cost'),
('C3', 'Approval Rate', 'Approval Rate (%)(Approved ÷ total pengajuan) × 100', 20, 'benefit'),
('C4', 'Sisa Akhir Cuti', 'Field total_remaining_year pada profil/pengajuan', 15, 'benefit'),
('C5', 'Masa Kerja (Hari)', 'Selisih hari dari tanggal masuk sampai hari ini', 15, 'benefit');

-- Insert Leave Requests (mix of Pending, Approved, Rejected)
-- Pending requests (will be used as SAW alternatives)
INSERT INTO leave_requests (user_id, jenis_cuti, tanggal_mulai, tanggal_selesai, total_hari, alasan, status, alamat_darurat, no_telepon, no_hp) VALUES
((SELECT id FROM users WHERE employee_id='HH3185'), 'Cuti Pengganti Istirahat', '2026-05-03', '2026-05-04', 2, 'Istirahat setelah lembur', 'Pending', 'Jl. Merdeka No. 10', '021-1234567', '081234567890'),
((SELECT id FROM users WHERE employee_id='VW4634'), 'Cuti Melahirkan', '2026-05-04', '2026-05-06', 3, 'Cuti melahirkan', 'Pending', 'Jl. Sudirman No. 50', '021-2345678', '082345678901'),
((SELECT id FROM users WHERE employee_id='SG7127'), 'Cuti Panjang (Masa Kerja)', '2026-05-05', '2026-05-08', 4, 'Cuti panjang masa kerja', 'Pending', 'Jl. Gatot Subroto No. 20', '021-3456789', '083456789012'),
((SELECT id FROM users WHERE employee_id='VF6551'), 'Cuti Tahunan', '2026-05-06', '2026-05-10', 5, 'Liburan keluarga', 'Pending', 'Jl. Thamrin No. 30', '021-4567890', '084567890123'),
((SELECT id FROM users WHERE employee_id='MB5413'), 'Cuti Bersama', '2026-05-07', '2026-05-08', 2, 'Cuti bersama lebaran', 'Pending', 'Jl. Kuningan No. 15', '021-5678901', '085678901234'),
((SELECT id FROM users WHERE employee_id='RK8821'), 'Cuti Pengganti Istirahat', '2026-05-08', '2026-05-10', 3, 'Pengganti istirahat', 'Pending', 'Jl. Rasuna Said No. 22', '021-6789012', '086789012345'),
((SELECT id FROM users WHERE employee_id='PL2290'), 'Cuti Melahirkan', '2026-05-09', '2026-05-12', 4, 'Cuti melahirkan', 'Pending', 'Jl. Casablanca No. 8', '021-7890123', '087890123456'),
((SELECT id FROM users WHERE employee_id='TN7742'), 'Cuti Panjang (Masa Kerja)', '2026-05-10', '2026-05-14', 5, 'Masa kerja panjang', 'Pending', 'Jl. MT Haryono No. 40', '021-8901234', '088901234567'),
((SELECT id FROM users WHERE employee_id='DW3318'), 'Cuti Tahunan', '2026-05-11', '2026-05-12', 2, 'Urusan pribadi', 'Pending', 'Jl. Pancoran No. 5', '021-9012345', '089012345678'),
((SELECT id FROM users WHERE employee_id='BY1192'), 'Cuti Bersama', '2026-05-12', '2026-05-14', 3, 'Cuti bersama', 'Pending', 'Jl. Kalibata No. 12', '021-0123456', '080123456789'),
((SELECT id FROM users WHERE employee_id='KL4423'), 'Cuti Melahirkan', '2026-05-19', '2026-05-20', 2, 'Cuti melahirkan anak', 'Pending', 'Jl. Pasar Minggu No. 7', '021-1112233', '081112233445'),
((SELECT id FROM users WHERE employee_id='MN5567'), 'Cuti Pengganti Istirahat', '2026-05-03', '2026-05-04', 2, 'Pengganti lembur', 'Pending', 'Jl. Tebet No. 18', '021-2223344', '082223344556'),
((SELECT id FROM users WHERE employee_id='OP7789'), 'Cuti Panjang (Masa Kerja)', '2026-05-15', '2026-05-16', 2, 'Masa kerja', 'Pending', 'Jl. Manggarai No. 25', '021-3334455', '083334455667'),
((SELECT id FROM users WHERE employee_id='QR9912'), 'Cuti Melahirkan', '2026-05-19', '2026-05-20', 2, 'Pendampingan melahirkan', 'Pending', 'Jl. Cikini No. 33', '021-4445566', '084445566778'),
((SELECT id FROM users WHERE employee_id='ST1234'), 'Cuti Tahunan', '2026-05-11', '2026-05-12', 2, 'Cuti tahunan', 'Pending', 'Jl. Menteng No. 40', '021-5556677', '085556677889'),
((SELECT id FROM users WHERE employee_id='UV3456'), 'Cuti Bersama', '2026-05-07', '2026-05-08', 2, 'Cuti bersama', 'Pending', 'Jl. Senayan No. 55', '021-6667788', '086667788990'),
((SELECT id FROM users WHERE employee_id='WX5678'), 'Cuti Pengganti Istirahat', '2026-05-15', '2026-05-16', 2, 'Ganti istirahat', 'Pending', 'Jl. Kemang No. 60', '021-7778899', '087778899001'),
((SELECT id FROM users WHERE employee_id='YZ7890'), 'Cuti Panjang (Masa Kerja)', '2026-05-20', '2026-05-22', 3, 'Cuti masa kerja', 'Pending', 'Jl. Ampera No. 15', '021-8889900', '088889900112'),
((SELECT id FROM users WHERE employee_id='AB2345'), 'Cuti Tahunan', '2026-05-06', '2026-05-08', 3, 'Urusan keluarga', 'Pending', 'Jl. Cilandak No. 22', '021-9990011', '089990011223'),
((SELECT id FROM users WHERE employee_id='CD4567'), 'Cuti Melahirkan', '2026-05-10', '2026-05-13', 4, 'Pendampingan melahirkan', 'Pending', 'Jl. Lebak Bulus No. 30', '021-0001122', '080001122334'),
((SELECT id FROM users WHERE employee_id='EF6789'), 'Cuti Bersama', '2026-05-07', '2026-05-09', 3, 'Cuti bersama', 'Pending', 'Jl. Pondok Indah No. 45', '021-1113355', '081113355667'),
((SELECT id FROM users WHERE employee_id='GH8901'), 'Cuti Pengganti Istirahat', '2026-05-14', '2026-05-16', 3, 'Pengganti lembur weekend', 'Pending', 'Jl. Kebayoran No. 50', '021-2224466', '082224466778'),
((SELECT id FROM users WHERE employee_id='IJ0123'), 'Cuti Tahunan', '2026-05-08', '2026-05-10', 3, 'Cuti tahunan', 'Pending', 'Jl. Blok M No. 35', '021-3335577', '083335577889'),
((SELECT id FROM users WHERE employee_id='KM2345'), 'Cuti Panjang (Masa Kerja)', '2026-05-12', '2026-05-14', 3, 'Masa kerja', 'Pending', 'Jl. Slipi No. 10', '021-4446688', '084446688990'),
((SELECT id FROM users WHERE employee_id='NO4567'), 'Cuti Melahirkan', '2026-05-16', '2026-05-19', 4, 'Cuti melahirkan', 'Pending', 'Jl. Tomang No. 28', '021-5557799', '085557799001'),
((SELECT id FROM users WHERE employee_id='PQ6789'), 'Cuti Bersama', '2026-05-07', '2026-05-09', 3, 'Cuti bersama idul fitri', 'Pending', 'Jl. Grogol No. 17', '021-6668800', '086668800112'),
((SELECT id FROM users WHERE employee_id='RS8901'), 'Cuti Pengganti Istirahat', '2026-05-18', '2026-05-20', 3, 'Pengganti lembur', 'Pending', 'Jl. Cengkareng No. 42', '021-7779911', '087779911223'),
((SELECT id FROM users WHERE employee_id='TU0123'), 'Cuti Tahunan', '2026-05-09', '2026-05-12', 4, 'Cuti tahunan', 'Pending', 'Jl. Kalideres No. 55', '021-8880022', '088880022334'),
((SELECT id FROM users WHERE employee_id='VW2345'), 'Cuti Panjang (Masa Kerja)', '2026-05-13', '2026-05-15', 3, 'Masa kerja', 'Pending', 'Jl. Daan Mogot No. 60', '021-9991133', '089991133445'),
((SELECT id FROM users WHERE employee_id='XY4567'), 'Cuti Melahirkan', '2026-05-20', '2026-05-23', 4, 'Pendampingan melahirkan', 'Pending', 'Jl. Tangerang No. 8', '021-0002244', '080002244556'),
((SELECT id FROM users WHERE employee_id='ZA6789'), 'Cuti Bersama', '2026-05-07', '2026-05-08', 2, 'Cuti bersama', 'Pending', 'Jl. Serpong No. 15', '021-1114466', '081114466778'),
((SELECT id FROM users WHERE employee_id='BC8901'), 'Cuti Tahunan', '2026-05-11', '2026-05-14', 4, 'Liburan keluarga', 'Pending', 'Jl. BSD No. 22', '021-2225577', '082225577889'),
((SELECT id FROM users WHERE employee_id='DE0123'), 'Cuti Pengganti Istirahat', '2026-05-15', '2026-05-17', 3, 'Pengganti istirahat', 'Pending', 'Jl. Bintaro No. 30', '021-3336688', '083336688990'),
((SELECT id FROM users WHERE employee_id='FG2345'), 'Cuti Panjang (Masa Kerja)', '2026-05-10', '2026-05-13', 4, 'Masa kerja panjang', 'Pending', 'Jl. Ciputat No. 18', '021-4447799', '084447799001'),
((SELECT id FROM users WHERE employee_id='HI4567'), 'Cuti Tahunan', '2026-05-08', '2026-05-10', 3, 'Cuti tahunan', 'Pending', 'Jl. Cinere No. 25', '021-5558800', '085558800112'),
((SELECT id FROM users WHERE employee_id='JK6789'), 'Cuti Melahirkan', '2026-05-17', '2026-05-20', 4, 'Pendampingan melahirkan', 'Pending', 'Jl. Depok No. 40', '021-6669911', '086669911223'),
((SELECT id FROM users WHERE employee_id='LM8901'), 'Cuti Bersama', '2026-05-07', '2026-05-09', 3, 'Cuti bersama', 'Pending', 'Jl. Bogor No. 50', '021-7770022', '087770022334'),
((SELECT id FROM users WHERE employee_id='NP0123'), 'Cuti Pengganti Istirahat', '2026-05-16', '2026-05-18', 3, 'Pengganti lembur', 'Pending', 'Jl. Bekasi No. 35', '021-8881133', '088881133445'),
((SELECT id FROM users WHERE employee_id='QS2345'), 'Cuti Tahunan', '2026-05-09', '2026-05-11', 3, 'Urusan keluarga', 'Pending', 'Jl. Cikarang No. 60', '021-9992244', '089992244556');

-- Insert some Approved leave requests (historical)
INSERT INTO leave_requests (user_id, jenis_cuti, tanggal_mulai, tanggal_selesai, total_hari, alasan, status, alamat_darurat, no_telepon, no_hp, processed_by, processed_at, catatan) VALUES
((SELECT id FROM users WHERE employee_id='HH3185'), 'Cuti Tahunan', '2026-01-10', '2026-01-12', 3, 'Liburan awal tahun', 'Approved', 'Jl. Merdeka No. 10', '021-1234567', '081234567890', (SELECT id FROM users WHERE employee_id='AP0001'), '2026-01-08', 'Disetujui'),
((SELECT id FROM users WHERE employee_id='VW4634'), 'Cuti Bersama', '2026-01-15', '2026-01-17', 3, 'Cuti bersama', 'Approved', 'Jl. Sudirman No. 50', '021-2345678', '082345678901', (SELECT id FROM users WHERE employee_id='AP0001'), '2026-01-13', 'Disetujui'),
((SELECT id FROM users WHERE employee_id='SG7127'), 'Cuti Tahunan', '2026-02-01', '2026-02-03', 3, 'Acara keluarga', 'Approved', 'Jl. Gatot Subroto No. 20', '021-3456789', '083456789012', (SELECT id FROM users WHERE employee_id='AP0002'), '2026-01-30', 'Disetujui'),
((SELECT id FROM users WHERE employee_id='KL4423'), 'Cuti Tahunan', '2026-02-10', '2026-02-12', 3, 'Istirahat', 'Approved', 'Jl. Pasar Minggu No. 7', '021-1112233', '081112233445', (SELECT id FROM users WHERE employee_id='AP0001'), '2026-02-08', 'Approved'),
((SELECT id FROM users WHERE employee_id='MN5567'), 'Cuti Bersama', '2026-03-01', '2026-03-03', 3, 'Cuti bersama', 'Approved', 'Jl. Tebet No. 18', '021-2223344', '082223344556', (SELECT id FROM users WHERE employee_id='AP0002'), '2026-02-28', 'Disetujui'),
((SELECT id FROM users WHERE employee_id='MB5413'), 'Cuti Tahunan', '2026-03-10', '2026-03-12', 3, 'Liburan', 'Approved', 'Jl. Kuningan No. 15', '021-5678901', '085678901234', (SELECT id FROM users WHERE employee_id='AP0001'), '2026-03-08', 'Disetujui'),
((SELECT id FROM users WHERE employee_id='QR9912'), 'Cuti Tahunan', '2026-03-15', '2026-03-17', 3, 'Urusan keluarga', 'Approved', 'Jl. Cikini No. 33', '021-4445566', '084445566778', (SELECT id FROM users WHERE employee_id='AP0002'), '2026-03-13', 'Approved');

-- Insert some Rejected leave requests
INSERT INTO leave_requests (user_id, jenis_cuti, tanggal_mulai, tanggal_selesai, total_hari, alasan, status, alamat_darurat, no_telepon, no_hp, processed_by, processed_at, catatan) VALUES
((SELECT id FROM users WHERE employee_id='HH3185'), 'Cuti Panjang (Masa Kerja)', '2026-04-01', '2026-04-10', 10, 'Ingin cuti panjang', 'Rejected', 'Jl. Merdeka No. 10', '021-1234567', '081234567890', (SELECT id FROM users WHERE employee_id='AP0001'), '2026-03-29', 'Jatah cuti tidak mencukupi'),
((SELECT id FROM users WHERE employee_id='VW4634'), 'Cuti Tahunan', '2026-04-05', '2026-04-07', 3, 'Urusan pribadi', 'Rejected', 'Jl. Sudirman No. 50', '021-2345678', '082345678901', (SELECT id FROM users WHERE employee_id='AP0002'), '2026-04-03', 'Periode sibuk, tidak bisa ditinggal');
