import { Navigate, useParams } from 'react-router-dom';

export function RedirectAgentDetail() {
  const { id } = useParams();
  return <Navigate to={`/app/agents/${id}`} replace />;
}
