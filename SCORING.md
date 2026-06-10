# Scoring System Documentation

## Overview
The app calculates points by comparing user predictions with actual results. Points are automatically calculated when results are entered in the Google Sheets "resultados" tab.

## Scoring Rules

### Points per Team
- **2 points**: Correct team in correct position
- **1 point**: Correct team but in wrong position  
- **0 points**: Team not in top 3

### Maximum Points per Group
- Perfect prediction (all 3 teams in correct positions): **6 points**
- Maximum possible total: **72 points** (6 points × 12 groups)

## Examples

### Example 1: Perfect Prediction
```
Result:     Team1, Team2, Team3
Prediction: Team1, Team2, Team3
Points:     2 + 2 + 2 = 6 points
```
All three teams in correct positions.

### Example 2: Two Correct Positions, One Wrong
```
Result:     Team1, Team2, Team3
Prediction: Team1, Team3, Team2
Points:     2 + 1 + 1 = 4 points
```
Team1 correct (2 pts), Team3 qualified but wrong position (1 pt), Team2 qualified but wrong position (1 pt).

### Example 3: All Teams Correct, All Wrong Positions
```
Result:     Team1, Team2, Team3
Prediction: Team2, Team1, Team3
Points:     1 + 1 + 1 = 3 points
```
All three teams qualified but in different places.

### Example 4: Partial Match
```
Result:     Team1, Team2, Team3
Prediction: Team4, Team3, Team2
Points:     0 + 1 + 1 = 2 points
```
Team4 didn't qualify (0 pts), Team3 qualified but wrong position (1 pt), Team2 qualified but wrong position (1 pt).

## Google Sheets Setup

### Create "resultados" Tab

1. In your Google Spreadsheet, create a new tab/sheet named **"resultados"** (all lowercase)

2. Set up the header row (Row 1):
   ```
   | Group | First | Second | Third |
   ```

3. Fill in the results for each group (one row per group):
   ```
   | A | México        | Sudáfrica     | Corea del Sur |
   | B | Canadá        | Suiza         | Bosnia        |
   | C | Brasil        | Marruecos     | Escocia       |
   | D | Estados Unidos| Paraguay      | Australia     |
   | E | Alemania      | Ecuador       | Costa de Marfil|
   | F | Países Bajos  | Japón         | Suecia        |
   | G | Bélgica       | Egipto        | Irán          |
   | H | España        | Uruguay       | Arabia Saudita|
   | I | Francia       | Senegal       | Noruega       |
   | J | Argentina     | Austria       | Argelia       |
   | K | Inglaterra    | Polonia       | México        |
   | L | Portugal      | Italia        | Croacia       |
   ```

### Column Details

- **Column A (Group)**: Group letter (A-L)
- **Column B (First)**: 1st place team name (exactly as it appears in worldcup2026.js)
- **Column C (Second)**: 2nd place team name
- **Column D (Third)**: 3rd place team name

### Important Notes

1. **Team names must match exactly** with the names in the `worldcup2026.js` file
2. All 12 groups (A-L) should have results entered for complete scoring
3. If the "resultados" tab doesn't exist, the app will show 0 points with a message that results aren't available yet
4. Points are calculated in real-time when users view their results page

## How Scoring Works in the App

### Automatic Calculation
1. User navigates to "Resultados" page
2. App fetches user's predictions from "Predicciones" sheet
3. App fetches actual results from "resultados" sheet
4. Points are calculated for each group
5. Total points and breakdown displayed to user

### Display Features
- **Total Points**: Shown at top of results page
- **Per-Group Points**: Badge showing points earned for each group
- **Per-Team Points**: Color-coded indicators next to each prediction:
  - 🟢 Green (+2): Correct team, correct position
  - 🟡 Yellow (+1): Correct team, wrong position
  - 🔴 Red (+0): Wrong team
- **Side-by-side Comparison**: User predictions shown alongside actual results

## Code Implementation

### Key Functions

#### `fetchActualResults(accessToken)`
Fetches results from the "resultados" tab in Google Sheets.

#### `calculateGroupPoints(prediction, result)`
Calculates points for a single group.

```javascript
// Returns:
{
  total: 4,
  breakdown: {
    first: 2,   // 2 points for correct position
    second: 1,  // 1 point for wrong position
    third: 1    // 1 point for wrong position
  }
}
```

#### `calculateTotalPoints(predictions, results)`
Calculates total points across all groups.

```javascript
// Returns:
{
  total: 48,
  byGroup: {
    'A': { total: 6, breakdown: {...} },
    'B': { total: 4, breakdown: {...} },
    // ... for all groups
  }
}
```

## Testing the Scoring System

1. Make predictions through the app
2. Add test results to the "resultados" sheet
3. View your results page to see calculated points
4. Verify the points match expected values using the scoring rules above

## Future Enhancements

Potential improvements to the scoring system:
- Admin interface to enter results
- Real-time point updates as tournament progresses
- Bonus points for perfect group predictions
- Knockout stage predictions and scoring
- Historical results tracking
