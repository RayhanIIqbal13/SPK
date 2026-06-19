import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Header from '../../components/Header';
import api from '../../api';
import { getStatusBadgeClass, getCutiBadgeClass, formatDate } from '../../utils/helpers';

export default function HistoriApproval() {
  const { onMenuToggle } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Approved', 'Rejected'];

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (activeTab !== 'Semua') params.status = activeTab;
    api.getLeaveHistory(params)
      .then(res => {
        setData(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, activeTab]);

  return (
    <>
      <Header title="Histori Approval" subtitle="Semua keputusan" onMenuToggle={onMenuToggle} />
      <div className="page-content">
        <h1 className="page-title">Histori Approval</h1>
        <div className="tabs">
          {tabs.map(t => (
            <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => { setActiveTab(t); setPage(1); }}>{t}</button>
          ))}
        </div>
        <div className="card">
          {loading ? <div className="loading"><div className="spinner"></div></div> : (
            <>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Karyawan</th>
                      <th>Jenis Cuti</th>
                      <th>Tanggal</th>
                      <th>Hari</th>
                      <th>Status</th>
                      <th>Diproses Oleh</th>
                      <th>Tanggal Proses</th>
                      <th>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, i) => (
                      <tr key={item.id}>
                        <td>{(page - 1) * 10 + i + 1}</td>
                        <td>{item.employee_name}</td>
                        <td><span className={getCutiBadgeClass(item.jenis_cuti)}>{item.jenis_cuti}</span></td>
                        <td>{formatDate(item.tanggal_mulai)} s/d {formatDate(item.tanggal_selesai)}</td>
                        <td className="numeric">{item.total_hari}</td>
                        <td><span className={getStatusBadgeClass(item.status)}>{item.status}</span></td>
                        <td>{item.processor_name || '-'}</td>
                        <td>{formatDate(item.processed_at)}</td>
                        <td>{item.catatan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <span className="pagination-info">Menampilkan {data.length} dari {total} baris</span>
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
