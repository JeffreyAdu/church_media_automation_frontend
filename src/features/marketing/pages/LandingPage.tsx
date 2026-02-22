import { Link } from 'react-router-dom';
import { ArrowRight, Youtube, Podcast, Rss, Sparkles, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header/Nav */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <Podcast className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Podcast<span className="text-blue-600">Flow</span>
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-8">
              <Sparkles className="h-4 w-4" />
              Automate Your YouTube-to-Podcast Workflow
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Turn YouTube Videos
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Into Podcasts Automatically
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect your YouTube channel once and let us handle the rest. 
              We automatically convert new videos into podcast episodes and distribute them 
              to Spotify, Apple Podcasts, Google Podcasts, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-md font-semibold text-lg"
              >
                See How It Works
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Simple Steps to Podcast Distribution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Set up once, publish everywhere, automatically
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                1
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 h-full">
                <Youtube className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Connect YouTube
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Link your YouTube channel in seconds. We'll automatically 
                  detect new video uploads and start processing them.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                2
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 h-full">
                <Sparkles className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Automatic Processing
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We extract audio, add your custom intro/outro, optimize for podcasts, 
                  and generate episode metadata automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                3
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 h-full">
                <Rss className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Publish Everywhere
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your podcast feed updates automatically. Submit to Spotify, Apple Podcasts, 
                  Google, and Amazon with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional podcast features for content creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Custom Branding',
                description: 'Add your logo and custom intro/outro audio to every episode'
              },
              {
                title: 'RSS Feed',
                description: 'Professional podcast feed compatible with all major platforms'
              },
              {
                title: 'Auto-Processing',
                description: 'Videos are converted to optimized audio automatically'
              },
              {
                title: 'Historical Import',
                description: 'Backfill your entire video archive with one click'
              },
              {
                title: 'Episode Management',
                description: 'Edit titles, descriptions, and publish settings anytime'
              },
              {
                title: 'Analytics',
                description: 'Track downloads and listener engagement (coming soon)'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Expand Your Reach?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join creators using automation to grow their audience through podcasts
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-colors shadow-xl font-semibold text-lg"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Podcast className="h-6 w-6 text-blue-500" />
              <span className="text-white font-semibold">PodcastFlow</span>
            </div>
            <div className="text-sm">
              © {new Date().getFullYear()} PodcastFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
