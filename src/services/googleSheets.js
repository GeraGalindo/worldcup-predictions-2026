const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_NAME = 'Predicciones';
const RESULTS_SHEET_NAME = 'resultados';

// Helper to format predictions data for Google Sheets
const formatPredictionsForSheet = (user, predictions) => {
  const timestamp = new Date().toISOString();
  const row = [timestamp, user.email, user.name];
  
  // Add predictions for each group (3 teams per group)
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach(groupId => {
    const groupPredictions = predictions[groupId] || { first: '', second: '', third: '' };
    row.push(groupPredictions.first, groupPredictions.second, groupPredictions.third);
  });
  
  // Add points (default 0) and locked status (TRUE)
  row.push(0, 'TRUE');
  
  return row;
};

// Check if user has already submitted predictions (locked)
export const checkIfUserLocked = async (userEmail, accessToken) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:B`;
    
    console.log('Fetching sheet data from:', url);
    console.log('Using access token:', accessToken ? 'Present' : 'Missing');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Sheets API error response:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch sheet data');
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Find row with user's email (column B, index 1)
    const userRow = rows.find(row => row[1] === userEmail);
    
    if (!userRow) {
      return { locked: false, row: null };
    }
    
    // Check if locked column (last column) is TRUE
    // We need to fetch the full row to check the locked status
    const fullRowUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${rows.indexOf(userRow) + 1}:AZ${rows.indexOf(userRow) + 1}`;
    
    const fullRowResponse = await fetch(fullRowUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    const fullRowData = await fullRowResponse.json();
    const fullRow = fullRowData.values?.[0] || [];
    
    // Last column should be locked status
    const locked = fullRow[fullRow.length - 1] === 'TRUE';
    
    return { locked, row: fullRow };
    
  } catch (error) {
    console.error('Error checking user lock status:', error);
    return { locked: false, row: null };
  }
};

// Submit predictions to Google Sheets
export const submitPredictions = async (user, predictions, accessToken) => {
  try {
    const row = formatPredictionsForSheet(user, predictions);
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:AZ:append?valueInputOption=USER_ENTERED`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [row],
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to submit predictions');
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error submitting predictions:', error);
    throw error;
  }
};

// Fetch user's predictions from Google Sheets
export const fetchUserPredictions = async (userEmail, accessToken) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:AZ`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Find user's row
    const userRowIndex = rows.findIndex(row => row[1] === userEmail);
    
    if (userRowIndex === -1 || userRowIndex === 0) {
      // User not found or it's the header row
      return null;
    }
    
    const userRow = rows[userRowIndex];
    
    // Parse predictions from row
    const predictions = {};
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    
    groups.forEach((groupId, index) => {
      const baseIndex = 3 + (index * 3); // Start at column D (index 3)
      predictions[groupId] = {
        first: userRow[baseIndex] || '',
        second: userRow[baseIndex + 1] || '',
        third: userRow[baseIndex + 2] || '',
      };
    });
    
    return {
      timestamp: userRow[0],
      email: userRow[1],
      name: userRow[2],
      predictions,
      points: parseInt(userRow[39]) || 0, // Column AN (39)
      locked: userRow[40] === 'TRUE', // Column AO (40)
    };
    
  } catch (error) {
    console.error('Error fetching user predictions:', error);
    throw error;
  }
};

// Fetch all participants for leaderboard
export const fetchAllParticipants = async (accessToken) => {
  try {
    // Fetch the full data to get all predictions
    const fullUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:AO`;
    
    const fullResponse = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!fullResponse.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    
    const fullData = await fullResponse.json();
    const fullRows = fullData.values || [];
    
    // Fetch actual results
    const actualResults = await fetchActualResults(accessToken);
    
    const participants = [];
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    
    // Skip header row (index 0)
    for (let i = 1; i < fullRows.length; i++) {
      const row = fullRows[i];
      if (row[1] && row[2]) { // Must have email and name
        // Parse predictions from row
        const predictions = {};
        groups.forEach((groupId, index) => {
          const baseIndex = 3 + (index * 3); // Start at column D (index 3)
          predictions[groupId] = {
            first: row[baseIndex] || '',
            second: row[baseIndex + 1] || '',
            third: row[baseIndex + 2] || '',
          };
        });
        
        // Calculate points if results are available
        let calculatedPoints = 0;
        if (actualResults) {
          const pointsData = calculateTotalPoints(predictions, actualResults);
          calculatedPoints = pointsData.total;
        }
        
        participants.push({
          email: row[1],
          name: row[2],
          points: calculatedPoints,
          locked: row[40] === 'TRUE', // Column AO (index 40)
        });
      }
    }
    
    // Sort by points descending
    participants.sort((a, b) => b.points - a.points);
    
    return participants;
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Fetch actual results from the "resultados" tab
export const fetchActualResults = async (accessToken) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RESULTS_SHEET_NAME}!A:D`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      // If sheet doesn't exist yet, return null
      if (errorData.error?.code === 400) {
        return null;
      }
      throw new Error('Failed to fetch results');
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Skip header row and parse results
    const results = {};
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0]) { // Group ID exists
        results[row[0]] = {
          first: row[1] || '',
          second: row[2] || '',
          third: row[3] || '',
        };
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Error fetching results:', error);
    return null;
  }
};

// Calculate points for a single group
// 2 points for correct team in correct position
// 1 point for correct team in wrong position
export const calculateGroupPoints = (prediction, result) => {
  if (!result || !prediction) {
    return { total: 0, breakdown: { first: 0, second: 0, third: 0 } };
  }
  
  const breakdown = { first: 0, second: 0, third: 0 };
  
  const positions = ['first', 'second', 'third'];
  const resultTeams = [result.first, result.second, result.third];
  
  positions.forEach((position, index) => {
    const predictedTeam = prediction[position];
    
    if (!predictedTeam) {
      breakdown[position] = 0;
      return;
    }
    
    // Check if team is in correct position (2 points)
    if (predictedTeam === result[position]) {
      breakdown[position] = 2;
    }
    // Check if team is in results but wrong position (1 point)
    else if (resultTeams.includes(predictedTeam)) {
      breakdown[position] = 1;
    }
    // Team not in results (0 points)
    else {
      breakdown[position] = 0;
    }
  });
  
  const total = breakdown.first + breakdown.second + breakdown.third;
  
  return { total, breakdown };
};

// Calculate total points for all predictions
export const calculateTotalPoints = (predictions, results) => {
  if (!results) {
    return { total: 0, byGroup: {} };
  }
  
  let total = 0;
  const byGroup = {};
  
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  
  groups.forEach(groupId => {
    const groupResult = results[groupId];
    const groupPrediction = predictions[groupId];
    
    if (groupResult && groupPrediction) {
      const groupPoints = calculateGroupPoints(groupPrediction, groupResult);
      byGroup[groupId] = groupPoints;
      total += groupPoints.total;
    } else {
      byGroup[groupId] = { total: 0, breakdown: { first: 0, second: 0, third: 0 } };
    }
  });
  
  return { total, byGroup };
};

