import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import { IconEdit, IconTrash, IconPlus, IconX } from '../../components/Icons';
import api from '../../api';
import { formatDate } from '../../utils/helpers';

export default function DataKaryawan() {
  const { onMenuToggle } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ employee_id: '', name: '', email: '', gender: 'Male', department: '', tanggal_masuk: '', total_cuti_tahunan: 12, sisa_cuti_tahun_lalu: 0, sisa_cuti: 12 });

  const fetchData = () => {
    setLoading(true);
    api.getEmployees({ page, limit: 10 })
      .then(res => { setData(res.data); setTotalPages(res.totalPages); setTotal(res.total); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await api.updateEmployee(editItem.id, form);
      } else {
        await api.createEmployee(form);
      }
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      employee_id: item.employee_id, name: item.name, email: item.email,
      gender: item.gender, department: item.department || '',
      tanggal_masuk: item.tanggal_masuk?.split('T')[0] || '',
      total_cuti_tahunan: item.total_cuti_tahunan, sisa_cuti_tahun_lalu: item.sisa_cuti_tahun_lalu, sisa_cuti: item.sisa_cuti
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus karyawan ini?')) return;
    try { await api.deleteEmployee(id); fetchData(); }
    catch (err) { alert(err.message); }
  };

  const handleAdd = () => {
    setEditItem(null);
    setForm({ employee_id: '', name: '', email: '', gender: 'Male', department: '', tanggal_masuk: '', total_cuti_tahunan: 12, sisa_cuti_tahun_lalu: 0, sisa_cuti: 12 });
    setShowModal(true);
  };

  return (
    <>
      <Header title="Data Karyawan" subtitle="Akun & master cuti karyawan" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 className="page-title">Data Karyawan</h1>
          <button className="btn btn-teal" onClick={handleAdd}><IconPlus size={16} /> Tambah Karyawan</button>
        </div>
        <div className="card">
          {loading ? <div className="loading"><div className="spinner"></div></div> : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No.</th><th>Employee ID</th><th>Nama</th><th>Email</th><th>Gender</th>
                      <th>Department</th><th>Tgl Masuk</th><th>Sisa Cuti</th><th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={item.id}>
                        <td>{(page - 1) * 10 + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{item.employee_id}</td>
                        <td>{item.name}</td>
                        <td style={{ color: 'var(--accent-blue)' }}>{item.email}</td>
                        <td>{item.gender}</td>
                        <td>{item.department || '-'}</td>
                        <td>{formatDate(item.tanggal_masuk)}</td>
                        <td className="numeric bold">{item.sisa_cuti}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn-icon" onClick={() => handleEdit(item)} title="Edit"><IconEdit size={16} /></button>
                            <button className="btn-icon" onClick={() => handleDelete(item.id)} title="Hapus"><IconTrash size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <span className="pagination-info">Menampilkan {(page-1)*10+1}–{Math.min(page*10, total)} dari {total} baris</span>
                <div className="pagination-controls">
                  <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Sebelumnya</button>
                  <span className="pagination-page">Halaman {page} / {totalPages}</span>
                  <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya ›</button>
                </div>
              </div>
            </>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{editItem ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}><IconX size={18} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Employee ID</label>
                    <input className="form-input" value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})} required disabled={!!editItem} /></div>
                  <div className="form-group"><label className="form-label">Nama</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Gender</label>
                    <select className="form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option value="Male">Male</option><option value="Female">Female</option>
                    </select></div>
                  <div className="form-group"><label className="form-label">Department</label>
                    <input className="form-input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label className="form-label">Tanggal Masuk</label>
                    <input className="form-input" type="date" value={form.tanggal_masuk} onChange={e => setForm({...form, tanggal_masuk: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Sisa Cuti</label>
                    <input className="form-input" type="number" value={form.sisa_cuti} onChange={e => setForm({...form, sisa_cuti: parseInt(e.target.value)})} /></div>
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
