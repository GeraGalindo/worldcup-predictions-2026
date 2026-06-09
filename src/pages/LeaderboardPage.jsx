import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllParticipants } from '../services/googleSheets';
import Navigation from '../components/Navigation';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllParticipants(user.accessToken);
      setParticipants(data);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('No se pudo cargar la tabla de posiciones');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMedalEmoji = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}°`;
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="header-content">
            <h1>⚽ Copa Mundial FIFA 2026</h1>
            <div className="user-info">
              <span>Hola, {user.name}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <Navigation />

        <div className="leaderboard-content">
          <div className="leaderboard-title">
            <h2>🏆 Tabla de Posiciones</h2>
            <p>Clasificación de todos los participantes</p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando tabla de posiciones...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadLeaderboard} className="retry-btn">
                Intentar de nuevo
              </button>
            </div>
          ) : participants.length === 0 ? (
            <div className="empty-message">
              <p>Aún no hay participantes con predicciones enviadas.</p>
            </div>
          ) : (
            <div className="leaderboard-table">
              <table>
                <thead>
                  <tr>
                    <th className="position-col">Pos.</th>
                    <th className="name-col">Participante</th>
                    <th className="points-col">Puntos</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => (
                    <tr 
                      key={participant.email}
                      className={participant.email === user.email ? 'current-user' : ''}
                    >
                      <td className="position-col">
                        <span className="position-badge">
                          {getMedalEmoji(index + 1)}
                        </span>
                      </td>
                      <td className="name-col">
                        <div className="participant-info">
                          <span className="participant-name">
                            {participant.name}
                            {participant.email === user.email && (
                              <span className="you-badge">Tú</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="points-col">
                        <span className="points-value">{participant.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
