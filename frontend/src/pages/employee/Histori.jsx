import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { IconUser, IconCalendar, IconFileText, IconPhone } from '../../components/Icons';
import api from '../../api';
import { getCutiBadgeClass, getStatusBadgeClass, formatDateRange } from '../../utils/helpers';

export default function Histori() {
  const { onMenuToggle } = useOutletContext();
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const tabs = ['Semua', 'Pending', 'Approved', 'Rejected'];

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 10, user_id: user?.id };
    if (activeTab !== 'Semua') params.status = activeTab;

    api.getLeaves(params)
      .then(data => {
        setLeaves(data.data);
        setTotalPages(data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, activeTab, page]);

  return (
    <>
      <Header title="Histori Pengajuan" subtitle="Riwayat cuti" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <div className="tabs">
          {tabs.map(tab => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setPage(1); }}>
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : leaves.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><IconFileText size={48} /></div>
            <p className="empty-state-text">Belum ada pengajuan cuti</p>
          </div>
        ) : (
          <>
            {leaves.map(leave => (
              <div className="leave-card" key={leave.id}>
                <div className="leave-card-header">
                  <div>
                    <div className="leave-card-employee">
                      <IconUser size={16} style={{ opacity: 0.6 }} /> {leave.employee_email || user?.email}
                      <span className="badge" style={{ fontSize: 10, padding: '2px 8px', border: '1px solid var(--border-color)' }}>
                        {leave.employee_gender || user?.gender}
                      </span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <span className={getCutiBadgeClass(leave.jenis_cuti)}>{leave.jenis_cuti}</span>
                    </div>
                  </div>
                  <span className={getStatusBadgeClass(leave.status)}>{leave.status}</span>
                </div>
                <div className="leave-card-date">
                  <IconCalendar size={14} style={{ opacity: 0.5, marginRight: 4 }} />
                  {formatDateRange(leave.tanggal_mulai, leave.tanggal_selesai)}
                  <span style={{ marginLeft: 8, fontWeight: 600 }}>({leave.total_hari} hari)</span>
                </div>
                <div className="leave-card-reason"><strong>Alasan:</strong> {leave.alasan}</div>
                {leave.catatan && (
                  <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    <IconFileText size={12} style={{ opacity: 0.5, marginRight: 4 }} /> Catatan: {leave.catatan}
                  </div>
                )}
                {leave.alamat_darurat && (
                  <div className="leave-card-contact">
                    <strong><IconPhone size={13} style={{ marginRight: 4 }} /> Kontak Darurat:</strong>
                    {leave.alamat_darurat}<br />
                    Tel: {leave.no_telepon} | HP: {leave.no_hp}
                  </div>
                )}
              </div>
            ))}

            <div className="pagination">
              <span className="pagination-info">Halaman {page} dari {totalPages}</span>
              <div className="pagination-controls">
                <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  ‹ Sebelumnya
                </button>
                <span className="pagination-page">Halaman {page} / {totalPages}</span>
                <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  Berikutnya ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
