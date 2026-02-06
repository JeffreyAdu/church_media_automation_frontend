import { useState, useEffect, useRef } from 'react';
import { Calendar, Loader2, X, CheckCircle } from 'lucide-react';
import { agentsApi } from '../api/agentsApi';

interface BackfillDialogProps {
  agentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface BackfillStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalVideos: number;
  processedVideos: number;
  enqueuedVideos: number;
  error: string | null;
}

export default function BackfillDialog({ agentId, onClose, onSuccess }: BackfillDialogProps) {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backfillStatus, setBackfillStatus] = useState<BackfillStatus | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Poll for status updates
  const startPolling = (jobId: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const poll = async () => {
      try {
        const status = await agentsApi.getBackfillStatus(agentId, jobId);
        setBackfillStatus(status);

        // Stop polling if completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }

          if (status.status === 'completed') {
            onSuccess();
          } else if (status.error) {
            setError(status.error);
          }
        }
      } catch (err: any) {
        console.error('Failed to poll status:', err);
        // Don't stop polling on transient errors
      }
    };

    // Poll immediately then every 2 seconds
    poll();
    pollIntervalRef.current = setInterval(poll, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await agentsApi.backfillVideos(agentId, date);
      
      // Start polling for status
      setBackfillStatus({
        jobId: result.jobId,
        status: result.status as any,
        totalVideos: 0,
        processedVideos: 0,
        enqueuedVideos: 0,
        error: null,
      });
      
      startPolling(result.jobId);
    } catch (err: any) {
      setError(err.message || 'Failed to start backfill');
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (!backfillStatus || backfillStatus.totalVideos === 0) return 0;
    return Math.round((backfillStatus.processedVideos / backfillStatus.totalVideos) * 100);
  };

  const handleClose = () => {
    if (backfillStatus && (backfillStatus.status === 'pending' || backfillStatus.status === 'processing')) {
      const confirmClose = window.confirm(
        'Backfill is still in progress. It will continue in the background. Close anyway?'
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Import Historical Videos</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!backfillStatus ? (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Import older videos from your YouTube channel that were uploaded before you connected this channel.
              We'll automatically process them into podcast episodes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="since" className="block text-sm font-medium text-gray-700 mb-2">
                  Import videos from this date onwards
                </label>
                <input
                  type="date"
                  id="since"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: Select "January 1, 2024" to import all videos since then
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || !date}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Import Videos
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                💡 <strong>Tip:</strong> This is a one-time import. New videos will be automatically processed going forward.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {/* Status badge */}
            <div className="flex items-center justify-center">
              {backfillStatus.status === 'completed' ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Completed!</span>
                </div>
              ) : backfillStatus.status === 'failed' ? (
                <div className="flex items-center gap-2 text-red-600">
                  <X className="h-5 w-5" />
                  <span className="font-semibold">Failed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-semibold">
                    {backfillStatus.status === 'pending' ? 'Queued...' : 'Processing...'}
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {backfillStatus.totalVideos > 0 && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Scanning videos...</span>
                  <span>{backfillStatus.processedVideos} / {backfillStatus.totalVideos}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{backfillStatus.totalVideos}</div>
                <div className="text-xs text-gray-500">Videos Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{backfillStatus.enqueuedVideos}</div>
                <div className="text-xs text-gray-500">Queued for Processing</div>
              </div>
            </div>

            {/* Error message */}
            {backfillStatus.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {backfillStatus.error}
              </div>
            )}

            {/* Close button */}
            {(backfillStatus.status === 'completed' || backfillStatus.status === 'failed') && (
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            )}

            {/* Background processing message */}
            {(backfillStatus.status === 'pending' || backfillStatus.status === 'processing') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                💡 You can close this dialog. The import will continue in the background and episodes will appear as they're processed.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
