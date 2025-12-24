# Terra Consulting LLC - Deployment Guide

## Prerequisites
- GitHub account (to push your code)
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)

## Step 1: Push Code to GitHub

Your code is already initialized in Git. Push it to GitHub:

```bash
# If you haven't already, create a new repository on GitHub
# Then run these commands:
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `terra-consulting-api`
   - **Region**: Frankfurt (closest to Kenya)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npx prisma migrate deploy && node dist/index.js`
   - **Plan**: Free (can upgrade later)

5. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `file:/var/data/dev.db`
   - `PORT`: `5000`
   - `JWT_SECRET`: Click "Generate" to create a secure secret
   - `ALLOWED_ORIGINS`: (leave blank for now, will add after frontend deploy)

6. **Add Persistent Disk:**
   - Click "Advanced" → "Add Disk"
   - **Name**: `terra-data`
   - **Mount Path**: `/var/data`
   - **Size**: 1 GB

7. **Click "Create Web Service"**

8. **Wait for deployment** (5-10 minutes for first deploy)

9. **Copy your backend URL** (e.g., `https://terra-consulting-api.onrender.com`)

10. **Update ALLOWED_ORIGINS**: Go back to Environment Variables and set it to your frontend URL (we'll get this in Step 3)

## Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

5. **Add Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL from Step 2
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: `pk.eyJ1IjoidG9ubnlraW1lbWlhIiwiYSI6ImNtajl6a3cxcDAwNWUzZnNndWFrZHcwNW4ifQ.N0qsEoGeWKZ1TENPQBgkPA`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: `254700000000`

6. **Click "Deploy"**

7. **Wait for deployment** (2-5 minutes)

8. **Copy your frontend URL** (e.g., `https://terra-consulting.vercel.app`)

9. **Go back to Render** and update the `ALLOWED_ORIGINS` environment variable with your Vercel URL

## Step 4: Seed the Database (Optional)

If you want to add sample data or create an admin user:

1. **In Render Dashboard**, go to your service
2. **Click "Shell"** (top right)
3. **Run seeding commands:**
   ```bash
   npm run seed        # Seed sample properties
   # OR
   cd /opt/render/project/src
   npx tsx seed_admin.ts   # Create admin user
   ```

## Step 5: Verify Deployment

### Test Backend:
Visit: `https://your-backend-url.onrender.com/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend:
Visit: `https://your-frontend-url.vercel.app`

Should show your property listing homepage.

### Test Integration:
1. Open frontend in browser
2. Check if properties load (API connection working)
3. Try uploading an image (if you have admin access)
4. Submit a lead inquiry form

## Troubleshooting

### Backend Issues:
- **Check Render Logs**: Dashboard → Your Service → Logs
- **Common issues:**
  - Build fails: Check if TypeScript compiles locally (`npm run build`)
  - Database errors: Ensure migrations ran (`npx prisma migrate deploy`)
  - CORS errors: Double-check `ALLOWED_ORIGINS` matches your Vercel URL exactly

### Frontend Issues:
- **Check Vercel Logs**: Dashboard → Your Project → Deployments → Click latest → View Logs
- **Common issues:**
  - Build fails: Check for TypeScript errors locally
  - API not connecting: Verify `NEXT_PUBLIC_API_URL` is correct
  - Blank map: Verify Mapbox token is valid

### Performance:
- **Render free tier**: First request may be slow (service spins down after inactivity)
- **Solution**: Upgrade to Starter plan ($7/month) for always-on service
- **Or**: Use a service like UptimeRobot to ping your API every 5 minutes

## Updating Your Application

### Auto-Deploy:
Both Vercel and Render are configured for auto-deploy. Just push to GitHub:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel and Render will automatically rebuild and deploy your changes.

## Custom Domain (Optional)

### For Frontend (Vercel):
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `www.terraconsulting.co.ke`)
3. Follow DNS configuration instructions

### For Backend (Render):
1. Go to Service Settings → Custom Domain
2. Add your API subdomain (e.g., `api.terraconsulting.co.ke`)
3. Update `ALLOWED_ORIGINS` and `NEXT_PUBLIC_API_URL` accordingly

## Support

If you encounter issues:
- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/docs
- Check service status: https://status.render.com, https://status.vercel.com
