import { useEffect, useRef, useState } from 'react';
import { agentsApi } from '../api/agentsApi';

export interface FailedVideoSummary {
  videoId: string;
  title: string;
  reason: string;
}

export interface BackfillJobSummary {
  jobId: string;
  status: string;
  totalVideos: number;
  processedVideos: number;
  enqueuedVideos: number;
  activeVideoIds: string[];
  completedVideos: Array<{ videoId: string; title: string }>;
  queuedVideos: Array<{ videoId: string; title: string }>;
  failedVideos: FailedVideoSummary[];
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UseBackfillSSEResult {
  jobs: BackfillJobSummary[];
  isConnected: boolean;
}

/**
 * Opens a persistent SSE connection to GET /api/agents/:agentId/backfill/stream.
 *
 * Receives:
 *   - { type: "snapshot", jobs: BackfillJobSummary[] } — full initial list
 *   - { type: "jobUpdate", job: Partial<BackfillJobSummary> & { jobId } } — incremental patch
 *
 * Frontend merges incoming jobUpdate messages by jobId, inserting the job at the
 * front of the list if it doesn't exist yet (handles newly created jobs).
 *
 * Returns the job list and a connection flag. No REST polling needed.
 */
export function useBackfillSSE(agentId: string): UseBackfillSSEResult {
  const [jobs, setJobs] = useState<BackfillJobSummary[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!agentId) return;

    const url = agentsApi.getBackfillStreamUrl(agentId);
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => setIsConnected(true);
    es.onerror = () => setIsConnected(false);

    es.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'connected') {
        setIsConnected(true);
      } else if (msg.type === 'snapshot') {
        setJobs(msg.jobs as BackfillJobSummary[]);
      } else if (msg.type === 'jobUpdate') {
        const incoming = msg.job as Partial<BackfillJobSummary> & { jobId: string };
        setJobs((prev) => {
          const idx = prev.findIndex((j) => j.jobId === incoming.jobId);
          if (idx === -1) {
            // New job — prepend to list
            return [incoming as BackfillJobSummary, ...prev];
          }
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...incoming };
          return updated;
        });
      }
    };

    return () => {
      es.close();
      esRef.current = null;
      setIsConnected(false);
    };
  }, [agentId]);

  return { jobs, isConnected };
}
