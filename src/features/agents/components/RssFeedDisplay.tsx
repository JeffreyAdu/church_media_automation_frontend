import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface RssFeedDisplayProps {
  agentId: string;
}

const platforms = [
  {
    name: 'Spotify for Podcasters',
    url: 'https://podcasters.spotify.com/',
    description: 'Free podcast hosting and analytics from Spotify',
    instructions: 'Sign in → Get Started → Add Your Podcast → Enter RSS Feed URL'
  },
  {
    name: 'Apple Podcasts Connect',
    url: 'https://podcastsconnect.apple.com/',
    description: 'Submit to Apple Podcasts, the largest podcast directory',
    instructions: 'Sign in with Apple ID → Add a Show → Paste RSS Feed URL'
  },
  {
    name: 'Google Podcasts Manager',
    url: 'https://podcastsmanager.google.com/',
    description: 'Publish to Google Podcasts and YouTube Music',
    instructions: 'Sign in → Add a Podcast → Enter RSS Feed → Verify Ownership'
  },
  {
    name: 'Amazon Music',
    url: 'https://podcasters.amazon.com/',
    description: 'Reach Amazon Music and Audible listeners',
    instructions: 'Create Account → Add Podcast → Submit RSS Feed'
  },
];

export default function RssFeedDisplay({ agentId }: RssFeedDisplayProps) {
  const [copied, setCopied] = useState(false);
  const feedUrl = `https://church-media-automation.fly.dev/agents/${agentId}/feed.xml`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Podcast RSS Feed URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={feedUrl}
            readOnly
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          This is your unique RSS feed URL. Copy it and submit to podcast platforms below.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit to Podcast Platforms</h3>
        <div className="space-y-4">
          {platforms.map((platform) => (
            <div key={platform.name} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
                </div>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Submit
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </a>
              </div>
              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Steps:</span> {platform.instructions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">⏱️ Processing Time</h4>
        <p className="text-sm text-amber-700">
          After submitting your RSS feed, it typically takes 24-48 hours for platforms to review and approve your podcast.
          You'll receive email notifications once your podcast is live on each platform.
        </p>
      </div>
    </div>
  );
}
