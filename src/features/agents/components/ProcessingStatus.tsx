import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { AnimatedList } from "@/shared/components/ui/animated-list";
import { cn } from "@/shared/utils/classnames";

interface ProcessingStatusProps {
  status: {
    jobId: string;
    status: "pending" | "processing" | "completed" | "failed";
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
type VideoState = "active" | "queued" | "completed-video" | "failed-video";

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
      stripe: "bg-orange-500",
      icon: (
        <Loader2 className="h-3.5 w-3.5 text-orange-500 animate-spin flex-shrink-0" />
      ),
      titleClass: "text-white",
      barColor: "bg-orange-500",
      showPct: true,
      pctClass: "text-orange-500 font-semibold",
    },
    queued: {
      stripe: "bg-gray-600",
      icon: <Clock className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />,
      titleClass: "text-gray-500",
      barColor: "bg-gray-600",
      showPct: false,
      pctClass: "",
    },
    "completed-video": {
      stripe: "bg-green-500",
      icon: (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
      ),
      titleClass: "text-gray-500 line-through",
      barColor: "bg-green-500",
      showPct: false,
      pctClass: "",
    },
    "failed-video": {
      stripe: "bg-red-500",
      icon: <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />,
      titleClass: "text-white",
      barColor: "bg-red-400",
      showPct: false,
      pctClass: "",
    },
  }[video.state];

  const pct = video.progress ?? (video.state === "completed-video" ? 100 : 0);
  const isQueued = video.state === "queued";

  return (
    <div className="flex gap-0 overflow-hidden rounded-lg border border-white/5 bg-white/[0.03]">
      {/* Left stripe */}
      <div className={cn("w-1 flex-shrink-0", cfg.stripe)} />

      {/* Content */}
      <div className="flex-1 px-3 py-2.5 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {cfg.icon}
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-xs truncate hover:underline", cfg.titleClass)}
              title={video.title || video.videoId}
            >
              {video.title || video.videoId}
            </a>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {video.isLive && video.state === "active" && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"
                title="Live"
              />
            )}
            {cfg.showPct && (
              <span className={cn("text-xs tabular-nums", cfg.pctClass)}>
                {pct}%
              </span>
            )}
            {video.state === "failed-video" && video.reason && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                {video.reason}
              </Badge>
            )}
          </div>
        </div>

        {/* Progress bar — shimmer pulse for queued, colored fill for active/complete */}
        <div
          className={cn(
            "w-full h-1 rounded-full bg-white/5 overflow-hidden",
            isQueued && "animate-pulse",
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              cfg.barColor,
            )}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Step label — only shown while actively processing */}
        {video.state === "active" && video.statusText && (
          <p className="text-[10px] text-gray-600 leading-none">
            {video.statusText}
          </p>
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
      <Card className="border-white/5 bg-[#141414]">
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
            <span className="text-sm text-gray-500">
              Loading import status…
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Derived values
  const pct =
    status.totalVideos > 0
      ? Math.round((status.processedVideos / status.totalVideos) * 100)
      : 0;
  const isActive =
    status.status === "pending" || status.status === "processing";
  const isCompleted = status.status === "completed";
  const isFailed = status.status === "failed";
  const hasFailedVideos = (status.failedVideos?.length ?? 0) > 0;

  type BadgeVariant =
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "outline";

  const cfg: {
    icon: React.ReactNode;
    label: string;
    card: string;
    badge: BadgeVariant;
    badgeText: string;
    barColor: string;
  } = {
    pending: {
      icon: <Clock className="h-4.5 w-4.5 text-amber-500" />,
      label: "Import scheduled",
      card: "border-amber-500/20 bg-amber-500/5",
      badge: "warning" as BadgeVariant,
      badgeText: "Pending",
      barColor: "bg-amber-400",
    },
    processing: {
      icon: <Loader2 className="h-4.5 w-4.5 text-orange-500 animate-spin" />,
      label: "Scanning & queueing videos",
      card: "border-orange-500/20 bg-orange-500/5",
      badge: "secondary" as BadgeVariant,
      badgeText: `${status.processedVideos} / ${status.totalVideos}`,
      barColor: "bg-orange-500",
    },
    completed: {
      icon: <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />,
      label: hasFailedVideos
        ? "Import complete — some videos failed to enqueue"
        : "Import complete",
      card: hasFailedVideos
        ? "border-orange-500/20 bg-orange-500/5"
        : "border-green-500/20 bg-green-500/5",
      badge: (hasFailedVideos ? "warning" : "success") as BadgeVariant,
      badgeText: `${status.processedVideos} / ${status.totalVideos} enqueued`,
      barColor: "bg-green-500",
    },
    failed: {
      icon: <XCircle className="h-4.5 w-4.5 text-red-500" />,
      label: "Import failed",
      card: "border-red-500/20 bg-red-500/5",
      badge: "destructive" as BadgeVariant,
      badgeText: "Failed",
      barColor: "bg-red-500",
    },
  }[status.status];

  // Build unified video list: active → queued → completed → failed
  const failedVideoIds = new Set(
    (status.failedVideos ?? []).map((v) => v.videoId),
  );
  const completedVideoIds = new Set(
    (status.completedVideos ?? []).map((v) => v.videoId),
  );

  const allVideos: UnifiedVideo[] = [
    // Active / in-flight videos (skip any that are now tracked as completed or failed)
    ...(status.activeVideos ?? [])
      .filter(
        (v) =>
          !failedVideoIds.has(v.videoId) && !completedVideoIds.has(v.videoId),
      )
      .map((v) => {
        const state: VideoState =
          v.progress >= 100 ? "completed-video" : "active";
        return {
          videoId: v.videoId,
          title: v.title,
          state,
          progress: v.progress,
          statusText: v.status || undefined,
          isLive: v.isLive,
        };
      }),
    // Still queued (not yet activated)
    ...(status.queuedVideos ?? []).map((v) => ({
      videoId: v.videoId,
      title: v.title,
      state: "queued" as VideoState,
    })),
    // Successfully completed videos
    ...(status.completedVideos ?? []).map((v) => ({
      videoId: v.videoId,
      title: v.title,
      state: "completed-video" as VideoState,
      progress: 100,
    })),
    // Failed videos
    ...(status.failedVideos ?? []).map((v) => ({
      videoId: v.videoId,
      title: v.title,
      state: "failed-video" as VideoState,
      reason: v.reason,
    })),
  ];

  const hasVideos = allVideos.length > 0;

  return (
    <Card className={cn("transition-all", cfg.card)}>
      <CardContent className="pt-4 pb-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0 gap-0.5">
            <div className="flex items-center gap-2">
              {cfg.icon}
              <span className="font-semibold text-sm text-white truncate">
                {cfg.label}
              </span>
            </div>
            {isCompleted && (
              <p className="text-xs text-gray-500 pl-6 leading-tight">
                Episodes will appear below as each video finishes processing
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={cfg.badge}>{cfg.badgeText}</Badge>

            {onCancelRequest && isActive && (
              <button
                onClick={onCancelRequest}
                className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Cancel import"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {onDismiss && (isFailed || isCompleted) && (
              <button
                onClick={onDismiss}
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
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
            <Progress
              value={pct}
              className="h-1.5"
              indicatorClassName={cfg.barColor}
            />
            <div className="flex justify-between text-[11px] text-gray-500 tabular-nums">
              <span>{pct}% complete</span>
              <span>
                {status.totalVideos - status.processedVideos} remaining
              </span>
            </div>
          </div>
        )}

        {/* Error banner */}
        {status.error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
            <span>{status.error}</span>
          </div>
        )}

        {/* Video list — always open by default */}
        {hasVideos && (
          <Accordion type="single" collapsible defaultValue="videos">
            <AccordionItem value="videos">
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-xs text-gray-500">
                  Video details
                  {hasFailedVideos && (
                    <Badge
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {status.failedVideos.length} failed
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-h-72 overflow-y-auto scrollbar-thin space-y-0 pr-0.5">
                  <AnimatedList className="gap-1.5">
                    {allVideos.map((video) => (
                      <VideoRow
                        key={`${video.videoId}-${video.state}`}
                        video={video}
                      />
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
