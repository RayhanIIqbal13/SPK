import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { IconTrophy } from '../../components/Icons';
import api from '../../api';
import { getCutiBadgeClass, getRecBadgeClass, formatDateRange } from '../../utils/helpers';

export default function Beranda() {
  const { onMenuToggle } = useOutletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [altCount, setAltCount] = useState(0);

  useEffect(() => {
    Promise.all([
      api.getLeaveStats(),
      api.getRanking({ page: 1, limit: 10 }),
    ])
      .then(([statsData, rankData]) => {
        setStats(statsData);
        setRanking(rankData.data || []);
        setAltCount(rankData.total || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Beranda" subtitle="Ringkasan approver" onMenuToggle={onMenuToggle} />
        <div className="loading"><div className="spinner"></div></div>
      </>
    );
  }

  const totalPengajuan = parseInt(stats.total) || 0;
  const pending = parseInt(stats.pending) || 0;
  const approved = parseInt(stats.approved) || 0;
  const rejected = parseInt(stats.rejected) || 0;

  return (
    <>
      <Header title="Beranda" subtitle="Ringkasan approver" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <h1 className="page-title">Beranda Approver</h1>
        <p className="page-title-sub">
          Ringkasan pengajuan cuti, jumlah alternatif SPK, dan daftar peringkat prioritas berdasarkan evaluasi metode Simple Additive Weighting (SAW).
        </p>

        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Ringkasan pengajuan cuti</h3>

        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-card-label">Total pengajuan</div>
            <div className="stat-card-value">{totalPengajuan}</div>
            <div className="stat-card-sub">Semua status</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Menunggu persetujuan</div>
            <div className="stat-card-value" style={{ color: 'var(--status-pending)' }}>{pending}</div>
            <div className="stat-card-sub">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Disetujui</div>
            <div className="stat-card-value" style={{ color: 'var(--status-approved)' }}>{approved}</div>
            <div className="stat-card-sub">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Ditolak</div>
            <div className="stat-card-value" style={{ color: 'var(--status-rejected)' }}>{rejected}</div>
            <div className="stat-card-sub">Not Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-label">Alternatif SPK (SAW)</div>
            <div className="stat-card-value" style={{ color: 'var(--accent-teal)' }}>{altCount}</div>
            <div className="stat-card-sub">Pengajuan pending diranking</div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 className="card-title">Peringkat pengajuan (metode SAW)</h3>
              <p className="card-description" style={{ marginBottom: 0 }}>
                Menampilkan 10 dari {altCount} alternatif — urutan dari skor tertinggi.
              </p>
            </div>
            <button className="btn btn-teal" onClick={() => navigate('/approver/ranking')}>
              Lihat ranking lengkap
            </button>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Karyawan</th>
                  <th>Jenis Cuti</th>
                  <th>Tanggal</th>
                  <th>Skor SAW</th>
                  <th>Rekomendasi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((item) => (
                  <tr key={item.alternative}>
                    <td>
                      <span className="rank-number">
                        {item.rank === 1 && <span className="rank-medal"><IconTrophy size={16} style={{ color: '#d97706' }} /></span>}
                        #{item.rank}
                      </span>
                    </td>
                    <td>{item.name}</td>
                    <td><span className={getCutiBadgeClass(item.jenis_cuti)}>{item.jenis_cuti}</span></td>
                    <td>{formatDateRange(item.tanggal_mulai, item.tanggal_selesai)}</td>
                    <td className="bold">{item.score?.toFixed(4)}</td>
                    <td><span className={getRecBadgeClass(item.recommendation)}>{item.recommendation}</span></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/approver/persetujuan')}>
                        Buka Persetujuan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
