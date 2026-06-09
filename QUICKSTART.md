# Quick Start Guide

## 🎉 Your FIFA World Cup 2026 Predictions App is Ready!

### What Was Built

A complete React web application where users can:
- Sign in with Google
- Predict the top 3 teams from each of the 12 World Cup groups
- Submit predictions to a Google Sheet
- View their results (predictions locked after submission)

---

## 📋 Next Steps

### 1. Set Up Google Cloud & Google Sheets

**Read the detailed guide:** Open `SETUP.md` for complete instructions.

**Quick checklist:**
- [ ] Create Google Cloud project
- [ ] Enable Google Sheets API
- [ ] Create OAuth Client ID
- [ ] Create API Key
- [ ] Create Google Sheet with headers
- [ ] Share sheet with "Anyone with link can edit"
- [ ] Get your credentials

### 2. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   VITE_GOOGLE_SHEETS_API_KEY=your-api-key
   VITE_GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
   ```

### 3. Run the App Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Test the Flow

1. Click "Sign in with Google"
2. Select your Google account
3. Fill in predictions for all 12 groups
4. Click "Enviar Predicciones"
5. Check your Google Sheet for the new row
6. Verify you're redirected to the results page
7. Try accessing `/predictions` again (should redirect to `/results`)

---

## 📁 Project Structure

```
worldcup-predictions/
├── src/
│   ├── components/          # Reusable components
│   │   ├── GroupSelector.jsx      # Group dropdown component
│   │   └── ProtectedRoute.jsx     # Auth route guard
│   ├── contexts/           # React Context
│   │   └── AuthContext.jsx        # Authentication state
│   ├── data/              # Static data
│   │   └── worldcup2026.js        # 12 groups with teams
│   ├── pages/             # Main pages
│   │   ├── LoginPage.jsx          # Google Sign-In
│   │   ├── PredictionsPage.jsx    # Main form
│   │   └── ResultsPage.jsx        # Display results
│   ├── services/          # API integrations
│   │   └── googleSheets.js        # Google Sheets API
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
├── .env.local             # Your credentials (not committed)
├── .env.example           # Example env file
├── SETUP.md              # Detailed setup instructions
└── README.md             # Project documentation
```

---

## 🔧 Available Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build locally
```

---

## 🚀 Deploy to Production

### Option 1: Vercel (Recommended)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/worldcup-predictions.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com/) and import your repository

3. Add environment variables in Vercel dashboard

4. Update Google Cloud credentials with your Vercel URL

### Option 2: Netlify

1. Push to GitHub (same as above)
2. Go to [netlify.com](https://netlify.com/) and import
3. Add environment variables
4. Update Google Cloud credentials

---

## 🌍 World Cup 2026 Groups

The app includes these 12 groups (Spanish team names):

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

---

## ✨ Features

✅ **Google Sign-In** - Secure authentication  
✅ **12 Groups** - All World Cup 2026 groups included  
✅ **Mutual Exclusivity** - Can't pick same team twice per group  
✅ **Form Validation** - Must complete all groups before submit  
✅ **Lock Mechanism** - Predictions locked after submission  
✅ **Google Sheets Integration** - Automatic data persistence  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Spanish UI** - Labels and team names in Spanish  

---

## 🛠️ Troubleshooting

### Google Sign-In button doesn't appear
- Check browser console for errors
- Verify Client ID in `.env.local`
- Ensure Google script is loaded in `index.html`

### Can't submit predictions
- Check Google Sheets API is enabled
- Verify API key in `.env.local`
- Ensure spreadsheet is shared correctly

### "Access blocked" error
- Add your domain to authorized origins in Google Cloud
- Wait a few minutes for changes to propagate

**See `SETUP.md` for more detailed troubleshooting.**

---

## 📝 Important Notes

1. **Environment Variables:** Never commit `.env.local` to Git (it's in `.gitignore`)
2. **Test Users:** Add your friends' emails to OAuth consent screen test users
3. **Sheet Permissions:** "Anyone with link can edit" is required for the app to write data
4. **Lock Feature:** Once submitted, users cannot edit their predictions
5. **Points:** Currently static (0) - can be updated manually in the sheet

---

## 🎯 What's Next?

### For Now:
1. Complete Google Cloud setup (see `SETUP.md`)
2. Configure `.env.local`
3. Test locally
4. Deploy to Vercel/Netlify
5. Share with your friends!

### Future Enhancements:
- Implement points calculation based on actual World Cup results
- Add admin panel to manage users and points
- Create leaderboard
- Add multi-language support (EN/ES toggle)

---

## 💡 Tips

- **Test thoroughly** before sharing with friends
- **Backup your Google Sheet** regularly
- **Monitor the sheet** for any issues
- **Update environment variables** when deploying to production
- **Keep your credentials secure** - never share API keys publicly

---

**Need help? Check `SETUP.md` for detailed instructions!**

**Happy predicting! ⚽🏆**
