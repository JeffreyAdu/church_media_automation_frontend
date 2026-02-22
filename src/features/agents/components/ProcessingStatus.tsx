import { Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion';
import { AnimatedList } from '@/shared/components/ui/animated-list';
import { cn } from '@/shared/utils/classnames';

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
      isLive?: boolean;
    }>;
    queuedVideos?: Array<{
      videoId: string;
      title?: string;
    }>;
    completedVideos?: Array<{
      videoId: string;
      title?: string;
    }>;
  } | null;
  isLoading?: boolean;
  onCancelRequest?: () => void;
  onDismiss?: () => void;
}

// ── Video row states ────────────────────────────────────────────────────────
type VideoState = 'active' | 'queued' | 'completed-video' | 'failed-video';

interface UnifiedVideo {
  videoId: string;
  title?: string;
  state: VideoState;
  progress?: number;
  statusText?: string;
  isLive?: boolean;
  reason?: string;
}

// ── Per-video row ───────────────────────────────────────────────────────────
function VideoRow({ video }: { video: UnifiedVideo }) {
  const cfg = {
    active: {
      stripe:      'bg-indigo-500',
      icon:        <Loader2 className="h-3.5 w-3.5 text-indigo-500 animate-spin flex-shrink-0" />,
      titleClass:  'text-gray-900',
      barColor:    'bg-indigo-500',
      showPct:     true,
      pctClass:    'text-indigo-600 font-semibold',
    },
    queued: {
      stripe:      'bg-zinc-300',
      icon:        <Clock className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />,
      titleClass:  'text-gray-500',
      barColor:    'bg-zinc-300',
      showPct:     false,
      pctClass:    '',
    },
    'completed-video': {
      stripe:      'bg-green-500',
      icon:        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />,
      titleClass:  'text-gray-500 line-through',
      barColor:    'bg-green-500',
      showPct:     false,
      pctClass:    '',
    },
    'failed-video': {
      stripe:      'bg-red-500',
      icon:        <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />,
      titleClass:  'text-gray-900',
      barColor:    'bg-red-400',
      showPct:     false,
      pctClass:    '',
    },
  }[video.state];

  const pct = video.progress ?? (video.state === 'completed-video' ? 100 : 0);
  const isQueued = video.state === 'queued';

  return (
    <div className="flex gap-0 overflow-hidden rounded-md border border-zinc-100 bg-white shadow-sm">
      {/* Left stripe */}
      <div className={cn('w-1 flex-shrink-0', cfg.stripe)} />

      {/* Content */}
      <div className="flex-1 px-3 py-2.5 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {cfg.icon}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('text-xs truncate hover:underline', cfg.titleClass)}
              title={video.title || video.videoId}
            >
              {video.title || video.videoId}
            </a>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {video.isLive && video.state === 'active' && (
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" title="Live" />
            )}
            {cfg.showPct && (
              <span className={cn('text-xs tabular-nums', cfg.pctClass)}>{pct}%</span>
            )}
            {video.state === 'failed-video' && video.reason && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{video.reason}</Badge>
            )}
          </div>
        </div>

        {/* Progress bar — shimmer pulse for queued, colored fill for active/complete */}
        <div className={cn('w-full h-1 rounded-full bg-zinc-100 overflow-hidden', isQueued && 'animate-pulse')}>
          <div
            className={cn('h-full rounded-full transition-all duration-700', cfg.barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Step label — only shown while actively processing */}
        {video.state === 'active' && video.statusText && (
          <p className="text-[10px] text-zinc-400 leading-none">{video.statusText}</p>
        )}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ProcessingStatus({
  status,
  isLoading,
  onCancelRequest,
  onDismiss,
}: ProcessingStatusProps) {
  // Loading skeleton
  if (isLoading || !status) {
    return (
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            <span className="text-sm text-zinc-500">Loading import status…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Derived values
  const pct             = status.totalVideos > 0 ? Math.round((status.processedVideos / status.totalVideos) * 100) : 0;
  const isActive        = status.status === 'pending' || status.status === 'processing';
  const isCompleted     = status.status === 'completed';
  const isFailed        = status.status === 'failed';
  const hasFailedVideos = (status.failedVideos?.length ?? 0) > 0;

  type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline';

  const cfg: { icon: React.ReactNode; label: string; card: string; badge: BadgeVariant; badgeText: string; barColor: string } = {
    pending: {
      icon:      <Clock className="h-4.5 w-4.5 text-amber-500" />,
      label:     'Queued for Processing',
      card:      'border-amber-100 bg-amber-50/30 shadow-sm',
      badge:     'warning' as BadgeVariant,
      badgeText: 'Pending',
      barColor:  'bg-amber-400',
    },
    processing: {
      icon:      <Loader2 className="h-4.5 w-4.5 text-indigo-500 animate-spin" />,
      label:     'Processing Videos',
      card:      'border-indigo-100 bg-indigo-50/20 shadow-sm',
      badge:     'secondary' as BadgeVariant,
      badgeText: `${status.processedVideos} / ${status.totalVideos}`,
      barColor:  'bg-indigo-500',
    },
    completed: {
      icon:      <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />,
      label:     hasFailedVideos ? 'Queued with errors' : 'All videos queued',
      card:      hasFailedVideos ? 'border-orange-100 bg-orange-50/20 shadow-sm' : 'border-green-100 bg-green-50/20 shadow-sm',
      badge:     (hasFailedVideos ? 'warning' : 'success') as BadgeVariant,
      badgeText: `${status.processedVideos} / ${status.totalVideos} queued`,
      barColor:  'bg-green-500',
    },
    failed: {
      icon:      <XCircle className="h-4.5 w-4.5 text-red-500" />,
      label:     'Import failed',
      card:      'border-red-100 bg-red-50/20 shadow-sm',
      badge:     'destructive' as BadgeVariant,
      badgeText: 'Failed',
      barColor:  'bg-red-500',
    },
  }[status.status];

  // Build unified video list: active → queued → completed → failed
  const failedVideoIds = new Set((status.failedVideos ?? []).map(v => v.videoId));
  const completedVideoIds = new Set((status.completedVideos ?? []).map(v => v.videoId));

  const allVideos: UnifiedVideo[] = [
    // Active / in-flight videos (skip any that are now tracked as completed or failed)
    ...(status.activeVideos ?? []).filter(v => !failedVideoIds.has(v.videoId) && !completedVideoIds.has(v.videoId)).map(v => {
      let state: VideoState;
      if (v.progress >= 100) state = 'completed-video';
      else if (v.progress > 0) state = 'active';
      else                     state = 'queued';
      return {
        videoId:    v.videoId,
        title:      v.title,
        state,
        progress:   v.progress,
        statusText: v.status,
        isLive:     v.isLive,
      };
    }),
    // Still queued (not yet activated)
    ...(status.queuedVideos ?? []).map(v => ({
      videoId: v.videoId,
      title:   v.title,
      state:   'queued' as VideoState,
    })),
    // Successfully completed videos
    ...(status.completedVideos ?? []).map(v => ({
      videoId:  v.videoId,
      title:    v.title,
      state:    'completed-video' as VideoState,
      progress: 100,
    })),
    // Failed videos
    ...(status.failedVideos ?? []).map(v => ({
      videoId: v.videoId,
      title:   v.title,
      state:   'failed-video' as VideoState,
      reason:  v.reason,
    })),
  ];

  const hasVideos = allVideos.length > 0;

  return (
    <Card className={cn('transition-all', cfg.card)}>
      <CardContent className="pt-4 pb-4 space-y-3">

        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 gap-0.5">
            <div className="flex items-center gap-2">
              {cfg.icon}
              <span className="font-semibold text-sm text-zinc-900 truncate">{cfg.label}</span>
            </div>
            {isCompleted && (
              <p className="text-xs text-zinc-400 pl-6 leading-tight">Episodes will appear below as each video finishes processing</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={cfg.badge}>{cfg.badgeText}</Badge>

            {onCancelRequest && isActive && (
              <button
                onClick={onCancelRequest}
                className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Cancel import"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {onDismiss && (isFailed || isCompleted) && (
              <button
                onClick={onDismiss}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Overall progress bar — active jobs only */}
        {isActive && status.totalVideos > 0 && (
          <div className="space-y-1">
            <Progress value={pct} className="h-1.5" indicatorClassName={cfg.barColor} />
            <div className="flex justify-between text-[11px] text-zinc-400 tabular-nums">
              <span>{pct}% complete</span>
              <span>{status.totalVideos - status.processedVideos} remaining</span>
            </div>
          </div>
        )}

        {/* Error banner */}
        {status.error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{status.error}</span>
          </div>
        )}

        {/* Video list — always open by default */}
        {hasVideos && (
          <Accordion type="single" collapsible defaultValue="videos">
            <AccordionItem value="videos">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-xs text-zinc-500">
                  Video details
                  {hasFailedVideos && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                      {status.failedVideos.length} failed
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-h-72 overflow-y-auto scrollbar-thin space-y-0 pr-0.5">
                  <AnimatedList className="gap-1.5">
                    {allVideos.map(video => (
                      <VideoRow key={`${video.videoId}-${video.state}`} video={video} />
                    ))}
                  </AnimatedList>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

      </CardContent>
    </Card>
  );
}
