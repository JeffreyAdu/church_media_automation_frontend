import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface RssFeedDisplayProps {
  agentId: string;
}

const platforms = [
  {
    name: "Spotify for Creators",
    url: "https://creators.spotify.com/",
    description:
      "The world's most popular audio streaming platform with millions of active podcast listeners. Includes built-in analytics, monetization tools, and video podcast support.",
    steps: [
      "Go to creators.spotify.com and click 'Get Started'",
      "Sign in with your Spotify account or create a new one",
      "Select 'I want to add my podcast to Spotify'",
      "Paste your RSS feed URL and click 'Next'",
      "Review your podcast details and confirm ownership",
      "Your podcast will typically appear on Spotify within a few hours",
    ],
  },
  {
    name: "Apple Podcasts Connect",
    url: "https://podcastsconnect.apple.com/",
    description:
      "Apple Podcasts is one of the largest podcast directories in the world. Being listed here also makes your podcast discoverable on Overcast and many other apps that pull from Apple's catalog.",
    steps: [
      "Go to podcastsconnect.apple.com and sign in with your Apple ID",
      "Click the '+' button and select 'New Show'",
      "Paste your RSS feed URL in the provided field",
      "Apple will validate your feed — fix any errors if flagged",
      "Click 'Submit' to send your podcast for review",
      "Review typically takes 1–5 business days. You'll receive an email once approved",
    ],
  },
  {
    name: "Amazon Music / Audible",
    url: "https://podcasters.amazon.com/",
    description:
      "Distribute your podcast to Amazon Music and Audible listeners worldwide. Includes analytics to track how your audience engages with your episodes over time.",
    steps: [
      "Go to podcasters.amazon.com and click 'Add or Claim Your Podcast'",
      "Sign in with your Amazon account or create one",
      "Paste your RSS feed URL and click 'Submit'",
      "Amazon will send a verification email to the address in your RSS feed",
      "Click the verification link in the email to confirm ownership",
      "Your podcast will be available on Amazon Music and Audible once approved",
    ],
  },
  {
    name: "YouTube Music",
    url: "https://studio.youtube.com/",
    description:
      "YouTube Music now hosts podcasts (including content migrated from the discontinued Google Podcasts). Submit your RSS feed via YouTube Studio to reach YouTube's massive audience.",
    steps: [
      "Go to studio.youtube.com and sign in with your Google account",
      "Click 'Settings' (gear icon) in the left sidebar",
      "Navigate to Channel → General and find the Podcasts section",
      "Click 'Submit RSS feed' and paste your RSS feed URL",
      "Verify ownership of your podcast feed",
      "Episodes will be published as YouTube videos automatically",
    ],
  },
  {
    name: "iHeartRadio",
    url: "https://podcasters.iheart.com/",
    description:
      "The world's largest podcast network, available on 250+ platforms and 2,000+ connected devices including smart speakers, cars, tablets, and gaming consoles. Available in the US, Canada, Mexico, Australia, and New Zealand.",
    steps: [
      "Go to podcasters.iheart.com and click 'Submit Your Podcast'",
      "Log in or sign up for a free iHeartRadio account",
      "Enter your RSS feed URL in the submission form",
      "Review your podcast details and accept the content policy",
      "Click 'Submit' to send your podcast for review",
      "Once approved, your podcast will be available on the iHeartRadio app and website",
    ],
  },
  {
    name: "Overcast",
    url: "https://overcast.fm/add",
    description:
      "A popular iOS podcast player known for its Smart Speed and Voice Boost features. Overcast automatically pulls from the Apple Podcasts directory, but you can also add feeds manually.",
    steps: [
      "First, make sure your podcast is submitted to Apple Podcasts (see above)",
      "Your podcast will automatically appear in Overcast within 1–2 days",
      "If it doesn't appear, go to overcast.fm/add",
      "Paste your RSS feed URL and click 'Add'",
      "Listeners can also subscribe directly by entering your feed URL in the app",
    ],
  },
  {
    name: "Pocket Casts",
    url: "https://pocketcasts.com/submit/",
    description:
      "A cross-platform podcast player by Automattic (WordPress) with a loyal user base. Supports both public and private RSS feeds with robust search and discovery features.",
    steps: [
      "Go to pocketcasts.com/submit",
      "Paste your RSS feed URL or Apple Podcasts link in the input field",
      "Choose 'Public' for discoverability in search, or 'Private' for member-only feeds",
      "Click 'Submit' to add your podcast",
      "It can take up to 12 hours for your podcast to be indexed by Pocket Casts' search",
    ],
  },
  {
    name: "Podcast Addict",
    url: "https://podcastaddict.com/submit",
    description:
      "One of the leading podcast apps on Android with millions of daily users. Features robust search, popular podcast lists, and personalized recommendations.",
    steps: [
      "Go to podcastaddict.com/submit",
      "Enter your RSS feed URL in the submission form",
      "Make sure your feed is valid and up-to-date before submitting",
      "Click 'Submit' to send your podcast for review",
      "Review takes up to 24 hours before your podcast is indexed",
      "Once approved, your podcast will be discoverable by millions of Android users",
    ],
  },
  {
    name: "Castbox",
    url: "https://castbox.fm/podcasters",
    description:
      "A free podcast app available on iOS, Android, and web with over 95 million volumes of content. Features in-app comments, AI-powered recommendations, and creator tools.",
    steps: [
      "Go to castbox.fm and click 'Creator' in the navigation menu",
      "Sign in with your Castbox account or create a new one",
      "Click 'Import Podcast' and paste your RSS feed URL",
      "Review your podcast information and confirm the details",
      "Click 'Submit' to add your podcast to Castbox",
      "Your podcast will be available in the Castbox app and web player once indexed",
    ],
  },
  {
    name: "Pandora / SiriusXM",
    url: "https://amp.pandora.com/",
    description:
      "Pandora, now part of SiriusXM, offers podcast distribution to millions of listeners across both platforms. Reach listeners on connected cars, smart speakers, and mobile devices.",
    steps: [
      "Go to amp.pandora.com to access the creator portal",
      "Sign in or create a Pandora for Podcasters account",
      "Click 'Add a Podcast' and paste your RSS feed URL",
      "Provide your podcast details and agree to the terms of service",
      "Submit your podcast for review",
      "Once approved, your podcast will be available on both Pandora and SiriusXM",
    ],
  },
  {
    name: "Podcast Index",
    url: "https://podcastindex.org/add",
    description:
      "An open, free podcast directory that powers many independent podcast apps (like Fountain, Castamatic, and Podfriend). Adding your feed here maximizes your reach across the open podcast ecosystem.",
    steps: [
      "Go to podcastindex.org/add",
      "Paste your RSS feed URL in the input field",
      "Click 'Add' to submit your feed to the index",
      "No account or sign-up required — it's completely open",
      "Your podcast will be available to all apps that use the Podcast Index API",
    ],
  },
  {
    name: "Google Podcasts (Discontinued)",
    url: "https://music.youtube.com/",
    description:
      "Google Podcasts was shut down in April 2024. All podcast content has been migrated to YouTube Music. If you previously had a show on Google Podcasts, submit your RSS feed to YouTube Music instead.",
    steps: [
      "Google Podcasts is no longer available as a standalone platform",
      "Your existing listeners have been migrated to YouTube Music",
      "Submit your RSS feed to YouTube Music (see above) to continue reaching Google users",
    ],
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Your Podcast RSS Feed URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={feedUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-mono text-white"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-3 bg-orange-500 text-black font-semibold rounded-xl hover:bg-orange-400 transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20"
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
        <p className="mt-2 text-sm text-gray-500">
          This is your unique RSS feed URL. Copy it and submit to podcast
          platforms below.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-4">
          Submit to Podcast Platforms
        </h3>
        <div className="space-y-3">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">{platform.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {platform.description}
                  </p>
                </div>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center px-3 py-1.5 text-sm font-medium text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-xl hover:bg-orange-500/15 transition-colors"
                >
                  Submit
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </a>
              </div>
              <div className="mt-3 pl-4 border-l-2 border-white/10">
                <p className="text-xs font-medium text-gray-300 mb-2">Steps:</p>
                <ol className="space-y-1.5">
                  {platform.steps.map((step, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-orange-500/70 font-medium text-xs mt-0.5 flex-shrink-0">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-400 mb-2">
          ⏱️ Processing Time
        </h4>
        <p className="text-sm text-amber-400/70">
          After submitting your RSS feed, it typically takes 24-48 hours for
          platforms to review and approve your podcast. You'll receive email
          notifications once your podcast is live on each platform.
        </p>
      </div>
    </div>
  );
}
