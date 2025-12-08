# Manual Upload to HuggingFace Space

Since the GitHub sync option isn't visible in Settings, here's how to upload files manually:

## Step-by-Step Instructions

### 1. Go to Files Tab
- Click the **"Files"** tab at the top of your Space page

### 2. Upload README.md
- Click **"Add file"** → **"Upload file"**
- Upload the `README.md` file (with the frontmatter metadata)
- This will configure the Space appearance and metadata

### 3. Upload app.py
- Click **"Add file"** → **"Upload file"** again
- Upload the `app.py` file
- This is your Gradio demo interface

### 4. Upload requirements.txt
- Click **"Add file"** → **"Upload file"** again
- Upload the `requirements.txt` file
- This tells HuggingFace what Python packages to install

### 5. Wait for Build
- After uploading, the Space will automatically rebuild
- Go to the **"Logs"** tab to watch the build progress
- This usually takes 1-2 minutes

### 6. Check the App
- Once built, go to the **"App"** tab
- You should see your Gradio interface!

## File Contents

You can copy the file contents from your GitHub repository:
- https://github.com/garywelz/sciencevideodb/blob/main/README.md
- https://github.com/garywelz/sciencevideodb/blob/main/app.py
- https://github.com/garywelz/sciencevideodb/blob/main/requirements.txt

Or download them locally and upload.

## Alternative: Use Git

If you prefer using git commands:

```bash
# Clone the Space
git clone https://huggingface.co/spaces/garywelz/sciencevideodb
cd sciencevideodb

# Copy files from your local repo
cp /home/gdubs/scienceviddb/README.md .
cp /home/gdubs/scienceviddb/app.py .
cp /home/gdubs/scienceviddb/requirements.txt .

# Commit and push
git add README.md app.py requirements.txt
git commit -m "Add Gradio app and configuration"
git push
```

## What Each File Does

- **README.md**: Space metadata and description (with frontmatter)
- **app.py**: Gradio demo interface
- **requirements.txt**: Python dependencies (Gradio)

Once these three files are uploaded, the Space will automatically build and deploy!

