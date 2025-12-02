# HuggingFace Space Setup

## Space Configuration

The HuggingFace Space is configured to use **Gradio** for the demo interface.

- **Space URL**: https://huggingface.co/spaces/garywelz/sciencevideodb
- **SDK**: Gradio
- **App File**: `app.py`

## Files for HuggingFace Space

### Required Files

1. **`README.md`** - Main README with HuggingFace frontmatter metadata
   - Contains Space configuration in YAML frontmatter
   - Describes the project

2. **`app.py`** - Gradio demo interface
   - Interactive search demo
   - Video information lookup
   - Placeholder for future database integration

3. **`requirements.txt`** - Python dependencies
   - `gradio>=4.0.0`

4. **`.hfignore`** - Files to ignore when syncing
   - Excludes `node_modules/`, `.next/`, `dist/`, etc.
   - Protects API keys and secrets

## How to Set Up

### Option 1: Sync with GitHub (Recommended)

1. Go to https://huggingface.co/spaces/garywelz/sciencevideodb/settings
2. Click "Sync with GitHub repository"
3. Select repository: `garywelz/sciencevideodb`
4. Select branch: `main`
5. Enable auto-sync

The Space will automatically update when you push to GitHub!

### Option 2: Manual Upload

1. Go to https://huggingface.co/spaces/garywelz/sciencevideodb
2. Upload required files:
   - `README.md` (with frontmatter)
   - `app.py`
   - `requirements.txt`
   - `.hfignore`

## Current Demo Interface

The Gradio app (`app.py`) provides:
- 🔍 **Search Interface**: Demo video search with discipline filters
- 📹 **Video Info**: Lookup video information by ID
- 📚 **Project Info**: Links to documentation and GitHub

**Note**: This is currently a demo/placeholder interface. As the project develops, it will connect to:
- PostgreSQL database for video metadata
- Vector database for semantic search
- Search index for keyword matching

## Customization

To modify the Space:

1. **Change appearance**: Edit frontmatter in `README.md`
   - `emoji`: Change the Space emoji
   - `colorFrom`/`colorTo`: Change gradient colors
   - `title`: Update the title

2. **Update demo**: Edit `app.py`
   - Add new interface components
   - Connect to actual database (when ready)
   - Add more functionality

3. **Add dependencies**: Update `requirements.txt`
   - Add Python packages as needed

## Deployment

Once synced with GitHub, the Space will automatically:
- Build on every push to `main`
- Update the demo interface
- Show build logs in the Space UI

## Troubleshooting

### Space won't build
- Check that `app.py` exists in the root
- Verify `requirements.txt` has valid dependencies
- Check build logs in the Space UI

### Changes not showing
- Ensure files are pushed to GitHub
- Verify auto-sync is enabled
- Check that branch is set to `main`

### Need to update configuration
- Edit frontmatter in `README.md`
- Push changes to GitHub
- Space will rebuild automatically

## Next Steps

As the project develops:
1. Connect `app.py` to the actual PostgreSQL database
2. Implement real search functionality
3. Add video player integration
4. Show actual transcript segments
5. Add filters and sorting

