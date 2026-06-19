import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Employee pages
import StatusCuti from './pages/employee/StatusCuti';
import PengajuanBaru from './pages/employee/PengajuanBaru';
import Histori from './pages/employee/Histori';

// Approver pages
import Beranda from './pages/approver/Beranda';
import PersetujuanCuti from './pages/approver/PersetujuanCuti';
import HistoriApproval from './pages/approver/HistoriApproval';
import DataKaryawan from './pages/approver/DataKaryawan';
import DataApprover from './pages/approver/DataApprover';
import KriteriaBobot from './pages/approver/KriteriaBobot';
import Alternatif from './pages/approver/Alternatif';
import TableMatrix from './pages/approver/TableMatrix';
import TableRanking from './pages/approver/TableRanking';

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'approver' ? '/approver/beranda' : '/employee/status'} replace />
        ) : (
          <Login />
        )
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Employee routes */}
      <Route element={<ProtectedRoute role="karyawan"><Layout /></ProtectedRoute>}>
        <Route path="/employee/status" element={<StatusCuti />} />
        <Route path="/employee/pengajuan" element={<PengajuanBaru />} />
        <Route path="/employee/histori" element={<Histori />} />
      </Route>

      {/* Approver routes */}
      <Route element={<ProtectedRoute role="approver"><Layout /></ProtectedRoute>}>
        <Route path="/approver/beranda" element={<Beranda />} />
        <Route path="/approver/persetujuan" element={<PersetujuanCuti />} />
        <Route path="/approver/histori" element={<HistoriApproval />} />
        <Route path="/approver/karyawan" element={<DataKaryawan />} />
        <Route path="/approver/approvers" element={<DataApprover />} />
        <Route path="/approver/kriteria" element={<KriteriaBobot />} />
        <Route path="/approver/alternatif" element={<Alternatif />} />
        <Route path="/approver/matrix" element={<TableMatrix />} />
        <Route path="/approver/ranking" element={<TableRanking />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
