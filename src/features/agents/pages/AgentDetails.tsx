import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import {
  useAgent,
  useAgentEpisodes,
  useUploadArtwork,
  useUploadIntro,
  useUploadOutro,
  useDeleteAgent,
  useBackfillManager,
  useUpdateAgent,
} from "../hooks/useAgents";
import { useActiveVideoSSE } from "../hooks/useActiveVideoSSE";
import { useBackfillSSE } from "../hooks/useBackfillSSE";
import FileUpload from "../components/FileUpload";
import RssFeedDisplay from "../components/RssFeedDisplay";
import AgentEditForm from "../components/AgentEditForm";
import SetupChecklist from "../components/SetupChecklist";
import BackfillDialog from "../components/BackfillDialog";
import ProcessingStatus from "../components/ProcessingStatus";
import ConfirmDialog from "../components/ConfirmDialog";
import { AnimatedList } from "@/shared/components/ui/animated-list";
import {
  ArrowLeft,
  Settings,
  FileAudio,
  Radio,
  Rss,
  Calendar,
  Trash2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Loader2,
  FileText,
  CheckCircle2,
} from "lucide-react";

type TabType = "overview" | "media" | "episodes" | "rss";

export default function AgentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <Navigate to="/app/agents" replace />;
  }

  return <AgentDetailsContent id={id} navigate={navigate} />;
}

function AgentDetailsContent({
  id,
  navigate,
}: {
  id: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showBackfill, setShowBackfill] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cancelJobId, setCancelJobId] = useState<string | null>(null);
  const [dismissJobId, setDismissJobId] = useState<string | null>(null);
  const [dismissedFailedIds, setDismissedFailedIds] = useState<Set<string>>(
    new Set(),
  );
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const rssTabRef = useRef<HTMLButtonElement>(null);

  const { data: agent, isLoading, error, refetch } = useAgent(id);
  const { data: episodesData, refetch: refetchEpisodes } = useAgentEpisodes(id);

  // SSE-driven job list — replaces polling entirely
  const { jobs: backfillJobs } = useBackfillSSE(id);
  const backfillManager = useBackfillManager(id, backfillJobs);

  // SSE connections for every actively-processing video — lives at page level per architecture rule
  const sseProgress = useActiveVideoSSE(id, backfillManager.allActiveVideoIds);

  // Build job statuses entirely from SSE data — no REST polling
  const jobStatuses = useMemo(() => {
    const result: Record<string, any> = {};
    for (const job of backfillJobs) {
      result[job.jobId] = {
        ...job,
        activeVideos: (job.activeVideoIds ?? []).map((videoId: string) => {
          const live = sseProgress[videoId];
          return {
            videoId,
            title: job.activeVideoTitles?.[videoId] ?? undefined,
            progress: live?.progress ?? 0,
            status: live?.status ?? "",
            isLive: live?.isConnected ?? false,
          };
        }),
      };
    }
    return result;
  }, [backfillJobs, sseProgress]);

  const uploadArtwork = useUploadArtwork();
  const uploadIntro = useUploadIntro();
  const uploadOutro = useUploadOutro();
  const deleteAgent = useDeleteAgent();
  const updateAgent = useUpdateAgent();

  // Safely extract episodes array from response
  const episodes = Array.isArray(episodesData) ? episodesData : [];

  // Jobs the user should see — dismissed via explicit user action only, no auto-dismiss
  const visibleJobs = useMemo(
    () =>
      backfillJobs.filter((job) => {
        if (job.status === "pending" || job.status === "processing")
          return true;
        if (job.status === "failed") return !dismissedFailedIds.has(job.jobId);
        if (job.status === "completed")
          return !dismissedFailedIds.has(job.jobId);
        return false;
      }),
    [backfillJobs, dismissedFailedIds],
  );

  // Refetch episodes the moment any video completes — SSE-driven, no polling
  const completedCount = useMemo(
    () =>
      backfillJobs.reduce(
        (sum, job) => sum + (job.completedVideos?.length ?? 0),
        0,
      ),
    [backfillJobs],
  );
  useEffect(() => {
    if (completedCount > 0) refetchEpisodes();
  }, [completedCount, refetchEpisodes]);

  // Show pill whenever the RSS tab button is not fully visible in the scroll container
  useEffect(() => {
    const btn = rssTabRef.current;
    if (!btn) return;
    const io = new IntersectionObserver(
      ([entry]) => setCanScrollRight(!entry.isIntersecting),
      { root: tabScrollRef.current, threshold: 1.0 },
    );
    io.observe(btn);
    return () => io.disconnect();
  }, []);

  const handleBackfillSubmit = async (date: string) => {
    await backfillManager.startBackfill(date);
    setShowBackfill(false);
    setActiveTab("episodes");
  };

  const handleCancelBackfill = async (jobId: string) => {
    if (!agent) return;

    try {
      await backfillManager.cancelBackfill(jobId);
      // Refetch to update the UI
      refetch();
      refetchEpisodes();
    } catch (error) {
      console.error("Failed to cancel backfill:", error);
    }
  };

  const handleUpdateAgent = async (data: any) => {
    try {
      await updateAgent.mutateAsync({ id: id, input: data });
    } catch (error) {
      console.error("Failed to update agent:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAgent.mutateAsync(id);
      navigate("/app/agents");
    } catch (error) {
      console.error("Failed to delete channel:", error);
    }
  };

  // Refresh episodes list when job finishes — driven by SSE
  useEffect(() => {
    const job = backfillJobs.find(
      (j) => j.jobId === backfillManager.currentJobId,
    );
    if (job?.status === "completed") {
      refetch();
      refetchEpisodes();
    }
  }, [backfillJobs, backfillManager.currentJobId, refetch, refetchEpisodes]);

  // Debug log
  // (removed — no longer needed)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
        Error: {error.message}
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400">
        Channel not found
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Settings },
    { id: "media", label: "Media", icon: FileAudio },
    { id: "episodes", label: "Episodes", icon: Radio },
    { id: "rss", label: "RSS Feed", icon: Rss },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/app/agents"
          className="inline-flex items-center text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Channels
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
            <p className="text-gray-500 mt-1">
              {agent.podcast_title || "No podcast title set"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {agent.websub_status === "error" && (
              <div className="text-right">
                <div className="text-xs text-red-400 mb-1">
                  YouTube notifications failed
                </div>
                <div className="text-xs text-gray-600">
                  Use Backfill to import videos manually
                </div>
              </div>
            )}
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                agent.websub_status === "subscribed"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : agent.websub_status === "error"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-white/5 text-gray-400 border border-white/10"
              }`}
            >
              {(agent.websub_status || "pending").charAt(0).toUpperCase() +
                (agent.websub_status || "pending").slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Setup Checklist - Shows when setup is incomplete */}
      <SetupChecklist
        agent={agent}
        episodes={episodes}
        onUploadArtwork={() => setActiveTab("media")}
        onViewRssFeed={() => setActiveTab("rss")}
        onGoToBackfill={() => setActiveTab("episodes")}
      />

      {/* Tabs */}
      <div className="relative">
        <div
          ref={tabScrollRef}
          className="border-b border-white/5 overflow-x-auto scrollbar-none"
        >
          <div className="flex gap-8 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  ref={tab.id === "rss" ? rssTabRef : null}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Scroll hint pill — clickable, scrolls to end and activates RSS tab */}
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 pl-8 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent transition-all duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            className="pointer-events-auto flex items-center gap-1 bg-orange-500 hover:bg-orange-400 active:scale-95 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-md shadow-orange-500/20 transition-all duration-150"
            onClick={() => {
              tabScrollRef.current?.scrollTo({
                left: tabScrollRef.current.scrollWidth,
                behavior: "smooth",
              });
              setActiveTab("rss");
            }}
          >
            <Rss className="h-3 w-3" />
            RSS Feed
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-[#141414] rounded-xl border border-white/5 p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-white mb-4">
                Basic Information
              </h2>
              <AgentEditForm
                agent={agent}
                onSubmit={handleUpdateAgent}
                isSubmitting={updateAgent.isPending}
              />
            </div>

            <div className="pt-6 border-t border-white/5">
              <h2 className="text-base font-semibold text-white mb-4">
                Channel Details
              </h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    YouTube Channel
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    <a
                      href={agent.youtube_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400"
                    >
                      {agent.youtube_channel_url}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Channel ID
                  </dt>
                  <dd className="mt-1 text-sm text-white font-mono text-xs bg-white/5 px-2 py-1 rounded-md inline-block">
                    {agent.youtube_channel_id}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(agent.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(agent.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-white/5">
              <h2 className="text-base font-semibold text-red-400 mb-4">
                Danger Zone
              </h2>
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      Delete This Channel
                    </h3>
                    <p className="text-sm text-gray-400">
                      Permanently remove this YouTube channel and all associated
                      episodes, media files, and settings. This action cannot be
                      undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="ml-4 inline-flex items-center px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="space-y-8">
            <FileUpload
              label="Podcast Artwork"
              accept="image/jpeg,image/jpg,image/png"
              currentUrl={agent.podcast_artwork_url}
              onUpload={async (file) => {
                await uploadArtwork.mutateAsync({ id: agent.id, file });
              }}
              maxSize={10}
            />

            <FileUpload
              label="Intro Audio"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a"
              currentUrl={agent.intro_audio_url}
              onUpload={async (file) => {
                await uploadIntro.mutateAsync({ id: agent.id, file });
              }}
              maxSize={50}
            />

            <FileUpload
              label="Outro Audio"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a"
              currentUrl={agent.outro_audio_url}
              onUpload={async (file) => {
                await uploadOutro.mutateAsync({ id: agent.id, file });
              }}
              maxSize={50}
            />
          </div>
        )}

        {activeTab === "episodes" && (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white mb-1">
                  Episodes ({episodes?.length || 0})
                </h2>
                {episodes.length > 0 && (
                  <p className="text-sm text-gray-500">
                    <span className="text-green-400 font-medium">
                      {episodes.filter((ep) => ep.published).length} Published
                    </span>
                    {" • "}
                    <span className="text-gray-500">
                      {episodes.filter((ep) => !ep.published).length} Draft
                    </span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowBackfill(true)}
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-orange-500 text-black text-sm font-semibold rounded-xl hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Import Historical Videos
              </button>
            </div>

            {/* Processing status banners — active jobs + brief completed flash + persistent failed */}
            {visibleJobs.length > 0 && (
              <div className="mb-4 space-y-2">
                <div className="text-sm text-gray-400 font-medium">
                  {backfillManager.activeJobIds.length > 0
                    ? backfillManager.activeJobIds.length === 1
                      ? "Import in progress"
                      : `${backfillManager.activeJobIds.length} imports in progress`
                    : "Import complete"}
                </div>
                <AnimatedList>
                  {visibleJobs.map((job) => (
                    <ProcessingStatus
                      key={job.jobId}
                      status={jobStatuses[job.jobId] ?? null}
                      isLoading={!jobStatuses[job.jobId]}
                      onCancelRequest={
                        job.status === "pending" || job.status === "processing"
                          ? () => setCancelJobId(job.jobId)
                          : undefined
                      }
                      onDismiss={
                        job.status === "failed" || job.status === "completed"
                          ? () => setDismissJobId(job.jobId)
                          : undefined
                      }
                    />
                  ))}
                </AnimatedList>
              </div>
            )}

            {episodes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {backfillJobs.length > 0 ? (
                  <>
                    <p className="text-sm font-medium text-gray-400">
                      Videos are being processed
                    </p>
                    <p className="text-xs mt-1 text-gray-600">
                      Episodes will appear here one by one as each video
                      finishes downloading and transcoding. Large videos may
                      take 30–60 minutes each.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    No episodes yet. Import videos using the button above to get
                    started.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            {episode.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {episode.description}
                          </p>
                        </div>
                        <span
                          className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            episode.published
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          }`}
                        >
                          {episode.published ? (
                            <>
                              <CheckCircle2 className="inline h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <FileText className="inline h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(episode.published_at).toLocaleDateString()}
                        </span>
                        {episode.duration_seconds && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.floor(episode.duration_seconds / 60)} min
                          </span>
                        )}
                        <a
                          href={episode.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-orange-500 hover:text-orange-400"
                        >
                          <ExternalLink className="h-3 w-3" />
                          YouTube
                        </a>
                      </div>
                    </div>
                    {episode.audio_url && (
                      <div className="px-4 pb-4">
                        <audio
                          src={episode.audio_url}
                          controls
                          className="w-full"
                          preload="metadata"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "rss" && <RssFeedDisplay agentId={agent.id} />}
      </div>

      {showBackfill && (
        <BackfillDialog
          onClose={() => {
            setShowBackfill(false);
            backfillManager.resetCurrentJob();
          }}
          onSubmit={handleBackfillSubmit}
          isSubmitting={backfillManager.isStarting}
          submitError={backfillManager.startError}
        />
      )}

      <ConfirmDialog
        isOpen={!!cancelJobId}
        title="Cancel Import?"
        message="This will stop the import and remove all queued videos. Videos already processed will remain."
        confirmLabel="Yes, Cancel Import"
        cancelLabel="Keep Running"
        variant="danger"
        onConfirm={() => {
          handleCancelBackfill(cancelJobId!);
          setCancelJobId(null);
        }}
        onCancel={() => setCancelJobId(null)}
      />

      <ConfirmDialog
        isOpen={!!dismissJobId}
        title="Dismiss import summary?"
        message="This will remove the summary from view. You can always check episode results below."
        confirmLabel="Yes, Dismiss"
        cancelLabel="Keep Visible"
        variant="info"
        onConfirm={() => {
          const job = backfillJobs.find((j) => j.jobId === dismissJobId);
          setDismissedFailedIds((prev) => new Set(prev).add(dismissJobId!));
          if (job?.status === "completed") {
            refetchEpisodes();
            if (dismissJobId === backfillManager.currentJobId)
              backfillManager.resetCurrentJob();
          }
          setDismissJobId(null);
        }}
        onCancel={() => setDismissJobId(null)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141414] rounded-xl border border-white/10 shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Delete Channel?
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">
                  <strong className="text-white">"{agent.name}"</strong> and all
                  associated data will be permanently deleted:
                </p>
                <ul className="text-sm text-gray-400 space-y-1 ml-4 list-disc">
                  <li>All podcast episodes</li>
                  <li>Media files (artwork, intro, outro)</li>
                  <li>RSS feed configuration</li>
                  <li>YouTube subscription</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteAgent.isPending}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteAgent.isPending}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors font-medium disabled:opacity-50"
                >
                  {deleteAgent.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
