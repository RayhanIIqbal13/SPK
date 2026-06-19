import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { IconCalendar, IconHistory, IconCheckCircle } from '../../components/Icons';
import api from '../../api';

export default function StatusCuti() {
  const { onMenuToggle } = useOutletContext();
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.getLeaveStatus(user.id)
        .then(setStatus)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return (
      <>
        <Header title="Status Cuti" subtitle="Lihat sisa cuti" onMenuToggle={onMenuToggle} />
        <div className="loading"><div className="spinner"></div></div>
      </>
    );
  }

  return (
    <>
      <Header title="Status Cuti" subtitle="Lihat sisa cuti" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="stat-card-label" style={{ marginBottom: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Total Cuti Tersedia
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                <IconCalendar size={20} />
              </span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--text-primary)', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>
              {status?.total_cuti_tersedia || 0}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center' }}>
              <span className="badge badge-approved" style={{ fontSize: 11, padding: '4px 10px' }}>
                <IconCheckCircle size={12} style={{ marginRight: 4 }} /> Aktif
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="stat-card-label" style={{ marginBottom: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Sisa Tahun Lalu
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                <IconHistory size={20} />
              </span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--text-primary)', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>
              {status?.sisa_tahun_lalu || 0}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--text-muted)' }}>
              Dapat digunakan sampai akhir tahun
            </div>
          </div>

          <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="stat-card-label" style={{ marginBottom: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Cuti Tahun Ini
              </span>
              <span style={{ color: 'var(--text-muted)' }}>
                <IconCalendar size={20} />
              </span>
            </div>
            <div className="stat-card-value" style={{ color: 'var(--text-primary)', fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>
              {status?.cuti_tahun_ini || 0}
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)', fontSize: '13px', color: 'var(--text-muted)' }}>
              Alokasi tahunan {new Date().getFullYear()}
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontWeight: 700 }}>Penggunaan Cuti Tahun Ini</h3>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {status?.used || 0} dari {status?.total_cuti_tersedia || 0} hari terpakai
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${status?.percentage_remaining || 0}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-muted)' }}>
            <span>Sisa: {status?.sisa_cuti || 0} hari</span>
            <span>{status?.percentage_remaining || 0}% tersisa</span>
          </div>
        </div>
      </div>
    </>
  );
}
