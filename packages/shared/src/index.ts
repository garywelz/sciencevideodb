/**
 * Core data models and interfaces for Science Video Database
 */

/**
 * Supported scientific disciplines
 */
export type Discipline = 'biology' | 'chemistry' | 'cs' | 'mathematics' | 'physics';

/**
 * Video source platform
 */
export type VideoSource = 'youtube' | 'vimeo' | 'other';

/**
 * Canonical video record stored in database
 */
export interface VideoRecord {
  id: string; // UUID primary key
  sourceId: string; // Platform-specific ID (e.g., YouTube video ID)
  source: VideoSource;
  title: string;
  description: string | null;
  publishedAt: Date;
  duration: number; // Duration in seconds
  viewCount: number | null;
  channelId: string;
  channelName: string;
  channelUrl: string | null;
  thumbnailUrl: string | null;
  videoUrl: string;
  disciplines: Discipline[]; // Can belong to multiple disciplines
  tags: string[]; // User-defined or extracted tags
  transcriptAvailable: boolean;
  embeddingId: string | null; // Reference to vector DB embedding
  searchIndexId: string | null; // Reference to search index document
  metadata: Record<string, unknown>; // Additional flexible metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Transcript segment with timestamp
 */
export interface TranscriptSegment {
  id: string;
  videoId: string;
  text: string;
  startTime: number; // Start time in seconds
  endTime: number; // End time in seconds
  confidence?: number; // Optional confidence score
}

/**
 * Channel registry entry for ingestion management
 */
export interface ChannelRegistry {
  id: string; // UUID primary key
  channelId: string; // Platform-specific channel ID
  channelName: string;
  channelUrl: string;
  source: VideoSource;
  disciplines: Discipline[];
  priority: number; // Higher = more important
  updateCadence: 'hourly' | 'daily' | 'weekly'; // How often to check for updates
  isActive: boolean;
  lastCheckedAt: Date | null;
  lastVideoAt: Date | null; // Most recent video publish date we've seen
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User preferences for personalization
 */
export interface UserPreferences {
  userId: string;
  followedChannels: string[]; // Channel IDs
  followedTags: string[];
  preferredDisciplines: Discipline[];
  watchHistory: string[]; // Video IDs
  savedVideos: string[]; // Video IDs
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Search filters
 */
export interface SearchFilters {
  disciplines?: Discipline[];
  channels?: string[];
  publishWindow?: {
    start: Date;
    end: Date;
  };
  duration?: {
    min?: number; // seconds
    max?: number; // seconds
  };
  tags?: string[];
  transcriptKeyword?: string;
}

/**
 * Search result with relevance score
 */
export interface SearchResult {
  video: VideoRecord;
  score: number; // Relevance score
  matchedSegments?: TranscriptSegment[]; // If transcript search, show matching segments
  highlight?: string; // Highlighted snippet from title/description
}

/**
 * Video ingestion status
 */
export interface IngestionStatus {
  channelId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videosProcessed: number;
  videosNew: number;
  videosUpdated: number;
  errors: string[];
  startedAt: Date;
  completedAt: Date | null;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

