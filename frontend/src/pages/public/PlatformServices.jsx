import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { servicesAPI } from '../../services/api';
import {
  HiOutlineShoppingCart,
  HiArrowLeft,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineClock,
} from 'react-icons/hi';
import { 
  FaInstagram, 
  FaYoutube, 
  FaFacebook, 
  FaTwitter, 
  FaTelegram, 
  FaTiktok,
  FaLinkedin,
  FaSpotify,
  FaDiscord,
  FaTwitch,
} from 'react-icons/fa';

const platformConfig = {
  instagram: {
    name: 'Instagram',
    icon: FaInstagram,
    color: 'from-pink-500 to-purple-600',
    bgColor: 'bg-gradient-to-br from-pink-500 to-purple-600',
    description: 'Boost your Instagram presence with real followers, likes, views, and comments.',
    features: [
      'Real & Active Followers',
      'High-Quality Likes',
      'Video Views & Reels Views',
      'Story Views',
      'Comments & Saves',
    ],
  },
  youtube: {
    name: 'YouTube',
    icon: FaYoutube,
    color: 'from-red-500 to-red-700',
    bgColor: 'bg-gradient-to-br from-red-500 to-red-700',
    description: 'Grow your YouTube channel with subscribers, views, likes, and watch time.',
    features: [
      'Real Subscribers',
      'High Retention Views',
      'Watch Time Hours',
      'Likes & Comments',
      'Live Stream Views',
    ],
  },
  facebook: {
    name: 'Facebook',
    icon: FaFacebook,
    color: 'from-blue-600 to-blue-800',
    bgColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
    description: 'Enhance your Facebook page with followers, likes, and engagement.',
    features: [
      'Page Followers',
      'Post Likes',
      'Video Views',
      'Comments & Shares',
      'Group Members',
    ],
  },
  twitter: {
    name: 'Twitter / X',
    icon: FaTwitter,
    color: 'from-sky-400 to-sky-600',
    bgColor: 'bg-gradient-to-br from-sky-400 to-sky-600',
    description: 'Increase your Twitter presence with followers, retweets, and likes.',
    features: [
      'Real Followers',
      'Retweets',
      'Likes & Favorites',
      'Comments',
      'Impressions',
    ],
  },
  telegram: {
    name: 'Telegram',
    icon: FaTelegram,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-gradient-to-br from-sky-500 to-blue-600',
    description: 'Grow your Telegram channels and groups with real members.',
    features: [
      'Channel Members',
      'Group Members',
      'Post Views',
      'Reactions',
      'Comments',
    ],
  },
  tiktok: {
    name: 'TikTok',
    icon: FaTiktok,
    color: 'from-gray-900 to-gray-700',
    bgColor: 'bg-gradient-to-br from-gray-900 to-gray-700',
    description: 'Boost your TikTok videos with followers, likes, and views.',
    features: [
      'Real Followers',
      'Video Views',
      'Likes & Hearts',
      'Comments',
      'Shares',
    ],
  },
  linkedin: {
    name: 'LinkedIn',
    icon: FaLinkedin,
    color: 'from-blue-700 to-blue-900',
    bgColor: 'bg-gradient-to-br from-blue-700 to-blue-900',
    description: 'Enhance your professional presence on LinkedIn.',
    features: [
      'Followers',
      'Connections',
      'Post Likes',
      'Comments',
      'Shares',
    ],
  },
  spotify: {
    name: 'Spotify',
    icon: FaSpotify,
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-gradient-to-br from-green-500 to-green-700',
    description: 'Grow your Spotify streams and followers.',
    features: [
      'Plays / Streams',
      'Followers',
      'Playlist Adds',
      'Monthly Listeners',
      'Saves',
    ],
  },
  discord: {
    name: 'Discord',
    icon: FaDiscord,
    color: 'from-indigo-500 to-indigo-700',
    bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    description: 'Grow your Discord server with real members.',
    features: [
      'Server Members',
      'Online Members',
      'Server Boosts',
    ],
  },
  twitch: {
    name: 'Twitch',
    icon: FaTwitch,
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-gradient-to-br from-purple-500 to-purple-700',
    description: 'Boost your Twitch channel with followers and viewers.',
    features: [
      'Followers',
      'Live Viewers',
      'Channel Views',
      'Clip Views',
    ],
  },
};

const PlatformServices = () => {
  const { platform } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = platformConfig[platform?.toLowerCase()] || null;

  useEffect(() => {
    if (config) {
      fetchServices();
    } else {
      setLoading(false);
    }
  }, [platform]);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll({ 
        status: 'active',
        category: config.name 
      });
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (serviceId) => {
    if (isAuthenticated) {
      navigate(`/new-order?service=${serviceId}`);
    } else {
      navigate('/register');
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Platform Not Found</h1>
          <Link to="/services" className="text-primary-600 hover:underline">
            View All Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">SMM Panel</Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className={`${config.bgColor} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-white/70 hover:text-white mb-4">
            <HiArrowLeft className="w-5 h-5 mr-2" />
            All Services
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Icon className="w-12 h-12" />
            <h1 className="text-4xl font-bold">{config.name} Services</h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl">
            {config.description}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <HiOutlineLightningBolt className="w-8 h-8 text-yellow-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Instant Start</h3>
            <p className="text-gray-500 text-sm">Orders start within minutes of payment</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <HiOutlineShieldCheck className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">High Quality</h3>
            <p className="text-gray-500 text-sm">Premium quality with real engagement</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <HiOutlineClock className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">24/7 Support</h3>
            <p className="text-gray-500 text-sm">Round the clock customer support</p>
          </div>
        </div>

        {/* Available Services */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Services</h2>
        <p className="text-gray-500 mb-6">Choose from our range of {config.name} services</p>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {config.features.map((feature, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Services List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No {config.name} services available yet.</p>
            <Link to="/services" className="text-primary-600 hover:underline">
              Browse All Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Min: {service.minQuantity}</span>
                      <span>Max: {service.maxQuantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">
                        ₹{service.pricePerUnit}
                      </div>
                      <div className="text-gray-500 text-sm">per 1000</div>
                    </div>
                    <button
                      onClick={() => handleOrder(service._id)}
                      className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                    >
                      <HiOutlineShoppingCart className="w-5 h-5" />
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className={`${config.bgColor} text-white py-12 mt-12`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to grow your {config.name}?</h2>
          <Link
            to={isAuthenticated ? '/new-order' : '/register'}
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 SMM Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PlatformServices;
