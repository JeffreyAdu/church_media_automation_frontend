import { Link } from "react-router-dom";
import { useAgents } from "../hooks/useAgents";
import { Plus, Radio } from "lucide-react";

export default function AgentsList() {
  const { data: agents, isLoading, error } = useAgents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">
        Error loading channels: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Radio className="h-6 w-6 text-orange-500" />
            YouTube Channels
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your YouTube channel automations
          </p>
        </div>
        <Link
          to="/app/agents/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Channel</span>
        </Link>
      </div>

      {!agents || agents.length === 0 ? (
        <div className="bg-[#141414] rounded-xl border border-white/5 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Radio className="h-7 w-7 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No channels yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Get started by connecting your first YouTube channel to automate
            podcast creation.
          </p>
          <Link
            to="/app/agents/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Your First Channel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Link
              key={agent.id}
              to={`/app/agents/${agent.id}`}
              className="bg-[#141414] rounded-xl border border-white/5 p-5 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                {agent.podcast_artwork_url ? (
                  <img
                    src={agent.podcast_artwork_url}
                    alt={agent.name}
                    className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <Radio className="h-7 w-7 text-gray-600" />
                  </div>
                )}
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                    agent.websub_status === "subscribed"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-white/5 text-gray-400 border border-white/10"
                  }`}
                >
                  {(agent.websub_status || "pending").charAt(0).toUpperCase() +
                    (agent.websub_status || "pending").slice(1)}
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-orange-400 transition-colors">
                {agent.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {agent.podcast_title || "No podcast title set"}
              </p>

              <div className="flex items-center text-xs text-gray-600">
                <Radio className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate font-mono">
                  {agent.youtube_channel_id}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
