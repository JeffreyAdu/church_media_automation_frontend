import { useQuery } from 'react-query';
import axios from 'axios';

async function fetchDashboardStats() {
  const res = await axios.get('/stats/dashboard');
  return res.data;
}

export function useDashboardStats() {
  return useQuery(['dashboardStats'], fetchDashboardStats);
}
