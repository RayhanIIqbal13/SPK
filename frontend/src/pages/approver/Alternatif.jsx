import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api';
import { getCutiBadgeClass, formatDateRange, formatDate } from '../../utils/helpers';

export default function Alternatif() {
  const { onMenuToggle } = useOutletContext();
  const [data, setData] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getAlternatives({ page, limit: 10 })
      .then(res => {
        setData(res.data);
        setCriteria(res.criteria || []);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <Header title="Alternatif" subtitle="Pengajuan pending" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <h1 className="page-title">Alternatif</h1>
        <p className="page-title-sub">Data sumber karyawan untuk setiap pengajuan pending, lalu nilai kriteria C1–C5 yang dipakai perhitungan SAW.</p>

        {/* Data Sumber Alternatif */}
        <div className="card">
          <h3 className="card-title">Data Sumber Alternatif</h3>
          <p className="card-description">
            Nilai mentah dari database per karyawan (agregat riwayat + profil cuti). Satu baris = satu pengajuan <strong>Pending</strong>.
          </p>
          {loading ? <div className="loading"><div className="spinner"></div></div> : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Employee Email</th>
                      <th className="numeric">Sum(Leave<br /><span className="th-sub">Period)</span></th>
                      <th className="numeric">Total<br /><span className="th-sub">Pengajuan</span></th>
                      <th className="numeric">Approved</th>
                      <th className="numeric">Pending<br /><span className="th-sub">(Raw)</span></th>
                      <th className="numeric">(Approved<br /><span className="th-sub">/Total)%</span></th>
                      <th className="numeric">Cuti<br /><span className="th-sub">Dasar</span></th>
                      <th className="numeric">Sisa<br /><span className="th-sub">Lalu</span></th>
                      <th className="numeric">Total<br /><span className="th-sub">Diambil</span></th>
                      <th className="numeric">Sisa Akhir<br /><span className="th-sub">Cuti</span></th>
                      <th>Hire Date</th>
                      <th className="numeric">Masa Kerja<br /><span className="th-sub">(Hari)</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={item.leave_id}>
                        <td>{(page - 1) * 10 + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{item.employee_id}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{item.name}</td>
                        <td style={{ color: 'var(--accent-blue)', fontSize: 12 }}>{item.email}</td>
                        <td className="numeric">{item.sum_leave}</td>
                        <td className="numeric">{item.total_pengajuan}</td>
                        <td className="numeric">{item.approved}</td>
                        <td className="numeric">{item.pending_count}</td>
                        <td className="numeric">{item.approval_rate}%</td>
                        <td className="numeric">{item.total_cuti_tahunan || 12}</td>
                        <td className="numeric">{item.sisa_cuti_tahun_lalu || 0}</td>
                        <td className="numeric">{(item.total_cuti_tahunan || 12) + (item.sisa_cuti_tahun_lalu || 0) - item.sisa_cuti}</td>
                        <td className="numeric bold">{item.sisa_cuti}</td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12.5 }}>{formatDate(item.tanggal_masuk)}</td>
                        <td className="numeric bold">{item.masa_kerja}</td>
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

        {/* Nilai Kriteria per Alternatif */}
        <div className="card">
          <h3 className="card-title">Nilai Kriteria per Alternatif (C1–C5)</h3>
          <p className="card-description">
            Nilai yang masuk ke matriks keputusan (X). C1 = hari cuti pengajuan pending ini.
          </p>
          {!loading && (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Alt.</th>
                      <th>Karyawan</th>
                      <th>Jenis Cuti</th>
                      <th>Tanggal Pengajuan</th>
                      {criteria.map(c => (
                        <th key={c.kode}>{c.kode}<br /><span className="th-sub">{c.nama}</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={`crit-${item.leave_id}`}>
                        <td style={{ fontWeight: 700 }}>{item.alt_label}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>{item.name}</td>
                        <td><span className={getCutiBadgeClass(item.jenis_cuti)}>{item.jenis_cuti}</span></td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12.5 }}>{formatDateRange(item.tanggal_mulai, item.tanggal_selesai)}</td>
                        <td className="numeric">{item.c1}</td>
                        <td className="numeric">{item.c2}</td>
                        <td className="numeric">{item.c3}</td>
                        <td className="numeric">{item.c4}</td>
                        <td className="numeric">{item.c5}</td>
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

        {/* Pemetaan sumber → kriteria */}
        <div className="card">
          <h3 className="card-title">Pemetaan sumber → kriteria</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Kode</th><th>Kriteria</th><th>Kolom sumber</th></tr></thead>
              <tbody>
                {criteria.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.kode}</td>
                    <td>{c.nama}</td>
                    <td>{c.sumber_data || c.nama}</td>
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
