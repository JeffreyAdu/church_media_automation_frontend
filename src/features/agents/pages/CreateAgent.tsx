import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCreateAgent } from '../hooks/useAgents';
import type { CreateAgentInput } from '../../../shared/types';
import ErrorAlert from '../../../shared/components/ErrorAlert';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  youtube_channel_url: z.string().url('Must be a valid URL'),
  rss_slug: z.string().min(1, 'RSS slug is required').regex(/^[a-z0-9-]+$/, 'RSS slug must contain only lowercase letters, numbers, and hyphens'),
  podcast_title: z.string().optional(),
  podcast_description: z.string().optional(),
  podcast_author: z.string().optional(),
});

export default function CreateAgent() {
  const navigate = useNavigate();
  const createAgent = useCreateAgent();
  const [error, setError] = useState<{ message: string; details?: string[] } | null>(null);
  
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
      console.log('Submitting agent data:', data);
      const newAgent = await createAgent.mutateAsync(data);
      // Redirect to agent details page to complete setup (artwork, RSS feed)
      navigate(`/app/agents/${newAgent.id}`);
    } catch (error: any) {
      console.error('Failed to create agent:', error);
      console.error('Response data:', error.response?.data);
      console.error('Validation details:', JSON.stringify(error.response?.data?.details, null, 2));
      
      const details = error.response?.data?.details?.map((d: any) => `${d.path}: ${d.message}`);
      setError({
        message: error.response?.data?.error || 'Failed to create channel',
        details
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Channel</h1>
        <p className="text-gray-600 mt-1">
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Channel Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Sunday Sermons"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="youtube_channel_url" className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Channel URL *
          </label>
          <input
            {...register('youtube_channel_url')}
            type="url"
            id="youtube_channel_url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.youtube.com/@channelname"
          />
          {errors.youtube_channel_url && (
            <p className="text-red-600 text-sm mt-1">{errors.youtube_channel_url.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="rss_slug" className="block text-sm font-medium text-gray-700 mb-2">
            RSS Feed Slug *
          </label>
          <input
            {...register('rss_slug')}
            type="text"
            id="rss_slug"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="my-church-podcast"
          />
          <p className="text-gray-500 text-sm mt-1">
            Lowercase letters, numbers, and hyphens only. This will be used in your RSS feed URL.
          </p>
          {errors.rss_slug && (
            <p className="text-red-600 text-sm mt-1">{errors.rss_slug.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="podcast_title" className="block text-sm font-medium text-gray-700 mb-2">
            Podcast Title
          </label>
          <input
            {...register('podcast_title')}
            type="text"
            id="podcast_title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional: Custom podcast title"
          />
        </div>

        <div>
          <label htmlFor="podcast_description" className="block text-sm font-medium text-gray-700 mb-2">
            Podcast Description
          </label>
          <textarea
            {...register('podcast_description')}
            id="podcast_description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional: Describe your podcast"
          />
        </div>

        <div>
          <label htmlFor="podcast_author" className="block text-sm font-medium text-gray-700 mb-2">
            Podcast Author
          </label>
          <input
            {...register('podcast_author')}
            type="text"
            id="podcast_author"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Optional: Author name"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Channel'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/agents')}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
