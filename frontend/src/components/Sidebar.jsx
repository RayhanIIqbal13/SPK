import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconLogo, IconHome, IconCheckCircle, IconClock, IconUser, IconUsers,
  IconSliders, IconLayers, IconGrid, IconAward, IconCalendar, IconPlus, IconHistory, IconX
} from './Icons';

const employeeMenu = [
  {
    section: 'MENU UTAMA',
    items: [
      { path: '/employee/status', icon: IconCalendar, label: 'Status Cuti', sub: 'Lihat sisa cuti' },
      { path: '/employee/pengajuan', icon: IconPlus, label: 'Pengajuan Baru', sub: 'Buat pengajuan' },
      { path: '/employee/histori', icon: IconHistory, label: 'Histori', sub: 'Riwayat cuti' },
    ]
  }
];

const approverMenu = [
  {
    section: 'MENU UTAMA',
    items: [
      { path: '/approver/beranda', icon: IconHome, label: 'Beranda', sub: 'Ringkasan approver' },
      { path: '/approver/persetujuan', icon: IconCheckCircle, label: 'Persetujuan Cuti', sub: 'Approve / reject pending' },
      { path: '/approver/histori', icon: IconClock, label: 'Histori Approval', sub: 'Semua keputusan' },
    ]
  },
  {
    section: 'PENGATURAN',
    items: [
      { path: '/approver/karyawan', icon: IconUser, label: 'Data Karyawan', sub: 'Akun & master cuti karyawan' },
      { path: '/approver/approvers', icon: IconUsers, label: 'Data Approver', sub: 'Akun approver / manager' },
    ]
  },
  {
    section: 'SPK',
    items: [
      { path: '/approver/kriteria', icon: IconSliders, label: 'Kriteria & Bobot', sub: 'Konfigurasi SAW' },
      { path: '/approver/alternatif', icon: IconLayers, label: 'Alternatif', sub: 'Pengajuan pending' },
      { path: '/approver/matrix', icon: IconGrid, label: 'Table Matrix', sub: 'Matriks keputusan' },
      { path: '/approver/ranking', icon: IconAward, label: 'Table Ranking', sub: 'Peringkat prioritas' },
    ]
  }
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();
  const menu = user?.role === 'approver' ? approverMenu : employeeMenu;

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${user?.role === 'approver' ? 'sidebar-approver' : 'sidebar-karyawan'} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <IconLogo size={28} />
          </div>
          <div>
            <div className="sidebar-title">
              Portal Cuti
              <span style={{ display: 'block' }}>
                {user?.role === 'approver' ? 'Approver' : 'Karyawan'}
              </span>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <IconX size={20} />
          </button>
        </div>

        {menu.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section">{group.section}</div>
            <nav className="sidebar-nav">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="icon">
                      <Icon size={20} />
                    </span>
                    <div>
                      {item.label}
                      <span className="sidebar-link-info">{item.sub}</span>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
