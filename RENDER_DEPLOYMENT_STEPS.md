# Updated Guide: Deploy to Render with PostgreSQL (Blueprint Method)

Since we switched to PostgreSQL, deployment is much easier using a **Blueprint**. This automatically creates both your Database and API and connects them for you.

## Step 1: Clean Up (If needed)

If you have a failed service from before:
1. Go to your Render Dashboard.
2. Click on the failed `terra-consulting-api` service.
3. Go to **Settings** -> Scroll to bottom -> **Delete Web Service**.
4. Type the name to confirm and delete.

## Step 2: Create the Blueprint

1. Click the **"New +"** button at the top right.
2. Select **"Blueprint Source"**.
3. Connect your **`terra-consulting-LLC`** repository.
4. Render will read your `render.yaml` file and show you a plan:
   - **Service 1:** `terra-consulting-api` (Web Service)
   - **Service 2:** `terra-db` (Database)
5. Click **"Apply"** or **"Create"**.

## Step 3: Wait for Deployment

Render will now:
1. Create a free PostgreSQL database.
2. Build your API.
3. Run your migrations automatically.

**Note on Images:**
Since you are on the free tier and haven't manually added a Disk, **uploaded images will be deleted** if the server restarts.
- To fix this later: Go to the new Service -> **Disks** -> Add Disk (`/var/data`, 1GB).

## Step 4: Get Your URL

Once the `terra-consulting-api` service stays "Live" and Green:
1. Click on the service name.
2. Copy the URL from the top left (e.g., `https://terra-consulting-api.onrender.com`).

## Step 5: Final Configuration

1. **Update Vercel Environment Variables:**
   - Go to your Vercel Project -> Settings -> Environment Variables.
   - Update `NEXT_PUBLIC_API_URL` with your new Render URL.
   - Redeploy the Frontend (Deployments -> Redeploy).

2. **Update Render CORS:**
   - Go to Render -> `terra-consulting-api` -> Environment.
   - Update `ALLOWED_ORIGINS` with your Vercel URL.
