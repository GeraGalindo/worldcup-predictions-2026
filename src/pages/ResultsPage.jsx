import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { worldCupGroups } from '../data/worldcup2026';
import { 
  fetchUserPredictions, 
  fetchActualResults, 
  calculateTotalPoints 
} from '../services/googleSheets';
import Navigation from '../components/Navigation';
import './ResultsPage.css';

const ResultsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [actualResults, setActualResults] = useState(null);
  const [calculatedPoints, setCalculatedPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await fetchUserPredictions(user.email, user.accessToken);
      
      if (!data) {
        setError('No se encontraron predicciones. Por favor, ve a la página de predicciones.');
        setLoading(false);
        return;
      }
      
      setResults(data);
      
      // Fetch actual results
      const actual = await fetchActualResults(user.accessToken);
      setActualResults(actual);
      
      // Calculate points if actual results exist
      if (actual) {
        const points = calculateTotalPoints(data.predictions, actual);
        setCalculatedPoints(points);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Error al cargar los resultados. Por favor, recarga la página.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-page">
        <header className="results-header">
          <div className="header-content">
            <h1>⚽ Resultados</h1>
            <div className="user-info">
              <img src={user.picture} alt={user.name} className="user-avatar" />
              <span>{user.name}</span>
              <button onClick={logout} className="logout-button">Cerrar Sesión</button>
            </div>
          </div>
        </header>
        <main className="results-content">
          <div className="error-message">{error}</div>
        </main>
      </div>
    );
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="results-page">
      <header className="results-header">
        <div className="header-content">
          <h1>⚽ Tus Predicciones</h1>
          <div className="user-info">
            <img src={user.picture} alt={user.name} className="user-avatar" />
            <span>{user.name}</span>
            <button onClick={logout} className="logout-button">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <Navigation />

      <main className="results-content">
        <div className="results-summary">
          <div className="summary-card">
            <h3>Puntos Actuales</h3>
            <div className="points-display">
              {calculatedPoints ? calculatedPoints.total : 0}
            </div>
            <p className="points-note">
              {actualResults 
                ? 'Puntos calculados en base a los resultados oficiales' 
                : 'Los puntos se actualizarán después del torneo'}
            </p>
          </div>
          
          <div className="summary-card">
            <h3>Estado</h3>
            <div className="status-display locked">
              🔒 Predicciones Bloqueadas
            </div>
            <p className="status-note">No puedes editar tus predicciones</p>
          </div>
          
          <div className="summary-card">
            <h3>Fecha de Envío</h3>
            <div className="timestamp-display">
              {formatDate(results.timestamp)}
            </div>
          </div>
        </div>

        <div className="predictions-display">
          <h2>Tus Predicciones por Grupo</h2>
          
          <div className="groups-results-grid">
            {worldCupGroups.map(group => {
              const groupPredictions = results.predictions[group.id];
              const groupActualResults = actualResults?.[group.id];
              const groupPoints = calculatedPoints?.byGroup[group.id];
              
              return (
                <div key={group.id} className="group-result-card">
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    {groupPoints && (
                      <div className="group-points-badge">
                        {groupPoints.total} pts
                      </div>
                    )}
                  </div>
                  
                  <div className="group-teams-small">
                    {group.teams.join(', ')}
                  </div>
                  
                  <div className="predictions-comparison">
                    <div className="predictions-column">
                      <h4>Tu Predicción</h4>
                      <div className="predictions-list">
                        <div className="prediction-item">
                          <span className="position-badge gold">1°</span>
                          <span className="team-name">{groupPredictions?.first || 'N/A'}</span>
                          {groupPoints && (
                            <span className={`points-earned points-${groupPoints.breakdown.first}`}>
                              +{groupPoints.breakdown.first}
                            </span>
                          )}
                        </div>
                        <div className="prediction-item">
                          <span className="position-badge silver">2°</span>
                          <span className="team-name">{groupPredictions?.second || 'N/A'}</span>
                          {groupPoints && (
                            <span className={`points-earned points-${groupPoints.breakdown.second}`}>
                              +{groupPoints.breakdown.second}
                            </span>
                          )}
                        </div>
                        <div className="prediction-item">
                          <span className="position-badge bronze">3°</span>
                          <span className="team-name">{groupPredictions?.third || 'N/A'}</span>
                          {groupPoints && (
                            <span className={`points-earned points-${groupPoints.breakdown.third}`}>
                              +{groupPoints.breakdown.third}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {groupActualResults && (
                      <div className="predictions-column">
                        <h4>Resultado Real</h4>
                        <div className="predictions-list">
                          <div className="prediction-item">
                            <span className="position-badge gold">1°</span>
                            <span className="team-name">{groupActualResults.first}</span>
                          </div>
                          <div className="prediction-item">
                            <span className="position-badge silver">2°</span>
                            <span className="team-name">{groupActualResults.second}</span>
                          </div>
                          <div className="prediction-item">
                            <span className="position-badge bronze">3°</span>
                            <span className="team-name">{groupActualResults.third}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
