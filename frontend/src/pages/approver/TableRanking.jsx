import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { IconTrophy } from '../../components/Icons';
import api from '../../api';
import { getCutiBadgeClass, getRecBadgeClass, formatDateRange } from '../../utils/helpers';

export default function TableRanking() {
  const { onMenuToggle } = useOutletContext();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getRanking({ page, limit: 10 })
      .then(res => {
        setData(res.data || []);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Header title="Table Ranking" subtitle="Peringkat prioritas" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <h1 className="page-title">Table Ranking</h1>
        <p className="page-title-sub">
          Peringkat prioritas persetujuan berdasarkan skor akhir SAW (semakin tinggi semakin direkomendasikan). Rekomendasi di bawah ini hanya panduan — keputusan akhir tetap pada approver.
        </p>

        {/* Panduan untuk Approver */}
        <div className="card">
          <h3 className="card-title">Panduan untuk Approver</h3>
          <p className="card-description">
            SPK (Simple Additive Weighting) membandingkan pengajuan pending dengan kriteria & bobot di menu <strong>Kriteria & Bobot</strong>. Gunakan tabel ini untuk memahami kolom dan label rekomendasi.
          </p>

          <h4 style={{ fontWeight: 600, marginBottom: 12, marginTop: 20 }}>Arti kolom di tabel ranking</h4>
          <div className="table-wrapper" style={{ marginBottom: 24 }}>
            <table className="data-table">
              <thead><tr><th>Kolom</th><th>Penjelasan</th></tr></thead>
              <tbody>
                <tr><td><strong>Peringkat (#)</strong></td><td>Urutan prioritas dari perhitungan SAW, #1 = paling direkomendasikan.</td></tr>
                <tr><td><strong>Skor SAW</strong></td><td>Nilai akhir 0–1. Semakin tinggi semakin kuat rekomendasi approve.</td></tr>
                <tr><td><strong>Masa Kerja</strong></td><td>Kriteria C5 — lama bekerja (hari). Biasanya benefit (lebih lama = skor lebih baik).</td></tr>
                <tr><td><strong>Rekomendasi</strong></td><td>Saran tindakan approver berdasarkan peringkat & skor (lihat tabel di bawah).</td></tr>
                <tr><td><strong>Buka Persetujuan</strong></td><td>Pindah ke menu Persetujuan Cuti untuk approve / reject pengajuan.</td></tr>
              </tbody>
            </table>
          </div>

          <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Arti label rekomendasi tindakan</h4>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Label</th><th>Kapan muncul</th><th>Arti</th><th>Tindakan disarankan</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="badge-rec badge-rec-approve">Approve dulu</span></td>
                  <td>Peringkat #1 (skor SAW tertinggi)</td>
                  <td>Pengajuan paling layak diproses pertama menurut SPK.</td>
                  <td>Buka Persetujuan → cek dokumen & kuota → approve jika valid.</td>
                </tr>
                <tr>
                  <td><span className="badge-rec badge-rec-priority">Review prioritas</span></td>
                  <td>Top ~15% peringkat ATAU skor SAW ≥ 0.80</td>
                  <td>Prioritas tinggi, proses setelah prioritas 1.</td>
                  <td>Review cepat, jika durasi cuti besar, pastikan ada pengganti kerja.</td>
                </tr>
                <tr>
                  <td><span className="badge-rec badge-rec-normal">Review normal</span></td>
                  <td>Top ~40% peringkat ATAU skor SAW ≥ 0.50</td>
                  <td>Prioritas menengah; tidak urgent tetapi tetap perlu diputuskan.</td>
                  <td>Proses setelah antrian prioritas tinggi; cek bentrok jadwal tim.</td>
                </tr>
                <tr>
                  <td><span className="badge-rec badge-rec-hold">Tahan dulu</span></td>
                  <td>Peringkat di bawah ambang di atas</td>
                  <td>Prioritas rendah menurut SPK (bukan otomatis ditolak).</td>
                  <td>Tunda keputusan; verifikasi kebijakan, kuota, dan beban operasional.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="card">
          {loading ? <div className="loading"><div className="spinner"></div></div> : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Peringkat</th><th>Karyawan</th><th>Jenis Cuti</th><th>Tanggal</th>
                      <th className="numeric">Masa Kerja</th><th className="numeric">Skor SAW</th><th>Rekomendasi</th><th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(item => (
                      <tr key={item.alternative}>
                        <td>
                          <span className="rank-number">
                            {item.rank === 1 && <span className="rank-medal"><IconTrophy size={16} style={{ color: '#d97706' }} /></span>}
                            #{item.rank}
                          </span>
                        </td>
                        <td>{item.name}</td>
                        <td><span className={getCutiBadgeClass(item.jenis_cuti)}>{item.jenis_cuti}</span></td>
                        <td style={{ fontSize: 12.5 }}>{formatDateRange(item.tanggal_mulai, item.tanggal_selesai)}</td>
                        <td className="numeric">{item.masa_kerja} hari</td>
                        <td className="numeric bold">{item.score?.toFixed(4)}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                            <span className={getRecBadgeClass(item.recommendation)}>{item.recommendation}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3 }}>{item.recommendationDetail}</span>
                          </div>
                        </td>
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
      </div>
    </>
  );
}
