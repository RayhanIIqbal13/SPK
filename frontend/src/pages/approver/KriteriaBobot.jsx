import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import { IconEdit, IconTrash, IconPlus, IconX } from '../../components/Icons';
import api from '../../api';

// Available data sources from Data Sumber Alternatif
const SUMBER_DATA_OPTIONS = [
  // --- Pengajuan Cuti ---
  { value: 'sum_leave', label: 'Sum(Leave Period)', desc: 'Total hari cuti yang diajukan (pengajuan ini)', group: 'Pengajuan Cuti' },
  { value: 'total_pengajuan', label: 'Total Pengajuan', desc: 'Jumlah seluruh pengajuan karyawan (semua status)', group: 'Pengajuan Cuti' },
  { value: 'approved', label: 'Approved', desc: 'Jumlah pengajuan yang disetujui', group: 'Pengajuan Cuti' },
  { value: 'rejected', label: 'Rejected', desc: 'Jumlah pengajuan yang ditolak', group: 'Pengajuan Cuti' },
  { value: 'pending_count', label: 'Pending (Raw)', desc: 'Jumlah pengajuan yang masih pending', group: 'Pengajuan Cuti' },
  // --- Persentase & Rasio ---
  { value: 'approval_rate', label: '(Approved/Total)%', desc: 'Persentase approval rate karyawan', group: 'Persentase & Rasio' },
  { value: 'rejection_rate', label: '(Rejected/Total)%', desc: 'Persentase rejection rate karyawan', group: 'Persentase & Rasio' },
  { value: 'cuti_usage_rate', label: 'Tingkat Penggunaan Cuti (%)', desc: 'Persentase cuti yang sudah dipakai dari total tersedia', group: 'Persentase & Rasio' },
  // --- Kuota Cuti ---
  { value: 'total_cuti_tahunan', label: 'Cuti Dasar', desc: 'Jatah cuti tahunan dasar (12 hari)', group: 'Kuota Cuti' },
  { value: 'sisa_cuti_tahun_lalu', label: 'Sisa Lalu', desc: 'Sisa cuti tahun sebelumnya (carry over)', group: 'Kuota Cuti' },
  { value: 'total_cuti_tersedia', label: 'Total Cuti Tersedia', desc: 'Cuti Dasar + Sisa Lalu (total jatah)', group: 'Kuota Cuti' },
  { value: 'total_cuti_diambil', label: 'Total Cuti Diambil', desc: 'Total cuti yang sudah dipakai dari jatah', group: 'Kuota Cuti' },
  { value: 'sisa_cuti', label: 'Sisa Akhir Cuti', desc: 'Sisa cuti yang tersedia saat ini', group: 'Kuota Cuti' },
  // --- Profil Karyawan ---
  { value: 'masa_kerja', label: 'Masa Kerja (Hari)', desc: 'Lama bekerja dalam hari sejak tanggal masuk', group: 'Profil Karyawan' },
  { value: 'masa_kerja_tahun', label: 'Masa Kerja (Tahun)', desc: 'Lama bekerja dalam tahun (pembulatan)', group: 'Profil Karyawan' },
  { value: 'avg_leave_days', label: 'Rata-rata Hari/Pengajuan', desc: 'Rata-rata hari cuti per pengajuan', group: 'Profil Karyawan' },
];

export default function KriteriaBobot() {
  const { onMenuToggle } = useOutletContext();
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ kode: '', nama: '', sumber_data: '', bobot: '', tipe: 'benefit' });

  const fetchData = () => {
    setLoading(true);
    api.getCriteria()
      .then(setCriteria)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem) { await api.updateCriteria(editItem.id, form); }
      else { await api.createCriteria(form); }
      setShowModal(false); setEditItem(null); fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({ kode: item.kode, nama: item.nama, sumber_data: item.sumber_data || '', bobot: item.bobot, tipe: item.tipe });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus kriteria ini?')) return;
    try { await api.deleteCriteria(id); fetchData(); } catch (err) { alert(err.message); }
  };

  // Auto-fill nama when sumber_data is selected
  const handleSumberChange = (value) => {
    const selected = SUMBER_DATA_OPTIONS.find(o => o.value === value);
    setForm(prev => ({
      ...prev,
      sumber_data: value,
      nama: prev.nama || (selected?.label || '')
    }));
  };

  // Get label for a sumber_data value
  const getSumberLabel = (val) => {
    const found = SUMBER_DATA_OPTIONS.find(o => o.value === val);
    return found ? found.label : val;
  };

  return (
    <>
      <Header title="Kriteria & Bobot" subtitle="Konfigurasi SAW" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <h1 className="page-title">Kriteria dan Bobot</h1>

        <div className="info-box">
          <strong>Tambah kriteria + pilih sumber data</strong><br />
          Saat <strong>Tambah Kriteria</strong>, pilih <strong>Sumber Data</strong> dari dropdown (otomatis dari kolom Data Sumber Alternatif). Nama kriteria hanya label; angka dihitung otomatis di menu Alternatif / Matrix / Ranking.
        </div>

        <button className="btn btn-teal" onClick={() => {
          setEditItem(null);
          setForm({ kode: '', nama: '', sumber_data: '', bobot: '', tipe: 'benefit' });
          setShowModal(true);
        }} style={{ marginBottom: 20 }}>
          <IconPlus size={16} /> Tambah Kriteria
        </button>

        <div className="card">
          {loading ? <div className="loading"><div className="spinner"></div></div> : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>KRITERIA (label)</th>
                      <th>SUMBER DATA (kolom)</th>
                      <th>BOBOT (%)</th>
                      <th>TYPE</th>
                      <th>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.kode}</td>
                        <td>{c.nama}</td>
                        <td>
                          <span style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', borderRadius: 6, fontSize: 12.5,
                            background: 'var(--bg-hover)', fontWeight: 500
                          }}>
                            {getSumberLabel(c.sumber_data)}
                          </span>
                        </td>
                        <td className="numeric bold">{c.bobot}%</td>
                        <td>
                          <span className={c.tipe === 'cost' ? 'badge-cost' : 'badge-benefit'}>
                            {c.tipe === 'cost' ? 'Cost' : 'Benefit'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon" onClick={() => handleEdit(c)}><IconEdit size={16} /></button>
                            <button className="btn-icon" onClick={() => handleDelete(c.id)}><IconTrash size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <span className="pagination-info">Menampilkan 1–{criteria.length} dari {criteria.length} baris</span>
                <div className="pagination-controls">
                  <button className="pagination-btn" disabled>‹ Sebelumnya</button>
                  <span className="pagination-page">Halaman 1 / 1</span>
                  <button className="pagination-btn" disabled>Berikutnya ›</button>
                </div>
              </div>
            </>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editItem ? 'Edit Kriteria' : 'Tambah Kriteria'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}><IconX size={18} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Kode <span className="required">*</span></label>
                    <input className="form-input" value={form.kode} onChange={e => setForm({...form, kode: e.target.value})} required disabled={!!editItem} placeholder="C6" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nama Kriteria <span className="required">*</span></label>
                    <input className="form-input" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} required placeholder="Misal: Masa Kerja" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sumber Data <span className="required">*</span></label>
                  <select
                    className="form-select"
                    value={form.sumber_data}
                    onChange={e => handleSumberChange(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Kolom Sumber Data --</option>
                    {['Pengajuan Cuti', 'Persentase & Rasio', 'Kuota Cuti', 'Profil Karyawan'].map(group => (
                      <optgroup key={group} label={group}>
                        {SUMBER_DATA_OPTIONS.filter(o => o.group === group).map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label} — {opt.desc}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {form.sumber_data && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: 8, fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      Kolom yang dipilih: <strong>{getSumberLabel(form.sumber_data)}</strong>
                      <br />
                      {SUMBER_DATA_OPTIONS.find(o => o.value === form.sumber_data)?.desc}
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Bobot (%) <span className="required">*</span></label>
                    <input className="form-input" type="number" min="0" max="100" value={form.bobot} onChange={e => setForm({...form, bobot: e.target.value})} required placeholder="30" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tipe <span className="required">*</span></label>
                    <select className="form-select" value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})}>
                      <option value="benefit">Benefit (semakin tinggi semakin baik)</option>
                      <option value="cost">Cost (semakin rendah semakin baik)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
