import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateAgent } from '../hooks/useAgents';
import type { Agent, UpdateAgentInput } from '../../../shared/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  podcast_title: z.string().optional(),
  podcast_description: z.string().optional(),
  podcast_author: z.string().optional(),
});

interface AgentEditFormProps {
  agent: Agent;
}

export default function AgentEditForm({ agent }: AgentEditFormProps) {
  const updateAgent = useUpdateAgent();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateAgentInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: agent.name,
      podcast_title: agent.podcast_title || '',
      podcast_description: agent.podcast_description || '',
      podcast_author: agent.podcast_author || '',
    },
  });

  const onSubmit = async (data: UpdateAgentInput) => {
    try {
      await updateAgent.mutateAsync({ id: agent.id, input: data });
    } catch (error) {
      console.error('Failed to update agent:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Channel Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
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
        />
      </div>

      <button
        type="submit"
        disabled={!isDirty || updateAgent.isPending}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {updateAgent.isPending ? 'Saving...' : 'Save Changes'}
      </button>

      {updateAgent.isSuccess && (
        <p className="text-sm text-green-600">Changes saved successfully!</p>
      )}
      {updateAgent.isError && (
        <p className="text-sm text-red-600">Failed to save changes</p>
      )}
    </form>
  );
}
