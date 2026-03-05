import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useCreateAgent } from "../hooks/useAgents";
import type { CreateAgentInput } from "../../../shared/types";
import ErrorAlert from "../../../shared/components/ErrorAlert";
import { parseApiError } from "../../../shared/utils/errors";
import {
  ArrowLeft,
  Radio,
  Link2,
  Type,
  FileText,
  UserCircle,
  Loader2,
} from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  youtube_channel_url: z.string().url("Must be a valid URL"),
  podcast_title: z.string().optional(),
  podcast_description: z.string().optional(),
  podcast_author: z.string().optional(),
});

export default function CreateAgent() {
  const navigate = useNavigate();
  const createAgent = useCreateAgent();
  const [error, setError] = useState<{
    message: string;
    details?: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAgentInput>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: CreateAgentInput) => {
    try {
      setError(null);
      const rss_slug = data.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      const newAgent = await createAgent.mutateAsync({ ...data, rss_slug });
      navigate(`/app/agents/${newAgent.id}`);
    } catch (error: any) {
      setError(parseApiError(error));
    }
  };

  const inputCls =
    "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to="/app/agents"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Channels
        </Link>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Radio className="h-6 w-6 text-orange-500" />
          Create New Channel
        </h1>
        <p className="text-gray-500 mt-1">
          Connect a YouTube channel to start automating podcast creation
        </p>
      </div>

      {error && (
        <ErrorAlert
          title="Failed to create channel"
          message={error.message}
          details={error.details}
          onClose={() => setError(null)}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#141414] rounded-xl border border-white/5 p-6 space-y-5"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Channel Name *
          </label>
          <div className="relative">
            <Radio className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
            <input
              {...register("name")}
              type="text"
              id="name"
              className={inputCls}
              placeholder="e.g., Tech Talk Daily"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-sm mt-1.5">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="youtube_channel_url"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            YouTube Channel URL *
          </label>
          <div className="relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
            <input
              {...register("youtube_channel_url")}
              type="url"
              id="youtube_channel_url"
              className={inputCls}
              placeholder="https://www.youtube.com/@channelname"
            />
          </div>
          {errors.youtube_channel_url && (
            <p className="text-red-400 text-sm mt-1.5">
              {errors.youtube_channel_url.message}
            </p>
          )}
        </div>

        <div className="border-t border-white/5 pt-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Optional Fields
          </p>
        </div>

        <div>
          <label
            htmlFor="podcast_title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Podcast Title
          </label>
          <div className="relative">
            <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
            <input
              {...register("podcast_title")}
              type="text"
              id="podcast_title"
              className={inputCls}
              placeholder="Custom podcast title"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="podcast_description"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Podcast Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
            <textarea
              {...register("podcast_description")}
              id="podcast_description"
              rows={4}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all resize-none"
              placeholder="Describe your podcast"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="podcast_author"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Podcast Author
          </label>
          <div className="relative">
            <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-500" />
            <input
              {...register("podcast_author")}
              type="text"
              id="podcast_author"
              className={inputCls}
              placeholder="Author name"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Channel"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/app/agents")}
            className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl hover:bg-white/10 hover:text-white transition-colors border border-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
