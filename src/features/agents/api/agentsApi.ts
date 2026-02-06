import { apiClient } from '../../../shared/utils/api';
import type { Agent, CreateAgentInput, UpdateAgentInput, Episode } from '../../../shared/types';

export const agentsApi = {
  // Get all agents
  getAgents: async (): Promise<Agent[]> => {
    const { data } = await apiClient.get('/agents');
    return data;
  },

  // Get single agent
  getAgent: async (id: string): Promise<Agent> => {
    const { data } = await apiClient.get(`/agents/${id}`);
    return data;
  },

  // Create agent
  createAgent: async (input: CreateAgentInput): Promise<Agent> => {
    const { data } = await apiClient.post('/agents', input);
    return data;
  },

  // Update agent
  updateAgent: async (id: string, input: UpdateAgentInput): Promise<Agent> => {
    const { data } = await apiClient.put(`/agents/${id}`, input);
    return data;
  },

  // Delete agent
  deleteAgent: async (id: string): Promise<void> => {
    await apiClient.delete(`/agents/${id}`);
  },

  // Get agent episodes
  getAgentEpisodes: async (id: string): Promise<Episode[]> => {
    const { data} = await apiClient.get(`/agents/${id}/episodes`);
    return data;
  },

  // Get RSS feed URL
  getFeedUrl: async (id: string): Promise<{ feedUrl: string }> => {
    const { data } = await apiClient.get(`/agents/${id}/feed-url`);
    return data;
  },

  // Upload artwork
  uploadArtwork: async (id: string, file: File): Promise<{ podcast_artwork_url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await apiClient.post(`/agents/${id}/artwork`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Delete artwork
  deleteArtwork: async (id: string): Promise<void> => {
    await apiClient.delete(`/agents/${id}/artwork`);
  },

  // Upload intro
  uploadIntro: async (id: string, file: File): Promise<{ intro_audio_url: string }> => {
    const formData = new FormData();
    formData.append('audio', file);
    const { data } = await apiClient.post(`/agents/${id}/intro`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Delete intro
  deleteIntro: async (id: string): Promise<void> => {
    await apiClient.delete(`/agents/${id}/intro`);
  },

  // Upload outro
  uploadOutro: async (id: string, file: File): Promise<{ outro_audio_url: string }> => {
    const formData = new FormData();
    formData.append('audio', file);
    const { data } = await apiClient.post(`/agents/${id}/outro`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // Delete outro
  deleteOutro: async (id: string): Promise<void> => {
    await apiClient.delete(`/agents/${id}/outro`);
  },

  // Activate WebSub
  activateAgent: async (id: string): Promise<void> => {
    await apiClient.post(`/agents/${id}/activate`);
  },

  // Backfill videos
  backfillVideos: async (id: string, since: string): Promise<{ jobId: string; status: string }> => {
    const { data } = await apiClient.post(`/agents/${id}/backfill`, { since });
    return data;
  },

  // Get backfill job status
  getBackfillStatus: async (id: string, jobId: string): Promise<{
    jobId: string;
    status: string;
    totalVideos: number;
    processedVideos: number;
    enqueuedVideos: number;
    error: string | null;
    createdAt: string;
    updatedAt: string;
  }> => {
    const { data } = await apiClient.get(`/agents/${id}/backfill/${jobId}`);
    return data;
  },
};
