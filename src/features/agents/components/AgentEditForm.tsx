import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Agent, UpdateAgentInput } from "../../../shared/types";

const schema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  podcast_title: z.string().optional(),
  podcast_description: z.string().optional(),
  podcast_author: z.string().optional(),
});

interface AgentEditFormProps {
  agent: Agent;
  onSubmit: (data: UpdateAgentInput) => Promise<void>;
  isSubmitting?: boolean;
}

export default function AgentEditForm({
  agent,
  onSubmit,
  isSubmitting,
}: AgentEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateAgentInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: agent.name,
      podcast_title: agent.podcast_title || "",
      podcast_description: agent.podcast_description || "",
      podcast_author: agent.podcast_author || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Channel Name *
        </label>
        <input
          {...register("name")}
          type="text"
          id="name"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="podcast_title"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Podcast Title
        </label>
        <input
          {...register("podcast_title")}
          type="text"
          id="podcast_title"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="podcast_description"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Podcast Description
        </label>
        <textarea
          {...register("podcast_description")}
          id="podcast_description"
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
        />
      </div>

      <div>
        <label
          htmlFor="podcast_author"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Podcast Author
        </label>
        <input
          {...register("podcast_author")}
          type="text"
          id="podcast_author"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={!isDirty || isSubmitting}
        className="px-5 py-2.5 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
