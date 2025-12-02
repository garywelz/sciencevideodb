"""
HuggingFace Space Demo - Science Video Database

A simple Gradio interface to showcase the Science Video Database project.
This is a demo interface that will be enhanced as the project develops.
"""

import gradio as gr

def search_videos(query: str, discipline: str = "all"):
    """
    Demo search function - will be connected to the actual database later
    """
    if not query:
        return "Please enter a search query."
    
    # Placeholder response - will connect to actual database
    return f"""
    🔍 Search results for: "{query}"
    📚 Discipline: {discipline}
    
    This is a demo interface. The actual search functionality will connect to:
    - PostgreSQL database with video metadata
    - Vector database for semantic search
    - Search index for keyword matching
    
    Check the GitHub repository for the full implementation:
    https://github.com/garywelz/sciencevideodb
    """

def get_video_info(video_id: str):
    """Get video information by ID"""
    if not video_id:
        return "Please enter a video ID."
    
    return f"""
    📹 Video ID: {video_id}
    
    This demo will show:
    - Video metadata (title, description, channel)
    - Transcript segments
    - Related videos
    
    Full implementation coming soon!
    """

# Create Gradio interface
with gr.Blocks(title="Science Video Database", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🔬 Science Video Database
    
    A curated search experience for technical science enthusiasts.
    
    Browse videos from biology, chemistry, CS, mathematics, and physics channels.
    """)
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("### 🔍 Search Videos")
            search_query = gr.Textbox(
                label="Search Query",
                placeholder="Enter keywords, topics, or concepts..."
            )
            discipline_filter = gr.Dropdown(
                choices=["all", "biology", "chemistry", "cs", "mathematics", "physics"],
                value="all",
                label="Discipline"
            )
            search_btn = gr.Button("Search", variant="primary")
            
        with gr.Column():
            search_results = gr.Markdown(label="Results")
    
    search_btn.click(
        fn=search_videos,
        inputs=[search_query, discipline_filter],
        outputs=search_results
    )
    
    gr.Markdown("---")
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("### 📹 Video Information")
            video_id_input = gr.Textbox(
                label="Video ID",
                placeholder="Enter YouTube video ID..."
            )
            video_btn = gr.Button("Get Info", variant="secondary")
            
        with gr.Column():
            video_info = gr.Markdown(label="Video Details")
    
    video_btn.click(
        fn=get_video_info,
        inputs=[video_id_input],
        outputs=video_info
    )
    
    gr.Markdown("""
    ---
    
    ### 📚 About This Project
    
    This is a demo interface for the **Science Video Database** project.
    
    **Full Implementation**: [GitHub Repository](https://github.com/garywelz/sciencevideodb)
    
    **Features** (coming soon):
    - 🔍 Hybrid search (keyword + semantic)
    - 📝 Full transcript search
    - 🎯 Filter by discipline, channel, date
    - 📊 Video metadata and analytics
    - 🎬 Jump to transcript timestamps
    
    **Current Status**: Foundation complete, frontend and ingestion pipeline in development.
    """)

if __name__ == "__main__":
    demo.launch()

