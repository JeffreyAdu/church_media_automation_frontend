// Dashboard API client
import { apiClient } from '../../../shared/utils/api';

export async function getDashboardStats() {
  const res = await apiClient.get('/stats/dashboard');
  return res.data;
}
