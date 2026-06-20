import { useState, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { IconUser, IconCalendar, IconCheck, IconX, IconPhone } from '../../components/Icons';
import api from '../../api';
import { getCutiBadgeClass, formatDateRange } from '../../utils/helpers';

export default function PersetujuanCuti() {
  const { onMenuToggle } = useOutletContext();
  const { user } = useAuth();
  const location = useLocation();
  const highlightId = location.state?.highlightId;
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchPending = () => {
    api.getPendingLeaves()
      .then(setPending)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  useEffect(() => {
    if (highlightId && !loading && pending.length > 0) {
      setTimeout(() => {
        const el = document.getElementById(`leave-${highlightId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [loading, highlightId, pending.length]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (leaveId) => {
    setProcessing(leaveId);
    try {
      await api.approveLeave(leaveId, { processed_by: user.id, catatan: 'Disetujui' });
      showToast('Pengajuan berhasil disetujui');
      fetchPending();
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error');
    }
    setProcessing(null);
  };

  const handleReject = async (leaveId) => {
    const catatan = prompt('Alasan penolakan (opsional):') || 'Ditolak';
    setProcessing(leaveId);
    try {
      await api.rejectLeave(leaveId, { processed_by: user.id, catatan });
      showToast('Pengajuan ditolak');
      fetchPending();
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error');
    }
    setProcessing(null);
  };

  return (
    <>
      <Header title="Status Ajuan" subtitle="Persetujuan cuti" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
          </div>
        )}

        <div className="card" style={{ textAlign: 'center', background: 'var(--status-pending-bg)', borderColor: 'var(--status-pending)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: '50%', background: 'var(--status-pending)',
            color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4
          }}>
            {pending.length}
          </span>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>pengajuan menunggu persetujuan</div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : pending.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><IconCheck size={48} /></div>
            <p className="empty-state-text">Semua pengajuan sudah diproses</p>
          </div>
        ) : (
          pending.map(leave => (
            <div className="leave-card" key={leave.id} id={`leave-${leave.id}`} style={highlightId === leave.id ? { border: '2px solid var(--primary)', boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)' } : {}}>
              <div className="leave-card-header">
                <div>
                  <div className="leave-card-employee">
                    <IconUser size={16} style={{ opacity: 0.6 }} /> {leave.employee_email}
                    <span className="badge" style={{ fontSize: 10, padding: '2px 8px', border: '1px solid var(--border-color)' }}>
                      {leave.employee_gender}
                    </span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span className={getCutiBadgeClass(leave.jenis_cuti)}>{leave.jenis_cuti}</span>
                  </div>
                </div>
                <div className="leave-card-actions" style={{ flexDirection: 'column' }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(leave.id)}
                    disabled={processing === leave.id}>
                    <IconCheck size={14} /> Approve
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleReject(leave.id)}
                    disabled={processing === leave.id}>
                    <IconX size={14} /> Reject
                  </button>
                </div>
              </div>
              <div className="leave-card-date">
                <IconCalendar size={14} style={{ opacity: 0.5, marginRight: 4 }} />
                {formatDateRange(leave.tanggal_mulai, leave.tanggal_selesai)}
              </div>
              <div className="leave-card-reason"><strong>Alasan:</strong> {leave.alasan}</div>
              {leave.alamat_darurat && (
                <div className="leave-card-contact">
                  <strong><IconPhone size={13} style={{ marginRight: 4 }} /> Kontak Darurat:</strong>
                  {leave.alamat_darurat}<br />
                  Tel: {leave.no_telepon} | HP: {leave.no_hp}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
