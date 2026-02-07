import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAgent, useAgentEpisodes, useUploadArtwork, useUploadIntro, useUploadOutro, useDeleteAgent } from '../hooks/useAgents';
import FileUpload from '../components/FileUpload';
import RssFeedDisplay from '../components/RssFeedDisplay';
import AgentEditForm from '../components/AgentEditForm';
import SetupChecklist from '../components/SetupChecklist';
import BackfillDialog from '../components/BackfillDialog';
import ProcessingStatus from '../components/ProcessingStatus';
import { ArrowLeft, Settings, FileAudio, Radio, Rss, Calendar, Trash2, AlertTriangle } from 'lucide-react';

type TabType = 'overview' | 'media' | 'episodes' | 'rss';

export default function AgentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showBackfill, setShowBackfill] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeJobIds, setActiveJobIds] = useState<string[]>([]);
  
  const { data: agent, isLoading, error, refetch } = useAgent(id!);
  const { data: episodesData, refetch: refetchEpisodes } = useAgentEpisodes(id!);
  
  // Safely extract episodes array from response
  const episodes = Array.isArray(episodesData) ? episodesData : [];

  // Auto-refresh episodes when there are active jobs
  useEffect(() => {
    if (activeJobIds.length > 0) {
      const interval = setInterval(() => {
        refetchEpisodes();
      }, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [activeJobIds, refetchEpisodes]);

  const handleJobComplete = (jobId: string) => {
    setActiveJobIds((prev) => prev.filter((id) => id !== jobId));
    refetchEpisodes();
  };

  const handleBackfillStart = (jobId: string) => {
    setActiveJobIds((prev) => [...prev, jobId]);
  };
  
  const uploadArtwork = useUploadArtwork();
  const uploadIntro = useUploadIntro();
  const uploadOutro = useUploadOutro();
  const deleteAgent = useDeleteAgent();

  const handleDelete = async () => {
    try {
      await deleteAgent.mutateAsync(id!);
      navigate('/app/agents');
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error.message}
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
        Channel not found
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'media', label: 'Media', icon: FileAudio },
    { id: 'episodes', label: 'Episodes', icon: Radio },
    { id: 'rss', label: 'RSS Feed', icon: Rss },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/app/agents"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Channels
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
            <p className="text-gray-600 mt-1">{agent.podcast_title || 'No podcast title set'}</p>
          </div>
          <div className="flex items-center gap-3">
            {agent.websub_status === 'error' && (
              <div className="text-right">
                <div className="text-xs text-red-600 mb-1">
                  YouTube notifications failed
                </div>
                <div className="text-xs text-gray-500">
                  Use Backfill to import videos manually
                </div>
              </div>
            )}
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                agent.websub_status === 'subscribed'
                  ? 'bg-green-100 text-green-700'
                  : agent.websub_status === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {agent.websub_status || 'pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Setup Checklist - Shows when setup is incomplete */}
      <SetupChecklist 
        agent={agent}
        episodes={episodes}
        onUploadArtwork={() => setActiveTab('media')}
        onViewRssFeed={() => setActiveTab('rss')}
        onGoToBackfill={() => setActiveTab('episodes')}
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <AgentEditForm agent={agent} />
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Channel Details</h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">YouTube Channel</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a
                      href={agent.youtube_channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {agent.youtube_channel_url}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Channel ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{agent.youtube_channel_id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(agent.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(agent.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Delete This Channel
                    </h3>
                    <p className="text-sm text-gray-600">
                      Permanently remove this YouTube channel and all associated episodes, media files, and settings. This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="ml-4 inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
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

        {activeTab === 'episodes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Episodes ({episodes?.length || 0})
              </h2>
              <button
                onClick={() => setShowBackfill(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Import Historical Videos
              </button>
            </div>

            {/* Processing status banners */}
            {activeJobIds.map((jobId) => (
              <ProcessingStatus
                key={jobId}
                agentId={agent.id}
                jobId={jobId}
                onComplete={() => handleJobComplete(jobId)}
              />
            ))}

            {episodes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No episodes yet. Episodes will appear here when videos are processed.
              </div>
            ) : (
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{episode.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{episode.description}</p>
                        </div>
                        <span
                          className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            episode.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {episode.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>📅 {new Date(episode.published_at).toLocaleDateString()}</span>
                        {episode.duration_seconds && (
                          <span>⏱️ {Math.floor(episode.duration_seconds / 60)} min</span>
                        )}
                        <a
                          href={episode.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          🎥 YouTube
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

        {activeTab === 'rss' && <RssFeedDisplay agentId={agent.id} />}
      </div>

      {showBackfill && (
        <BackfillDialog
          agentId={agent.id}
          onClose={() => setShowBackfill(false)}
          onSuccess={(jobId) => {
            setShowBackfill(false);
            handleBackfillStart(jobId);
            refetch();
            refetchEpisodes();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Channel?</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong className="text-gray-900">"{agent.name}"</strong> and all associated data will be permanently deleted:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
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
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteAgent.isPending}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deleteAgent.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
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
