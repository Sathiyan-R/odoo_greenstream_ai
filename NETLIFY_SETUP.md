# Netlify Deployment Setup

## Environment Variables Configuration

After deploying to Netlify, you **MUST** configure the following environment variables in your Netlify dashboard:

### Step 1: Go to Site Settings
1. Log in to your Netlify dashboard
2. Select your site (greenstream-ai)
3. Go to **Site settings** → **Environment variables**

### Step 2: Add These Variables

Add the following environment variables:

```
VITE_API_BASE_URL=http://localhost:4000/api
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=india1947
MYSQL_DATABASE=greenstream
```

### Step 3: Redeploy
1. After adding the environment variables, click **"Deploys"** in the top menu
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

## Build Configuration

The `netlify.toml` file is already configured with:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **SPA routing**: Configured with redirects
- **Node version**: 18

## Troubleshooting

### AI Assistant Not Working?
- Check that all environment variables are set in Netlify (not just in the `.env` file)
- Redeploy after adding environment variables
- Check browser console for error messages

### Environmental Map Button Missing on Mobile?
- Fixed! The button now shows on mobile devices with shorter text "Map"

### 404 Errors on Page Refresh?
- The `_redirects` file and `netlify.toml` redirects handle SPA routing
- Make sure they're in the repository

## Quick Deploy Checklist
- ✅ Environment variables configured in Netlify
- ✅ netlify.toml file in repository
- ✅ _redirects file in public/ folder
- ✅ Clear cache and redeploy after changes
