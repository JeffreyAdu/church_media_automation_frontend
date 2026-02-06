export interface Agent {
  id: string;
  name: string;
  youtube_channel_id: string;
  youtube_channel_url: string;
  podcast_title?: string;
  podcast_description?: string;
  podcast_author?: string;
  podcast_artwork_url?: string;
  intro_audio_url?: string;
  outro_audio_url?: string;
  websub_status?: string;
  websub_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  agent_id: string;
  youtube_video_id: string;
  youtube_url: string;
  guid: string;
  title: string;
  description?: string;
  audio_url: string;
  audio_size_bytes: number;
  duration_seconds?: number;
  published_at: string;
  is_published: boolean;
  created_at: string;
}

export interface CreateAgentInput {
  name: string;
  youtube_channel_url: string;
  rss_slug: string;
  podcast_title?: string;
  podcast_description?: string;
  podcast_author?: string;
}

export interface UpdateAgentInput {
  name?: string;
  podcast_title?: string;
  podcast_description?: string;
  podcast_author?: string;
}
