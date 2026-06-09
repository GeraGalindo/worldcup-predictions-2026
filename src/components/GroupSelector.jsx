import { useState, useEffect } from 'react';
import './GroupSelector.css';

const GroupSelector = ({ group, predictions, onPredictionChange }) => {
  const [selected, setSelected] = useState({
    first: predictions?.first || '',
    second: predictions?.second || '',
    third: predictions?.third || '',
  });

  useEffect(() => {
    // Update parent component when selections change
    onPredictionChange(group.id, selected);
  }, [selected]);

  const handleChange = (position, value) => {
    setSelected(prev => ({
      ...prev,
      [position]: value,
    }));
  };

  // Get available teams for each dropdown (excluding already selected teams)
  const getAvailableTeams = (currentPosition) => {
    const selectedTeams = Object.entries(selected)
      .filter(([position]) => position !== currentPosition)
      .map(([, team]) => team);
    
    return group.teams.filter(team => !selectedTeams.includes(team));
  };

  const isComplete = selected.first && selected.second && selected.third;

  return (
    <div className={`group-selector ${isComplete ? 'complete' : 'incomplete'}`}>
      <h3>{group.name}</h3>
      <div className="group-teams">
        <span className="teams-list">{group.teams.join(', ')}</span>
      </div>
      
      <div className="predictions">
        <div className="prediction-row">
          <label>1° Lugar:</label>
          <select 
            value={selected.first} 
            onChange={(e) => handleChange('first', e.target.value)}
            className="prediction-select"
          >
            <option value="">Seleccionar equipo</option>
            {getAvailableTeams('first').map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
            {selected.first && !getAvailableTeams('first').includes(selected.first) && (
              <option value={selected.first}>{selected.first}</option>
            )}
          </select>
        </div>
        
        <div className="prediction-row">
          <label>2° Lugar:</label>
          <select 
            value={selected.second} 
            onChange={(e) => handleChange('second', e.target.value)}
            className="prediction-select"
          >
            <option value="">Seleccionar equipo</option>
            {getAvailableTeams('second').map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
            {selected.second && !getAvailableTeams('second').includes(selected.second) && (
              <option value={selected.second}>{selected.second}</option>
            )}
          </select>
        </div>
        
        <div className="prediction-row">
          <label>3° Lugar:</label>
          <select 
            value={selected.third} 
            onChange={(e) => handleChange('third', e.target.value)}
            className="prediction-select"
          >
            <option value="">Seleccionar equipo</option>
            {getAvailableTeams('third').map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
            {selected.third && !getAvailableTeams('third').includes(selected.third) && (
              <option value={selected.third}>{selected.third}</option>
            )}
          </select>
        </div>
      </div>
      
      {!isComplete && <div className="incomplete-indicator">⚠ Completa las 3 posiciones</div>}
    </div>
  );
};

export default GroupSelector;
