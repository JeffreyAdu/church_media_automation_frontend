import { useState, useEffect, useRef } from 'react';
import { agentsApi } from '../api/agentsApi';

export interface VideoSSEProgress {
  progress: number;
  status: string;
  isConnected: boolean;
}

/**
 * Manages real-time SSE connections for multiple active video processing jobs.
 *
 * Opens one EventSource per active video; closes connections for videos that
 * leave the active list. All state lives here — components receive plain data.
 *
 * BullMQ job ID convention: `${agentId}_${youtubeVideoId}`
 *
 * @param agentId  Agent whose videos are being processed
 * @param videoIds YouTube video IDs currently active (changes as REST poll updates)
 * @returns  Map of youtubeVideoId → { progress, status, isConnected }
 */
export function useActiveVideoSSE(
  agentId: string,
  videoIds: string[]
): Record<string, VideoSSEProgress> {
  const [sseData, setSseData] = useState<Record<string, VideoSSEProgress>>({});
  const connectionsRef = useRef<Map<string, EventSource>>(new Map());

  // Stable string key so the effect only re-runs when the set of IDs actually changes
  const videoIdsKey = [...videoIds].sort().join(',');

  useEffect(() => {
    if (!agentId) return;

    const currentIds = new Set(videoIds);

    // ── Close connections for videos that are no longer active ──────────────
    for (const [vid, es] of connectionsRef.current) {
      if (!currentIds.has(vid)) {
        es.close();
        connectionsRef.current.delete(vid);
        setSseData(prev => {
          const next = { ...prev };
          delete next[vid];
          return next;
        });
      }
    }

    // ── Open connections for newly active videos ─────────────────────────────
    for (const videoId of videoIds) {
      if (connectionsRef.current.has(videoId)) continue; // already connected

      const url = agentsApi.getVideoProgressStreamUrl(agentId, videoId);
      const es = new EventSource(url);

      es.onopen = () => {
        setSseData(prev => ({
          ...prev,
          [videoId]: { ...(prev[videoId] ?? { progress: 0, status: '' }), isConnected: true },
        }));
      };

      es.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data as string);

          if (data.type === 'progress') {
            setSseData(prev => ({
              ...prev,
              [videoId]: {
                progress: typeof data.progress === 'number' ? data.progress : (prev[videoId]?.progress ?? 0),
                status: typeof data.status === 'string' ? data.status : (prev[videoId]?.status ?? ''),
                isConnected: true,
              },
            }));
          } else if (data.type === 'complete') {
            setSseData(prev => ({
              ...prev,
              [videoId]: { progress: 100, status: 'Complete!', isConnected: false },
            }));
            es.close();
            connectionsRef.current.delete(videoId);
          } else if (data.type === 'error' && data.message !== 'Job not found') {
            setSseData(prev => ({
              ...prev,
              [videoId]: { ...(prev[videoId] ?? { progress: 0, status: '' }), isConnected: false },
            }));
            es.close();
            connectionsRef.current.delete(videoId);
          }
        } catch {
          // Malformed frame — ignore
        }
      };

      es.onerror = () => {
        // EventSource auto-reconnects — just mark as temporarily disconnected
        setSseData(prev =>
          prev[videoId]
            ? { ...prev, [videoId]: { ...prev[videoId], isConnected: false } }
            : prev
        );
      };

      connectionsRef.current.set(videoId, es);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, videoIdsKey]);

  // Close everything on unmount
  useEffect(() => {
    return () => {
      connectionsRef.current.forEach(es => es.close());
      connectionsRef.current.clear();
    };
  }, []);

  return sseData;
}
