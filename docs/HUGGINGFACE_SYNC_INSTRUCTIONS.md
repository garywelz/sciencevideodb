# How to Sync HuggingFace Space with GitHub

## Step-by-Step Instructions

### 1. Navigate to Settings
- On your HuggingFace Space page: https://huggingface.co/spaces/garywelz/sciencevideodb
- Click the **"Settings"** tab (at the top, next to "App", "Files", "Community")

### 2. Find Repository Section
- Scroll down in the Settings page
- Look for the **"Repository"** section

### 3. Enable GitHub Sync
- Find the option **"Sync with GitHub repository"** or **"Connect GitHub repository"**
- Click the button/checkbox to enable it

### 4. Configure Sync
- **Repository**: Select `garywelz/sciencevideodb`
- **Branch**: Select `main`
- **Auto-sync**: Enable this option ✅ (so it updates automatically on each push)

### 5. Save/Confirm
- Click **"Save"** or **"Confirm"** button

## What Happens Next

Once synced:
1. HuggingFace will pull files from your GitHub repository
2. It will detect `app.py` and `requirements.txt`
3. It will build and deploy the Gradio app
4. The "App" tab will show your interactive demo interface

## Troubleshooting

### If you don't see "Sync with GitHub" option:
- Make sure you're the owner of the Space
- The Space might need to be public (or you need proper permissions)
- Try refreshing the Settings page

### If sync doesn't work:
- Check that the GitHub repository name matches exactly: `garywelz/sciencevideodb`
- Verify the branch is `main` (not `master`)
- Make sure the repository exists and is accessible

### Alternative: Manual Upload
If GitHub sync isn't available, you can manually upload files:
1. Go to the **"Files"** tab
2. Click **"Add file"** → **"Upload file"**
3. Upload: `README.md`, `app.py`, `requirements.txt`
4. The Space will rebuild automatically

## Verify It Worked

After syncing:
- Go to the **"App"** tab
- You should see the Gradio interface (search demo)
- Go to **"Files"** tab to verify all files are present
- Check **"Logs"** tab to see build progress

---

**Note**: The sync might take 1-2 minutes to complete. Watch the build logs to see progress!

