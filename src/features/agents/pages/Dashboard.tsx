import { Link } from "react-router-dom";
import { useAgents } from "../hooks/useAgents";
import { useEpisodeCount } from "../hooks/useEpisodeCount";
import {
  Radio,
  FileAudio,
  ArrowRight,
  LayoutDashboard,
  Plus,
  TrendingUp,
  Podcast,
} from "lucide-react";

export default function Dashboard() {
  const { data: agents, isLoading } = useAgents();
  const { data: episodeCount, isLoading: episodeCountLoading } =
    useEpisodeCount();

  if (isLoading || episodeCountLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <LayoutDashboard className="h-6 w-6 text-orange-500" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of your podcast automation
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#141414] p-5 rounded-xl border border-white/5 hover:border-orange-500/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Channels
              </p>
              <p className="text-3xl font-bold text-white mt-1.5">
                {agents?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <Radio className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-white/5 hover:border-green-500/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Episodes
              </p>
              <p className="text-3xl font-bold text-white mt-1.5">
                {episodeCount ?? 0}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <FileAudio className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#141414] p-5 rounded-xl border border-white/5 hover:border-blue-500/20 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Feeds</p>
              <p className="text-3xl font-bold text-white mt-1.5">
                {agents?.filter((a) => a.websub_status === "subscribed")
                  .length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-[#141414] rounded-xl border border-white/5">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Podcast className="h-4.5 w-4.5 text-orange-500" />
            Your Channels
          </h2>
          <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">
            {agents?.length || 0} total
          </span>
        </div>
        <div className="p-4">
          {!agents || agents.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Radio className="h-6 w-6 text-orange-500" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                No channels yet. Create your first channel to get started!
              </p>
              <Link
                to="/app/agents/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-black font-semibold rounded-lg hover:bg-orange-400 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Your First Channel
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {agents.map((agent) => (
                <Link
                  key={agent.id}
                  to={`/app/agents/${agent.id}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 hover:border-orange-500/20 hover:bg-white/[0.02] transition-all group"
                >
                  <div className="min-w-0 flex-1 mr-3 flex items-center gap-3">
                    {agent.podcast_artwork_url ? (
                      <img
                        src={agent.podcast_artwork_url}
                        alt={agent.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Radio className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-medium text-white group-hover:text-orange-400 truncate transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {agent.podcast_title || "No title set"}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm text-orange-500 font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
