# Google Cloud & Google Sheets Setup Guide

This guide walks you through setting up Google Cloud Platform and Google Sheets for the FIFA World Cup 2026 Predictions app.

---

## Part 1: Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** dropdown (top bar)
3. Click **"New Project"**
4. Enter project details:
   - **Project name:** `worldcup-predictions-2026`
   - **Organization:** (Leave as default)
5. Click **"Create"**
6. Wait for the project to be created, then select it

---

### Step 2: Enable Required APIs

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Sheets API"**
   - Click on it
   - Click **"Enable"**
3. Go back to Library
4. Search for **"Google Identity"** or **"Google+ API"**
   - Click on it
   - Click **"Enable"**

---

### Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** user type (unless you have Google Workspace)
3. Click **"Create"**

**Step 3a: App Information**
- **App name:** `Copa Mundial FIFA 2026 Predicciones`
- **User support email:** Your email address
- **App logo:** (Optional) Upload a soccer ball icon
- **Application home page:** (Leave empty for now, add Vercel URL later)
- **Application privacy policy:** (Optional)
- **Application terms of service:** (Optional)
- **Authorized domains:** (Add your domain if you have one, or leave empty)
- **Developer contact information:** Your email
- Click **"Save and Continue"**

**Step 3b: Scopes**
- Click **"Add or Remove Scopes"**
- Search and select:
  - `openid`
  - `profile`
  - `email`
  - `https://www.googleapis.com/auth/spreadsheets` (if available)
- Click **"Update"**
- Click **"Save and Continue"**

**Step 3c: Test Users**
- Click **"Add Users"**
- Add the Gmail addresses of your friends who will test the app
- You can add up to 100 test users in development mode
- Click **"Add"**
- Click **"Save and Continue"**

**Step 3d: Summary**
- Review your settings
- Click **"Back to Dashboard"**

---

### Step 4: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** (top bar)
3. Select **"OAuth client ID"**
4. If prompted to configure consent screen, you've already done this in Step 3
5. Configure the OAuth client:
   - **Application type:** Web application
   - **Name:** `World Cup Predictions Web Client`
   
   **Authorized JavaScript origins:**
   - Click **"+ Add URI"**
   - Add: `http://localhost:5173` (for local development)
   - Click **"+ Add URI"** again
   - Add: `https://yourapp.vercel.app` (replace with your actual Vercel URL after deployment)
   
   **Authorized redirect URIs:**
   - Leave empty (not needed for this app)

6. Click **"Create"**
7. A popup will appear with your credentials:
   - **Client ID:** Copy this (starts with something like `123456789-abc...apps.googleusercontent.com`)
   - **Client Secret:** You won't need this for a client-side app
8. Click **"OK"**

**Save your Client ID** - you'll add it to `.env.local` as `VITE_GOOGLE_CLIENT_ID`

---

### Step 5: Create API Key (for Google Sheets)

1. Still in **"Credentials"**, click **"+ Create Credentials"**
2. Select **"API key"**
3. A popup appears with your API key - Copy it
4. Click **"Restrict Key"** (highly recommended)

**Restrict the API Key:**

**Application restrictions:**
- Select **"HTTP referrers (web sites)"**
- Click **"Add an item"**
- Add: `http://localhost:5173/*` (for development)
- Click **"Add an item"** again
- Add: `https://yourapp.vercel.app/*` (for production)

**API restrictions:**
- Select **"Restrict key"**
- Click the dropdown and check: **"Google Sheets API"**

5. Click **"Save"**

**Save your API Key** - you'll add it to `.env.local` as `VITE_GOOGLE_SHEETS_API_KEY`

---

## Part 2: Google Sheets Setup

### Step 1: Create the Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"Blank"** to create a new spreadsheet
3. Click **"Untitled spreadsheet"** at the top
4. Rename it to: `Copa Mundial 2026 - Predicciones`
5. At the bottom, rename **"Sheet1"** to: `Predicciones`

---

### Step 2: Set Up the Header Row

Click on cell **A1** and enter the following headers across row 1:

| Column | Header |
|--------|--------|
| A | Timestamp |
| B | Email |
| C | Name |
| D | Grupo A 1° |
| E | Grupo A 2° |
| F | Grupo A 3° |
| G | Grupo B 1° |
| H | Grupo B 2° |
| I | Grupo B 3° |
| J | Grupo C 1° |
| K | Grupo C 2° |
| L | Grupo C 3° |
| M | Grupo D 1° |
| N | Grupo D 2° |
| O | Grupo D 3° |
| P | Grupo E 1° |
| Q | Grupo E 2° |
| R | Grupo E 3° |
| S | Grupo F 1° |
| T | Grupo F 2° |
| U | Grupo F 3° |
| V | Grupo G 1° |
| W | Grupo G 2° |
| X | Grupo G 3° |
| Y | Grupo H 1° |
| Z | Grupo H 2° |
| AA | Grupo H 3° |
| AB | Grupo I 1° |
| AC | Grupo I 2° |
| AD | Grupo I 3° |
| AE | Grupo J 1° |
| AF | Grupo J 2° |
| AG | Grupo J 3° |
| AH | Grupo K 1° |
| AI | Grupo K 2° |
| AJ | Grupo K 3° |
| AK | Grupo L 1° |
| AL | Grupo L 2° |
| AM | Grupo L 3° |
| AN | Points |
| AO | Locked |

**Quick way to add headers:**
Copy this and paste it into cell A1:
```
Timestamp	Email	Name	Grupo A 1°	Grupo A 2°	Grupo A 3°	Grupo B 1°	Grupo B 2°	Grupo B 3°	Grupo C 1°	Grupo C 2°	Grupo C 3°	Grupo D 1°	Grupo D 2°	Grupo D 3°	Grupo E 1°	Grupo E 2°	Grupo E 3°	Grupo F 1°	Grupo F 2°	Grupo F 3°	Grupo G 1°	Grupo G 2°	Grupo G 3°	Grupo H 1°	Grupo H 2°	Grupo H 3°	Grupo I 1°	Grupo I 2°	Grupo I 3°	Grupo J 1°	Grupo J 2°	Grupo J 3°	Grupo K 1°	Grupo K 2°	Grupo K 3°	Grupo L 1°	Grupo L 2°	Grupo L 3°	Points	Locked
```

---

### Step 3: Share the Spreadsheet

1. Click the **"Share"** button (top right corner)
2. Under **"General access"**, click the dropdown that says **"Restricted"**
3. Select **"Anyone with the link"**
4. Make sure the permission level is set to **"Editor"**
5. Click **"Done"**

**⚠️ Important:** This allows anyone with the link to edit the sheet. This is necessary for the app to write data, but it also means anyone with the link can modify the sheet. For a friends-only app, this is usually acceptable.

---

### Step 4: Get the Spreadsheet ID

1. Look at the URL of your Google Sheet
2. The URL format is:
   ```
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid=0
   ```
3. Copy the **SPREADSHEET_ID** part (the long alphanumeric string)
   - Example: If your URL is `https://docs.google.com/spreadsheets/d/1AbC123XyZ456/edit`
   - Then your Spreadsheet ID is: `1AbC123XyZ456`

**Save your Spreadsheet ID** - you'll add it to `.env.local` as `VITE_GOOGLE_SPREADSHEET_ID`

---

## Part 3: Configure Your App

### Step 1: Update `.env.local`

In your project folder, open `.env.local` and add your credentials:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_SHEETS_API_KEY=your-api-key-here
VITE_GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

Replace:
- `your-client-id-here.apps.googleusercontent.com` with your OAuth Client ID from Step 4
- `your-api-key-here` with your API Key from Step 5
- `your-spreadsheet-id-here` with your Spreadsheet ID from Part 2, Step 4

---

### Step 2: Test Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser

3. Test the flow:
   - Click "Sign in with Google"
   - Choose your Google account
   - Make predictions for all 12 groups
   - Click "Enviar Predicciones"
   - Check your Google Sheet - a new row should appear

4. Verify the lock mechanism:
   - Try accessing `/predictions` again
   - You should be redirected to `/results`

---

## Part 4: Deploy to Production

### After deploying to Vercel/Netlify:

1. **Update Google Cloud OAuth Client:**
   - Go to Google Cloud Console → Credentials
   - Click on your OAuth Client ID
   - Under "Authorized JavaScript origins", add your production URL
   - Example: `https://yourapp.vercel.app`
   - Click "Save"

2. **Update API Key Restrictions:**
   - Click on your API Key
   - Under "Application restrictions" → "HTTP referrers", add:
     - `https://yourapp.vercel.app/*`
   - Click "Save"

3. **Test in production:**
   - Visit your deployed URL
   - Complete the full flow
   - Verify data is saved to Google Sheet

---

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"

**Cause:** Your production URL is not in the authorized JavaScript origins.

**Solution:**
1. Go to Google Cloud Console → Credentials → OAuth Client ID
2. Add your production URL to "Authorized JavaScript origins"
3. Wait a few minutes for changes to propagate

---

### Error: "API key not valid"

**Cause:** API key restrictions don't match your domain.

**Solution:**
1. Go to Credentials → API Key
2. Check "Application restrictions" includes your domain
3. Check "API restrictions" includes Google Sheets API

---

### Error: "The caller does not have permission"

**Cause:** The Google Sheet might not be shared correctly.

**Solution:**
1. Open your Google Sheet
2. Click "Share" → "General access"
3. Ensure it's set to "Anyone with the link" and "Editor"

---

### Error: Google Sign-In button doesn't appear

**Cause:** The Google Identity script might not be loading.

**Solution:**
1. Check browser console for errors
2. Verify `<script src="https://accounts.google.com/gsi/client" async defer></script>` is in `index.html`
3. Make sure your Client ID is correct in `.env.local`

---

### OAuth Consent Screen shows "Unverified App" warning

**Cause:** Your app is in testing mode.

**Solution:** This is normal for testing. Your test users can proceed by clicking "Advanced" → "Go to [App Name] (unsafe)". To remove this warning, you need to verify your app (requires a full review process).

---

## Security Notes

1. **API Key:** Restricted to specific domains and Google Sheets API only
2. **OAuth:** Only test users can sign in until the app is verified
3. **Google Sheet:** Anyone with the link can edit - acceptable for friends-only app
4. **Environment Variables:** Never commit `.env.local` to Git (it's in `.gitignore`)

---

## Summary Checklist

- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created and added to `.env.local`
- [ ] API Key created, restricted, and added to `.env.local`
- [ ] Google Sheet created with header row
- [ ] Google Sheet shared with "Anyone with link can edit"
- [ ] Spreadsheet ID added to `.env.local`
- [ ] Test users added to OAuth consent screen
- [ ] Local testing successful
- [ ] Production URLs added to Google Cloud credentials
- [ ] Production deployment tested

---

**You're all set! 🎉 Your FIFA World Cup 2026 Predictions app is ready to use!**
