import { useState, useEffect, useMemo } from 'react';
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
    // Stop polling automatically once the job reaches a terminal state
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') return false;
      return 3000;
    },
  });
};

// Cancel backfill mutation
export const useCancelBackfill = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, jobId }: { id: string; jobId: string }) =>
      agentsApi.cancelBackfill(id, jobId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: [...agentKeys.detail(variables.id), 'backfillJobs'] });
      queryClient.invalidateQueries({ queryKey: agentKeys.episodes(variables.id) });
    },
  });
};

// Combined backfill manager hook — REST/React Query only, no SSE.
// Pages call this alongside useBackfillSSE (which provides backfillJobs) and useActiveVideoSSE.
export const useBackfillManager = (agentId: string, backfillJobs: any[] = []) => {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // backfillJobs is provided by the page via useBackfillSSE — no polling needed here
  const startBackfill = useStartBackfill();
  const cancelBackfill = useCancelBackfill();

  // Active job IDs derived from the jobs list
  const activeJobIds = useMemo(() =>
    backfillJobs
      .filter((job: any) => job.status === 'pending' || job.status === 'processing')
      .map((job: any) => job.jobId)
      .filter((id): id is string => !!id),
    [backfillJobs]
  );

  // Flat list of all YouTube video IDs being processed — derived from SSE data, no polling needed
  const allActiveVideoIds = useMemo(() => {
    const ids = backfillJobs
      .filter((job: any) => job.status === 'pending' || job.status === 'processing')
      .flatMap((job: any) => (job.activeVideoIds ?? []) as string[]);
    return [...new Set(ids)];
  }, [backfillJobs]);

  // Poll current job status for the BackfillDialog progress view
  const { data: currentJobStatus } = useBackfillStatus(agentId, currentJobId, !!currentJobId);

  // When the current job completes, refresh episodes and agent data
  useEffect(() => {
    if (currentJobStatus?.status === 'completed') {
      queryClient.invalidateQueries({ queryKey: agentKeys.episodes(agentId) });
      queryClient.invalidateQueries({ queryKey: agentKeys.detail(agentId) });
    }
  }, [currentJobStatus?.status, agentId, queryClient]);

  const handleStartBackfill = async (date: string) => {
    const result = await startBackfill.mutateAsync({ id: agentId, date });
    setCurrentJobId(result.jobId);
    queryClient.invalidateQueries({ queryKey: [...agentKeys.detail(agentId), 'backfillJobs'] });
    return result.jobId;
  };

  const handleCancelBackfill = async (jobId: string) => {
    await cancelBackfill.mutateAsync({ id: agentId, jobId });
  };

  const resetCurrentJob = () => setCurrentJobId(null);

  return {
    backfillJobs,
    activeJobIds,
    currentJobId,
    currentJobStatus,
    allActiveVideoIds,     // Passed to useActiveVideoSSE at the page level
    startBackfill: handleStartBackfill,
    cancelBackfill: handleCancelBackfill,
    isStarting: startBackfill.isPending,
    isCanceling: cancelBackfill.isPending,
    startError: startBackfill.error?.message || null,
    cancelError: cancelBackfill.error?.message || null,
    resetCurrentJob,
  };
};
