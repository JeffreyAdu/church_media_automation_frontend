import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsApi } from '../api/agentsApi';
import type { CreateAgentInput, UpdateAgentInput } from '../../../shared/types';

// Query keys
export const agentKeys = {
  all: ['agents'] as const,
  lists: () => [...agentKeys.all, 'list'] as const,
  list: (filters: string) => [...agentKeys.lists(), { filters }] as const,
  details: () => [...agentKeys.all, 'detail'] as const,
  detail: (id: string) => [...agentKeys.details(), id] as const,
  episodes: (id: string) => [...agentKeys.detail(id), 'episodes'] as const,
};

// Get all agents
export const useAgents = () => {
  return useQuery({
    queryKey: agentKeys.lists(),
    queryFn: agentsApi.getAgents,
  });
};

// Get single agent
export const useAgent = (id: string) => {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => agentsApi.getAgent(id),
    enabled: !!id,
  });
};

// Get agent episodes
export const useAgentEpisodes = (id: string) => {
  return useQuery({
    queryKey: agentKeys.episodes(id),
    queryFn: () => agentsApi.getAgentEpisodes(id),
    enabled: !!id,
  });
};

// Create agent mutation
export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: CreateAgentInput) => agentsApi.createAgent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
};

// Update agent mutation
export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAgentInput }) =>
      agentsApi.updateAgent(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
};

// Delete agent mutation
export const useDeleteAgent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => agentsApi.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
  });
};

// Upload artwork mutation
export const useUploadArtwork = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      agentsApi.uploadArtwork(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
    },
  });
};

// Upload intro mutation
export const useUploadIntro = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      agentsApi.uploadIntro(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
    },
  });
};

// Upload outro mutation
export const useUploadOutro = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      agentsApi.uploadOutro(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
    },
  });
};

// Get backfill jobs
export const useBackfillJobs = (id: string) => {
  return useQuery({
    queryKey: [...agentKeys.detail(id), 'backfillJobs'],
    queryFn: () => agentsApi.getAgentBackfillJobs(id),
    enabled: !!id,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });
};

// Start backfill mutation
export const useStartBackfill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      agentsApi.backfillVideos(id, date),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...agentKeys.detail(variables.id), 'backfillJobs'] });
    },
  });
};

// Get backfill status
export const useBackfillStatus = (agentId: string, jobId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...agentKeys.detail(agentId), 'backfillStatus', jobId],
    queryFn: () => agentsApi.getBackfillStatus(agentId, jobId!),
    enabled: !!agentId && !!jobId && enabled,
    refetchInterval: 2000, // Poll every 2 seconds
  });
};
