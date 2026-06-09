import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="nav-tabs">
      <Link 
        to="/results" 
        className={`nav-tab ${location.pathname === '/results' ? 'active' : ''}`}
      >
        📋 Mis Predicciones
      </Link>
      <Link 
        to="/leaderboard" 
        className={`nav-tab ${location.pathname === '/leaderboard' ? 'active' : ''}`}
      >
        🏆 Tabla de Posiciones
      </Link>
    </nav>
  );
};

export default Navigation;
