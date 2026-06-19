import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { IconLogo, IconMoon, IconSun, IconCheckCircle, IconEye, IconEyeOff } from '../components/Icons';
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('L');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('karyawan');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await api.register({ name, email, gender, department, password, role });
      
      login(data.user);
      navigate(data.user.role === 'approver' ? '/approver/beranda' : '/employee/status');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-icon">
            <IconLogo size={48} />
          </div>
          <h1 className="login-brand-title">Leave Management</h1>
          <p className="login-brand-sub">Sistem Manajemen Cuti Karyawan</p>
          <div className="login-features">
            <div className="login-feature"><span className="login-feature-icon"><IconCheckCircle size={16} /></span>Ajukan cuti dengan mudah</div>
            <div className="login-feature"><span className="login-feature-icon"><IconCheckCircle size={16} /></span>Tracking status real-time</div>
            <div className="login-feature"><span className="login-feature-icon"><IconCheckCircle size={16} /></span>Approval workflow terintegrasi</div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <button className="header-btn" onClick={toggleTheme} title="Toggle dark mode">
            {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
          </button>
        </div>
        <div className="login-form">
          <h2 className="login-welcome">Buat Akun Baru</h2>
          <p className="login-welcome-sub">Silakan isi data diri Anda untuk mendaftar</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            {error && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '14px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                {error}
              </div>
            )}
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Nama Lengkap</label>
              <input type="text" className="form-input" placeholder="Misal: Budi Santoso" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="email@kpc.co.id" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Jenis Kelamin</label>
                <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Departemen</label>
                <input type="text" className="form-input" placeholder="Misal: IT, HR" value={department} onChange={e => setDepartment(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Konfirmasi Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? "text" : "password"} className="form-input" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}>
                  {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sebagai</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="karyawan">Karyawan</option>
                <option value="approver">Approver / Manager</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Sudah punya akun? <span onClick={() => navigate('/login')} style={{ color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}>Masuk di sini</span>
          </div>

          <div className="login-footer">
            Dengan mendaftar, Anda menyetujui <a href="#">Ketentuan Layanan</a> dan <a href="#">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </div>
  );
}
