# FIFA World Cup 2026 Predictions App

## Overview
Web application for predicting the top 3 teams from each of the 12 groups in the FIFA World Cup 2026. Users authenticate with Google, make predictions, and submit them to a Google Sheet. Predictions are locked after submission.

## Tech Stack
- **Frontend:** React + Vite
- **Authentication:** Google Sign-In (OAuth 2.0)
- **Data Storage:** Google Sheets API
- **Hosting:** Vercel or Netlify

## Quick Start

### Prerequisites
- Node.js (v18+)
- Google Account with Google Cloud Console access

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   VITE_GOOGLE_SHEETS_API_KEY=your-api-key
   VITE_GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Google Cloud Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `worldcup-predictions-2026`

### 2. Enable APIs
- Google Sheets API
- Google Identity

### 3. Configure OAuth Consent Screen
- Type: External
- App name: `Copa Mundial FIFA 2026 Predicciones`
- Add test users (your friends' Google accounts)

### 4. Create OAuth 2.0 Client ID
- Type: Web application
- Authorized JavaScript origins:
  - `http://localhost:5173` (development)
  - `https://yourapp.vercel.app` (production)

### 5. Create API Key
- Restrict to Google Sheets API
- Add HTTP referrers for your domains

## Google Sheets Setup

### 1. Create Spreadsheet
- Name: `Copa Mundial 2026 - Predicciones`
- Sheet name: `Predicciones`

### 2. Add Header Row
Columns A-AO:
```
Timestamp | Email | Name | Grupo A 1° | Grupo A 2° | Grupo A 3° | ... (36 team columns) ... | Points | Locked
```

### 3. Share Settings
- Set to: "Anyone with the link can edit"
- Copy the Spreadsheet ID from the URL

## Deployment (Vercel)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Import repository at [vercel.com](https://vercel.com/)
   - Framework: Vite
   - Add environment variables
   - Deploy

3. **Update Google Cloud:**
   - Add production URL to authorized origins
   - Update API key HTTP referrers

## Features

✅ Google Sign-In authentication  
✅ 12 groups with Spanish team names  
✅ Mutual exclusivity (can't pick same team twice per group)  
✅ Form validation (must complete all groups)  
✅ Lock mechanism (no editing after submission)  
✅ Google Sheets data persistence  
✅ Responsive design  
✅ Results page with locked status  

## World Cup 2026 Groups

- **Grupo A:** México, Sudáfrica, Corea del Sur, Rep. Checa
- **Grupo B:** Canadá, Bosnia, Qatar, Suiza
- **Grupo C:** Brasil, Marruecos, Haití, Escocia
- **Grupo D:** Estados Unidos, Paraguay, Australia, Turquía
- **Grupo E:** Alemania, Curazao, Costa de Marfil, Ecuador
- **Grupo F:** Países Bajos, Japón, Suecia, Túnez
- **Grupo G:** Bélgica, Egipto, Irán, Nueva Zelanda
- **Grupo H:** España, Cabo Verde, Arabia Saudita, Uruguay
- **Grupo I:** Francia, Senegal, Iraq, Noruega
- **Grupo J:** Argentina, Argelia, Austria, Jordania
- **Grupo K:** Portugal, Congo, Uzbekistán, Colombia
- **Grupo L:** Inglaterra, Croacia, Ghana, Panamá

## Project Structure

```
src/
├── components/       # Reusable components (GroupSelector, ProtectedRoute)
├── contexts/         # Authentication context
├── data/            # World Cup groups data
├── pages/           # Main pages (Login, Predictions, Results)
├── services/        # Google Sheets API integration
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Troubleshooting

**Google Sign-In button not appearing:**
- Check browser console for errors
- Verify Google script is loaded in `index.html`

**"Access blocked" error:**
- Add your URL to authorized origins in Google Cloud

**Can't write to Google Sheet:**
- Ensure sheet is shared with "Anyone with link can edit"
- Verify Google Sheets API is enabled

## Future Enhancements

- Points calculation based on actual results
- Admin panel for user management
- Leaderboard
- Multi-language support

## License

MIT
