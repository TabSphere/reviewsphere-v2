# Google Business Profile Integration Setup Guide

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. Click **"Select a project"** → **"New Project"**
3. Enter project name (e.g., "ReviewSphere")
4. Click **"Create"**

## Step 2: Enable Google Business Profile API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Business Profile API"** (or "Google My Business API")
3. Click on it and press **"Enable"**
4. Also enable **"Google+ API"** (needed for OAuth)

## Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the **OAuth consent screen** first:
   - Select **"External"** user type
   - Fill in:
     - App name: `ReviewSphere`
     - User support email: Your email
     - Developer contact email: Your email
   - Click **"Save and Continue"**
   - On **Scopes** page, click **"Save and Continue"** (we'll add scopes in credentials)
   - On **Test users** page, add your email, then **"Save and Continue"**

4. Back to **Create OAuth client ID**:
   - Select **"Web application"**
   - Name: `ReviewSphere Web Client`
   - Add **Authorized redirect URIs**:
     ```
     http://localhost:3001/api/google/callback
     https://your-production-domain.com/api/google/callback
     ```
   - Click **"Create"**

5. **Copy your credentials**:
   - A popup will show your **Client ID** and **Client Secret**
   - Save these securely!

## Step 4: Add Credentials to Your Project

1. Open your `.env.local` file in the project root
2. Add these lines:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

3. **Important**: Make sure `.env.local` is in your `.gitignore` file (it should be by default)

## Step 5: Restart Your Development Server

After adding the credentials:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npx next dev -p 3001
```

## Step 6: Test the Connection

1. Go to your dashboard: http://localhost:3001/dashboard
2. Click **"Connect Google Account"** button
3. You'll be redirected to Google's OAuth screen
4. Sign in and grant permissions
5. You'll be redirected back to your dashboard

## Required Scopes

The following OAuth scopes are requested:
- `https://www.googleapis.com/auth/business.manage` - To access and manage Google Business Profile
- `openid` - For authentication
- `email` - To get user's email
- `profile` - To get user's profile info

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console EXACTLY matches:
  `http://localhost:3001/api/google/callback`
- No trailing slashes
- Check for typos

### Error: "App not verified"
- During development, this is normal
- Click **"Advanced"** → **"Go to ReviewSphere (unsafe)"** to proceed
- For production, you'll need to verify your app with Google

### Error: "Access blocked: This app's request is invalid"
- Make sure you've enabled the Google Business Profile API
- Check that your OAuth consent screen is configured
- Verify the scopes in your consent screen settings

### Connection shows "Not configured"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are in `.env.local`
- Restart the dev server after adding environment variables
- Check for any typos in the variable names

## Production Deployment

For production (e.g., Vercel, Netlify):

1. Add the same environment variables in your hosting platform's settings
2. Update `NEXT_PUBLIC_APP_URL` to your production domain
3. Add your production domain to **Authorized redirect URIs** in Google Cloud Console
4. Submit your app for verification with Google (required for public users)

## Security Notes

- **Never commit** `.env.local` to git
- **Never share** your Client Secret publicly
- **Rotate credentials** if you suspect they've been compromised
- Use different credentials for development and production

## Need Help?

- Google Cloud Console: https://console.cloud.google.com/
- OAuth 2.0 Documentation: https://developers.google.com/identity/protocols/oauth2
- Google Business Profile API Docs: https://developers.google.com/my-business

---

**Your credentials should look like this:**
```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWx
NEXT_PUBLIC_APP_URL=http://localhost:3001
```
