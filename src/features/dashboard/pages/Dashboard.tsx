import { useAgents } from '../../agents/hooks/useAgents';
import { Radio, FileAudio } from 'lucide-react';

export default function Dashboard() {
  const { data: agents, isLoading } = useAgents();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalEpisodes = 0; // We'll calculate this later

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your podcast automation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Channels</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{agents?.length || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Radio className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Episodes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalEpisodes}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileAudio className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Agents</h2>
        </div>
        <div className="p-6">
          {!agents || agents.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No agents yet. Create your first agent to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{agent.podcast_title || 'No title set'}</p>
                  </div>
                  <a
                    href={`/agents/${agent.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
