import {
  CheckCircle2,
  Circle,
  Image,
  Rss,
  ExternalLink,
  Rocket,
} from "lucide-react";
import type { Agent, Episode } from "../../../shared/types";

interface SetupChecklistProps {
  agent: Agent;
  episodes: Episode[];
  onUploadArtwork: () => void;
  onViewRssFeed: () => void;
  onGoToBackfill: () => void;
}

export default function SetupChecklist({
  agent,
  episodes,
  onUploadArtwork,
  onViewRssFeed,
  onGoToBackfill,
}: SetupChecklistProps) {
  const hasArtwork = !!agent.podcast_artwork_url;
  const hasEpisodes = episodes.length > 0;
  const isComplete = hasArtwork && hasEpisodes;

  if (isComplete) {
    return (
      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              Setup Complete! 🎉
            </h3>
            <p className="text-sm text-gray-400">
              Your channel is configured with artwork and episodes. You can now
              submit your RSS feed to podcast platforms!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
            Complete Your Channel Setup
          </h3>
          <p className="text-sm text-gray-400">
            Follow these steps to get your podcast ready for distribution
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Step 1: Upload Artwork */}
        <div className="bg-white/[0.03] rounded-xl border border-white/5 p-3 sm:p-5 hover:border-white/10 transition-all">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
              {hasArtwork ? (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                </div>
              ) : (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Image className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <h4 className="font-semibold text-white text-sm sm:text-base">
                  Upload Podcast Artwork
                </h4>
                {!hasArtwork && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full whitespace-nowrap">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                Upload a square image (1400x1400px minimum) for your podcast
                cover art. This is required by podcast platforms.
              </p>
              {!hasArtwork && (
                <button
                  onClick={onUploadArtwork}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 text-black text-sm font-semibold rounded-xl hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  Upload Artwork
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Submit to Platforms */}
        <div
          className={`bg-white/[0.03] rounded-xl border p-3 sm:p-5 transition-all ${
            hasArtwork && hasEpisodes
              ? "border-white/5 hover:border-white/10"
              : hasArtwork
                ? "border-yellow-500/20 bg-yellow-500/5"
                : "border-white/5 opacity-60"
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
              {hasEpisodes ? (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                </div>
              ) : (
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Rss className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
                <h4 className="font-semibold text-white text-sm sm:text-base">
                  Submit to Podcast Platforms
                </h4>
                {hasArtwork && !hasEpisodes && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full whitespace-nowrap">
                    Waiting for Episodes
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                {!hasArtwork ? (
                  <p>
                    Upload artwork first, then your RSS feed will be ready to
                    submit to podcast platforms.
                  </p>
                ) : !hasEpisodes ? (
                  <>
                    <p className="mb-3">
                      Import videos using the Backfill feature in the Episodes
                      tab. Once you have episodes, you can submit to platforms.
                    </p>
                    <button
                      onClick={onGoToBackfill}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-black rounded-xl hover:bg-orange-400 transition-colors text-sm font-semibold active:scale-95 shadow-lg shadow-orange-500/20"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Import Videos
                    </button>
                  </>
                ) : (
                  <p>
                    Your RSS feed is ready! Copy the URL and submit it to
                    Spotify, Apple Podcasts, and other platforms.
                  </p>
                )}
              </div>
              {hasArtwork && hasEpisodes && (
                <button
                  onClick={onViewRssFeed}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 text-black text-sm font-semibold rounded-xl hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View RSS Feed & Instructions
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
