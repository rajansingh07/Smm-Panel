import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineCurrencyRupee,
  HiOutlineSupport,
  HiOutlineChartBar,
  HiOutlineUserGroup,
} from 'react-icons/hi';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: HiOutlineLightningBolt,
      title: 'Instant Delivery',
      description: 'Get your orders delivered instantly with our automated system.',
    },
    {
      icon: HiOutlineShieldCheck,
      title: 'High Quality',
      description: 'Premium quality services that help grow your social presence.',
    },
    {
      icon: HiOutlineCurrencyRupee,
      title: 'Affordable Prices',
      description: 'Competitive pricing with the best rates in the market.',
    },
    {
      icon: HiOutlineSupport,
      title: '24/7 Support',
      description: 'Round the clock customer support for all your queries.',
    },
    {
      icon: HiOutlineChartBar,
      title: 'Real-time Tracking',
      description: 'Track your orders in real-time with detailed status updates.',
    },
    {
      icon: HiOutlineUserGroup,
      title: 'Trusted by Thousands',
      description: 'Join thousands of satisfied customers growing their presence.',
    },
  ];

  const services = [
    { name: 'Instagram Followers', price: '₹10', per: '1000' },
    { name: 'YouTube Views', price: '₹15', per: '1000' },
    { name: 'Facebook Likes', price: '₹8', per: '1000' },
    { name: 'Twitter Followers', price: '₹12', per: '1000' },
    { name: 'Telegram Members', price: '₹20', per: '1000' },
    { name: 'TikTok Followers', price: '₹14', per: '1000' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">SMM Panel</span>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Grow Your Social Media
            <span className="block text-primary-200">Presence Today</span>
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            The #1 SMM Panel for all your social media marketing needs. 
            Get real followers, likes, views, and more at unbeatable prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? '/new-order' : '/register'}
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Ordering Now
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">50K+</div>
              <div className="text-gray-500 mt-1">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">1M+</div>
              <div className="text-gray-500 mt-1">Orders Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">100+</div>
              <div className="text-gray-500 mt-1">Services Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-500 mt-1">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We provide the best SMM services with instant delivery and 24/7 support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Check out our most popular SMM services with competitive pricing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary-600">
                    {service.price}
                  </span>
                  <span className="text-gray-500 ml-2">/ {service.per}</span>
                </div>
                <Link
                  to={isAuthenticated ? '/new-order' : '/register'}
                  className="mt-4 block text-center bg-primary-50 text-primary-600 py-2 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                >
                  Order Now
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="text-primary-600 font-medium hover:underline"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Social Media?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers and start growing today.
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-white">SMM Panel</span>
              <p className="mt-4">
                Your trusted partner for social media growth and marketing services.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2">
                <li><Link to="/services/instagram" className="hover:text-white transition-colors">Instagram</Link></li>
                <li><Link to="/services/youtube" className="hover:text-white transition-colors">YouTube</Link></li>
                <li><Link to="/services/facebook" className="hover:text-white transition-colors">Facebook</Link></li>
                <li><Link to="/services/twitter" className="hover:text-white transition-colors">Twitter</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 SMM Panel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
