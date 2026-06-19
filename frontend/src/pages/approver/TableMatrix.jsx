import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api';

export default function TableMatrix() {
  const { onMenuToggle } = useOutletContext();
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getMatrix({ page, limit: 10 })
      .then(res => {
        setMatrixData(res);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return (
      <>
        <Header title="Table Matrix" subtitle="Matriks keputusan" onMenuToggle={onMenuToggle} />
        <div className="loading"><div className="spinner"></div></div>
      </>
    );
  }

  const criteria = matrixData?.criteria || [];
  const weights = matrixData?.weights || [];
  const maxValues = matrixData?.maxValues || [];
  const minValues = matrixData?.minValues || [];

  const Pagination = () => (
    <div className="pagination">
      <span className="pagination-info">Menampilkan {(page-1)*10+1}–{Math.min(page*10, total)} dari {total} baris</span>
      <div className="pagination-controls">
        <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Sebelumnya</button>
        <span className="pagination-page">Halaman {page} / {totalPages}</span>
        <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Berikutnya ›</button>
      </div>
    </div>
  );

  return (
    <>
      <Header title="Table Matrix" subtitle="Matriks keputusan" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <h1 className="page-title">Table Matrix — SAW</h1>
        <p className="page-title-sub">Matriks keputusan, normalisasi (R), dan nilai preferensi (V) sesuai metode SAW.</p>

        {/* Bobot Kriteria (W) — show first for context */}
        <div className="card">
          <h3 className="card-title">Bobot Kriteria (W)</h3>
          <p className="card-description">Bobot masing-masing kriteria yang digunakan dalam perhitungan SAW.</p>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Kriteria</th>
                  <th className="numeric">Bobot (%)</th>
                  <th className="numeric">W (desimal)</th>
                  <th>Tipe</th>
                  <th className="numeric">Max(X)</th>
                  <th className="numeric">Min(X)</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c, i) => (
                  <tr key={c.kode}>
                    <td style={{ fontWeight: 700 }}>{c.kode}</td>
                    <td>{c.nama}</td>
                    <td className="numeric bold">{c.bobot}%</td>
                    <td className="numeric">{weights[i]?.toFixed(4)}</td>
                    <td>
                      <span className={c.tipe === 'cost' ? 'badge-cost' : 'badge-benefit'}>
                        {c.tipe === 'cost' ? 'Cost' : 'Benefit'}
                      </span>
                    </td>
                    <td className="numeric">{maxValues[i]?.toFixed(2)}</td>
                    <td className="numeric">{minValues[i]?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matriks Keputusan (X) */}
        <div className="card">
          <h3 className="card-title">Matriks Keputusan (X — Nilai Awal)</h3>
          <p className="card-description">Nilai mentah per kriteria sebelum normalisasi.</p>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Alternatif</th>
                  <th>Karyawan</th>
                  {criteria.map(c => (
                    <th key={c.kode} className="numeric">
                      {c.kode}
                      <span className="th-sub">{c.nama}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData?.matrix?.map(row => (
                  <tr key={row.alternative}>
                    <td>{row.no}</td>
                    <td style={{ fontWeight: 700 }}>{row.alternative}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{row.name}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="numeric">{typeof v === 'number' ? v.toFixed(2) : v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>

        {/* Normalisasi (R) */}
        <div className="card">
          <h3 className="card-title">Matriks Normalisasi (R)</h3>
          <div className="info-box">
            <strong>Benefit:</strong> R<sub>ij</sub> = X<sub>ij</sub> ÷ Max(X<sub>j</sub>) &nbsp; | &nbsp;
            <strong>Cost:</strong> R<sub>ij</sub> = Min(X<sub>j</sub>) ÷ X<sub>ij</sub>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Alternatif</th>
                  <th>Karyawan</th>
                  {criteria.map(c => (
                    <th key={c.kode} className="numeric">
                      R-{c.kode}
                      <span className="th-sub">{c.tipe}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData?.normalized?.map(row => (
                  <tr key={row.alternative}>
                    <td>{row.no}</td>
                    <td style={{ fontWeight: 700 }}>{row.alternative}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{row.name}</td>
                    {row.normalizedValues.map((v, i) => (
                      <td key={i} className="numeric">{v.toFixed(4)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>

        {/* Nilai Preferensi (V) */}
        <div className="card">
          <h3 className="card-title">Matriks Nilai Preferensi (V)</h3>
          <div className="info-box">
            <strong>Preferensi:</strong> V<sub>i</sub> = Σ (W<sub>j</sub> × R<sub>ij</sub>) — skor tertinggi = prioritas terbaik
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Alternatif</th>
                  <th>Karyawan</th>
                  {criteria.map((c, i) => (
                    <th key={c.kode} className="numeric">
                      V-{c.kode}
                      <span className="th-sub">W={weights[i]?.toFixed(2)}</span>
                    </th>
                  ))}
                  <th className="numeric" style={{ background: 'var(--status-approved-bg)' }}>
                    SKOR (V<sub>i</sub>)
                  </th>
                </tr>
              </thead>
              <tbody>
                {matrixData?.preference?.map(row => (
                  <tr key={row.alternative}>
                    <td>{row.no}</td>
                    <td style={{ fontWeight: 700 }}>{row.alternative}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{row.name}</td>
                    {row.vValues.map((v, i) => (
                      <td key={i} className="numeric">{v.toFixed(4)}</td>
                    ))}
                    <td className="numeric bold" style={{ background: 'var(--status-approved-bg)', color: 'var(--status-approved)' }}>
                      {row.score.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>
    </>
  );
}
