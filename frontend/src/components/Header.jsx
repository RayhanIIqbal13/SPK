import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { IconMoon, IconSun, IconLogOut, IconMenu } from './Icons';

export default function Header({ title, subtitle, onMenuToggle }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="menu-toggle" onClick={onMenuToggle}>
          <IconMenu size={24} />
        </button>
        <div className="header-left">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="header-actions">
        <button className="header-btn" onClick={toggleTheme} title="Toggle dark mode">
          {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
        </button>
        <button className="header-logout" onClick={handleLogout}>
          <IconLogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
