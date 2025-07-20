# Netlify Deployment Guide

## Environment Variables Setup

To successfully deploy this application on Netlify, you need to configure the following environment variables in your Netlify dashboard:

### Required Environment Variables:

1. **MONGODB_URI**

   - Go to: Site Settings → Build & deploy → Environment → Environment variables
   - Add: `MONGODB_URI` = `mongodb+srv://indpak:YOUR_PASSWORD@visitor-form.2yjalqi.mongodb.net/store-visitation-tracker?retryWrites=true&w=majority&appName=Visitor-Form`
   - Replace `YOUR_PASSWORD` with the actual MongoDB password
   - **IMPORTANT**: If your password contains special characters, URL encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `$` becomes `%24`
     - `%` becomes `%25`
     - Example: `Harshith@0711` becomes `Harshith%400711`

2. **MONGODB_DB**

   - Add: `MONGODB_DB` = `store-visitation-tracker`

3. **NODE_ENV** (optional)
   - Add: `NODE_ENV` = `production`

### Build Settings:

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node.js version:** 18.x or higher

### Important Notes:

1. **Fixed Build Issue**: The previous build error (`MONGODB_URI environment variable is not defined`) has been resolved by moving environment variable access from build-time to runtime in all API routes.

2. **Environment Variables are Runtime Only**: The app now loads environment variables at runtime (when API routes are called) rather than at build time, which resolves build errors and ensures compatibility with serverless deployments.

3. **MongoDB Atlas IP Whitelist**: Make sure to whitelist `0.0.0.0/0` (allow from anywhere) in your MongoDB Atlas network access settings for Netlify deployments.

4. **API Routes**: All API routes (`/api/submit-form` and `/api/test-db`) will work correctly once environment variables are properly configured.

### Testing Deployment:

After configuring environment variables, you can test the deployment by:

1. Visiting your deployed site
2. Filling out and submitting the form
3. Checking if the success alert appears
4. Optionally visiting `/api/test-db` to verify database connectivity

### Troubleshooting:

If you encounter issues:

1. Check that all environment variables are set in Netlify dashboard
2. Verify MongoDB Atlas network access allows connections from anywhere
3. Check Netlify function logs for detailed error messages
4. Ensure the MongoDB password doesn't contain special characters that need URL encoding
