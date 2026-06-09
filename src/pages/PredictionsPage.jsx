import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { worldCupGroups } from '../data/worldcup2026';
import GroupSelector from '../components/GroupSelector';
import { checkIfUserLocked, submitPredictions } from '../services/googleSheets';
import './PredictionsPage.css';

const PredictionsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkLockStatus();
  }, []);

  const checkLockStatus = async () => {
    try {
      const { locked } = await checkIfUserLocked(user.email, user.accessToken);
      
      if (locked) {
        // User has already submitted, redirect to results
        navigate('/results');
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking lock status:', error);
      setError('Error al verificar el estado. Por favor, recarga la página.');
      setLoading(false);
    }
  };

  const handlePredictionChange = (groupId, groupPredictions) => {
    setPredictions(prev => ({
      ...prev,
      [groupId]: groupPredictions,
    }));
  };

  const isFormComplete = () => {
    return worldCupGroups.every(group => {
      const groupPred = predictions[group.id];
      return groupPred?.first && groupPred?.second && groupPred?.third;
    });
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert('Por favor, completa todas las predicciones antes de enviar.');
      return;
    }

    if (!confirm('¿Estás seguro? Una vez enviadas, no podrás editar tus predicciones.')) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitPredictions(user, predictions, user.accessToken);
      alert('¡Predicciones enviadas exitosamente!');
      navigate('/results');
    } catch (error) {
      console.error('Error submitting predictions:', error);
      setError('Error al enviar predicciones. Por favor, intenta de nuevo.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando estado...</p>
      </div>
    );
  }

  return (
    <div className="predictions-page">
      <header className="predictions-header">
        <div className="header-content">
          <h1>⚽ Predicciones Copa Mundial 2026</h1>
          <div className="user-info">
            <img src={user.picture} alt={user.name} className="user-avatar" />
            <span>Bienvenido, {user.name}</span>
            <button onClick={logout} className="logout-button">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <main className="predictions-content">
        <div className="instructions">
          <h2>Selecciona los 3 mejores equipos de cada grupo</h2>
          <p>⚠️ Una vez enviadas tus predicciones, no podrás editarlas.</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="groups-grid">
          {worldCupGroups.map(group => (
            <GroupSelector
              key={group.id}
              group={group}
              predictions={predictions[group.id]}
              onPredictionChange={handlePredictionChange}
            />
          ))}
        </div>

        <div className="submit-section">
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete() || submitting}
            className="submit-button"
          >
            {submitting ? 'Enviando...' : 'Enviar Predicciones'}
          </button>
          {!isFormComplete() && (
            <p className="submit-hint">
              Completa todos los grupos para enviar tus predicciones
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PredictionsPage;
