import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { IconPhone, IconFileText, IconCheck } from '../../components/Icons';
import api from '../../api';

const JENIS_CUTI = [
  'Cuti Tahunan',
  'Cuti Melahirkan',
  'Cuti Bersama',
  'Cuti Pengganti Istirahat',
  'Cuti Panjang (Masa Kerja)',
];

export default function PengajuanBaru() {
  const { onMenuToggle } = useOutletContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    jenis_cuti: '',
    gender: user?.gender || '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    alasan: '',
    alamat_darurat: '',
    no_telepon: '',
    no_hp: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jenis_cuti || !form.tanggal_mulai || !form.tanggal_selesai || !form.alasan) {
      alert('Harap lengkapi semua field wajib');
      return;
    }
    setLoading(true);
    try {
      await api.submitLeave({
        user_id: user.id,
        ...form,
      });
      setSuccess(true);
      setForm({
        jenis_cuti: '', gender: user?.gender || '', tanggal_mulai: '', tanggal_selesai: '',
        alasan: '', alamat_darurat: '', no_telepon: '', no_hp: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Gagal: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Header title="Pengajuan Baru" subtitle="Buat pengajuan" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        {success && (
          <div className="toast-container">
            <div className="toast toast-success">
              <IconCheck size={16} style={{ marginRight: 6 }} /> Pengajuan cuti berhasil dikirim!
            </div>
          </div>
        )}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Karyawan</label>
              <input className="form-input" value={user?.email || ''} disabled />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender <span className="required">*</span></label>
                <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Pilih Gender</option>
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Cuti <span className="required">*</span></label>
                <select className="form-select" name="jenis_cuti" value={form.jenis_cuti} onChange={handleChange}>
                  <option value="">Pilih Jenis Cuti</option>
                  {JENIS_CUTI.map(jc => <option key={jc} value={jc}>{jc}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tanggal Mulai <span className="required">*</span></label>
                <input className="form-input" type="date" name="tanggal_mulai" value={form.tanggal_mulai} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Tanggal Selesai <span className="required">*</span></label>
                <input className="form-input" type="date" name="tanggal_selesai" value={form.tanggal_selesai} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alasan/Keterangan <span className="required">*</span></label>
              <textarea className="form-textarea" name="alasan" value={form.alasan} onChange={handleChange}
                placeholder="Tuliskan alasan pengajuan cuti..." />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '24px 0' }} />

            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <IconPhone size={18} /> <span>Kontak Darurat</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Alamat Darurat</label>
              <textarea className="form-textarea" name="alamat_darurat" value={form.alamat_darurat} onChange={handleChange}
                placeholder="Alamat yang bisa dihubungi saat cuti..." style={{ minHeight: 70 }} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">No. Telepon</label>
                <input className="form-input" name="no_telepon" value={form.no_telepon} onChange={handleChange} placeholder="021-xxx" />
              </div>
              <div className="form-group">
                <label className="form-label">No. HP</label>
                <input className="form-input" name="no_hp" value={form.no_hp} onChange={handleChange} placeholder="08xxx" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, marginRight: 6 }}></span> Mengirim...</>
                ) : (
                  <><IconFileText size={16} /> Kirim Pengajuan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
