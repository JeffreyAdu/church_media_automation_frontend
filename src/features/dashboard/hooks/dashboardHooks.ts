import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../shared/utils/api';

async function fetchDashboardStats() {
  const res = await apiClient.get('/stats/dashboard');
  return res.data;
}

export function useDashboardStats() {
  return useQuery(['dashboardStats'], fetchDashboardStats);
}
