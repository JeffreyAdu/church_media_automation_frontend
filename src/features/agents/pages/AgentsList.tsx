import { Link } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import { Plus, Radio } from 'lucide-react';

export default function AgentsList() {
  const { data: agents, isLoading, error } = useAgents();

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error loading channels: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">YouTube Channels</h1>
          <p className="text-gray-600 mt-1">Manage your YouTube channel automations</p>
        </div>
        <Link
          to="/app/agents/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Channel
        </Link>
      </div>

      {!agents || agents.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Radio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No channels yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first YouTube channel
          </p>
          <Link
            to="/app/agents/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Your First Channel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              to={`/app/agents/${agent.id}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                {agent.podcast_artwork_url ? (
                  <img
                    src={agent.podcast_artwork_url}
                    alt={agent.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Radio className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    agent.websub_status === 'subscribed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {agent.websub_status || 'pending'}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{agent.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {agent.podcast_title || 'No podcast title set'}
              </p>

              <div className="flex items-center text-sm text-gray-500">
                <Radio className="h-4 w-4 mr-1" />
                <span className="truncate">{agent.youtube_channel_id}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
