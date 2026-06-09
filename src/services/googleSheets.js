const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_NAME = 'Predicciones';

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
    // Fetch columns: Name (C), Email (B), and Points (AN)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!B:C`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Skip header row and fetch full rows to get points
    const participants = [];
    
    // Fetch the full data to get points column
    const fullUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:AO`;
    
    const fullResponse = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!fullResponse.ok) {
      throw new Error('Failed to fetch complete leaderboard data');
    }
    
    const fullData = await fullResponse.json();
    const fullRows = fullData.values || [];
    
    // Skip header row (index 0)
    for (let i = 1; i < fullRows.length; i++) {
      const row = fullRows[i];
      if (row[1] && row[2]) { // Must have email and name
        participants.push({
          email: row[1],
          name: row[2],
          points: parseInt(row[39]) || 0, // Column AN (index 39)
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

