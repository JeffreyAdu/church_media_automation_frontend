import { useQuery } from '@tanstack/react-query';
import { agentsApi } from '../api/agentsApi';

export const useEpisodeCount = () => {
  return useQuery({
    queryKey: ['episodeCount'],
    queryFn: async () => {
      // You may need to call a new endpoint or aggregate episodes from agentsApi
      // For now, let's assume agentsApi.getEpisodeCount exists
      return agentsApi.getEpisodeCount();
    },
  });
};
