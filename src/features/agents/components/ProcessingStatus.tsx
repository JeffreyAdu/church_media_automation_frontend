import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { agentsApi } from '../api/agentsApi';

interface ProcessingStatusProps {
  agentId: string;
  jobId: string;
  onComplete: () => void;
}

interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalVideos: number;
  processedVideos: number;
  enqueuedVideos: number;
  error: string | null;
}

export default function ProcessingStatus({ agentId, jobId, onComplete }: ProcessingStatusProps) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const result = await agentsApi.getBackfillStatus(agentId, jobId);
        const newStatus: JobStatus = {
          jobId: result.jobId,
          status: result.status as any,
          totalVideos: result.totalVideos,
          processedVideos: result.processedVideos,
          enqueuedVideos: result.enqueuedVideos,
          error: result.error || null,
        };
        
        setStatus(newStatus);

        if (result.status === 'completed' || result.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (result.status === 'completed') {
            onComplete();
          }
        }
      } catch (err) {
        console.error('Failed to poll job status:', err);
      }
    };

    poll();
    pollIntervalRef.current = setInterval(poll, 3000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [agentId, jobId, onComplete]);

  if (!status) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-800">Loading status...</span>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    if (status.totalVideos === 0) return 0;
    return Math.round((status.processedVideos / status.totalVideos) * 100);
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'completed':
        return 'Processing Complete';
      case 'failed':
        return 'Processing Failed';
      case 'pending':
        return 'Queued for Processing';
      default:
        return 'Processing Videos';
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (status.status) {
      case 'completed':
        return 'text-green-800';
      case 'failed':
        return 'text-red-800';
      case 'pending':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <span className={`font-semibold ${getTextColor()}`}>
            {getStatusText()}
          </span>
        </div>
        {status.totalVideos > 0 && (
          <span className={`text-sm ${getTextColor()}`}>
            {status.processedVideos} / {status.totalVideos}
          </span>
        )}
      </div>

      {status.totalVideos > 0 && status.status !== 'completed' && (
        <div className="mb-3">
          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-blue-600 transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className={`text-lg font-bold ${getTextColor()}`}>{status.totalVideos}</div>
          <div className="text-xs text-gray-600">Found</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${getTextColor()}`}>{status.enqueuedVideos}</div>
          <div className="text-xs text-gray-600">Queued</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${getTextColor()}`}>{status.processedVideos}</div>
          <div className="text-xs text-gray-600">Processed</div>
        </div>
      </div>

      {status.error && (
        <div className="mt-3 text-sm text-red-700 bg-red-100 rounded p-2">
          {status.error}
        </div>
      )}

      {status.status === 'processing' && (
        <p className="mt-3 text-xs text-gray-600">
          💡 Episodes will appear below as they finish processing. This may take a few minutes per video.
        </p>
      )}
    </div>
  );
}
