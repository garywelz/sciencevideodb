-- Science Video Database Schema
-- PostgreSQL database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text similarity search

-- Channels table - Registry of approved channels for ingestion
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel_id VARCHAR(255) NOT NULL UNIQUE, -- Platform-specific channel ID
    channel_name VARCHAR(500) NOT NULL,
    channel_url TEXT,
    source VARCHAR(50) NOT NULL DEFAULT 'youtube', -- 'youtube', 'vimeo', etc.
    disciplines TEXT[] NOT NULL, -- Array of discipline names
    priority INTEGER NOT NULL DEFAULT 5, -- 1-10, higher = more important
    update_cadence VARCHAR(20) NOT NULL DEFAULT 'daily', -- 'hourly', 'daily', 'weekly'
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    last_video_at TIMESTAMP WITH TIME ZONE, -- Most recent video we've seen
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Videos table - Canonical video records
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(255) NOT NULL, -- Platform-specific video ID (e.g., YouTube video ID)
    source VARCHAR(50) NOT NULL DEFAULT 'youtube',
    title VARCHAR(500) NOT NULL,
    description TEXT,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER, -- Duration in seconds
    view_count BIGINT,
    channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    thumbnail_url TEXT,
    video_url TEXT NOT NULL,
    disciplines TEXT[] NOT NULL, -- Can belong to multiple disciplines
    tags TEXT[] DEFAULT '{}',
    transcript_available BOOLEAN NOT NULL DEFAULT false,
    embedding_id VARCHAR(255), -- Reference to vector DB embedding
    search_index_id VARCHAR(255), -- Reference to search index document
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(source_id, source)
);

-- Transcript segments table - Time-stamped transcript chunks
CREATE TABLE transcript_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    start_time DECIMAL(10, 3) NOT NULL, -- Start time in seconds
    end_time DECIMAL(10, 3) NOT NULL, -- End time in seconds
    confidence DECIMAL(5, 4), -- Optional confidence score (0-1)
    
    CHECK (end_time > start_time)
);

-- User preferences table - For personalization (future)
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY, -- Will reference auth.users when auth is added
    followed_channels UUID[] DEFAULT '{}', -- Array of channel UUIDs
    followed_tags TEXT[] DEFAULT '{}',
    preferred_disciplines TEXT[] DEFAULT '{}',
    watch_history UUID[] DEFAULT '{}', -- Array of video UUIDs (ordered)
    saved_videos UUID[] DEFAULT '{}', -- Array of video UUIDs
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance

-- Channels
CREATE INDEX idx_channels_source ON channels(source);
CREATE INDEX idx_channels_active ON channels(is_active) WHERE is_active = true;
CREATE INDEX idx_channels_disciplines ON channels USING GIN(disciplines);
CREATE INDEX idx_channels_last_checked ON channels(last_checked_at);

-- Videos
CREATE INDEX idx_videos_source_id ON videos(source_id, source);
CREATE INDEX idx_videos_channel_id ON videos(channel_id);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_disciplines ON videos USING GIN(disciplines);
CREATE INDEX idx_videos_tags ON videos USING GIN(tags);
CREATE INDEX idx_videos_title_search ON videos USING GIN(title gin_trgm_ops); -- For text search
CREATE INDEX idx_videos_transcript_available ON videos(transcript_available) WHERE transcript_available = true;

-- Transcript segments
CREATE INDEX idx_transcript_segments_video_id ON transcript_segments(video_id);
CREATE INDEX idx_transcript_segments_time_range ON transcript_segments(video_id, start_time, end_time);
CREATE INDEX idx_transcript_segments_text_search ON transcript_segments USING GIN(text gin_trgm_ops);

-- Updated_at trigger function (auto-update updated_at timestamp)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Example seed data (for development)
-- INSERT INTO channels (channel_id, channel_name, channel_url, disciplines, priority, update_cadence)
-- VALUES 
--     ('UC_x5XG1OV2P6uZZ5FSM9Ttw', 'Google Developers', 'https://www.youtube.com/@GoogleDevelopers', ARRAY['cs'], 8, 'daily'),
--     ('UCZYTClx2T1of7BRZ86-8fow', 'Khan Academy', 'https://www.youtube.com/@khanacademy', ARRAY['mathematics', 'physics'], 9, 'daily');

