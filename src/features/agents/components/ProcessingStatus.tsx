import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface ProcessingStatusProps {
  status: {
    jobId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    totalVideos: number;
    processedVideos: number;
    enqueuedVideos: number;
    error: string | null;
    failedVideos: Array<{
      videoId: string;
      title: string;
      reason: string;
    }>;
    activeVideos?: Array<{
      videoId: string;
      title?: string;
      progress: number;
      status: string;
    }>;
  } | null;
  isLoading?: boolean;
  onCancel?: (jobId: string) => void;
}

export default function ProcessingStatus({ status, isLoading, onCancel }: ProcessingStatusProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (isLoading || !status) {
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

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (onCancel && status) {
      onCancel(status.jobId);
    }
    setShowCancelConfirm(false);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Cancel Import?"
        message="This will stop the import process and remove all queued videos. Videos that have already been processed will remain. This action cannot be undone."
        confirmLabel="Yes, Cancel Import"
        cancelLabel="Keep Running"
        variant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <div className={`border rounded-lg p-6 mb-4 ${getStatusColor()}`}>
        {/* Header with icon and status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className={`font-semibold ${getTextColor()}`}>
                {getStatusText()}
              </h3>
              {status.totalVideos > 0 && status.status === 'processing' && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {status.activeVideos?.length || 0} videos processing now...
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {status.totalVideos > 0 && (
              <div className="text-right">
                <div className={`text-2xl font-bold ${getTextColor()}`}>
                  {status.processedVideos}<span className="text-lg text-gray-500">/{status.totalVideos}</span>
                </div>
                <div className="text-xs text-gray-600">completed</div>
              </div>
            )}
            {/* Cancel button - only show for pending/processing */}
            {onCancel && (status.status === 'pending' || status.status === 'processing') && (
              <button
                onClick={handleCancelClick}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel import"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {status.totalVideos > 0 && status.status !== 'completed' && (
        <div className="mb-4">
          <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-600">
            <span>{getProgressPercentage()}% complete</span>
            <span>{status.totalVideos - status.processedVideos} remaining</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {status.error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          <strong>Error:</strong> {status.error}
        </div>
      )}

      {/* Helpful message */}
      {status.status === 'processing' && status.totalVideos > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          💡 New episodes will appear below as they complete. Videos take 5-15 minutes each to process.
        </p>
      )}

      {/* Details section (collapsible) */}
      {((status.activeVideos?.length ?? 0) > 0 || (status.failedVideos?.length ?? 0) > 0) && (
        <div className="mt-4 border-t border-gray-300 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>
              {showDetails ? 'Hide' : 'Show'} processing details
              {status.failedVideos?.length > 0 && ` (${status.failedVideos.length} failed)`}
            </span>
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3">
              {/* Active videos */}
              {status.activeVideos && status.activeVideos.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-2">
                    ⏳ Currently Processing:
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {status.activeVideos.map((video) => (
                      <div key={video.videoId} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <a
                            href={`https://www.youtube.com/watch?v=${video.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline font-medium truncate max-w-sm"
                            title={video.title || video.videoId}
                          >
                            {video.title || video.videoId}
                          </a>
                          <span className="text-xs font-semibold text-blue-600">{video.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                          <div
                            className="h-1.5 bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${video.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">{video.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Failed videos */}
              {status.failedVideos && status.failedVideos.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-red-700 mb-2">
                    ⚠️ Failed Videos ({status.failedVideos.length}):
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {status.failedVideos.map((video) => (
                      <div key={video.videoId} className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-3">
                            <a
                              href={`https://www.youtube.com/watch?v=${video.videoId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline block truncate"
                            >
                              {video.title}
                            </a>
                            <div className="text-xs text-gray-500 font-mono mt-1">{video.videoId}</div>
                          </div>
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded whitespace-nowrap">
                            {video.reason}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
}
