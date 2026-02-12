import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary-600">SMM Panel</Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link to="/register" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center text-primary-200 hover:text-white mb-4">
            <HiArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-primary-100 mt-2">Last updated: December 4, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 legal-content">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using SMM Panel, you accept and agree to be bound by the terms and 
            provisions of this agreement. If you do not agree to these terms, please do not use 
            our services.
          </p>

          <h2>2. Description of Services</h2>
          <p>
            SMM Panel provides social media marketing services including but not limited to 
            followers, likes, views, and engagement for various social media platforms. We act 
            as an intermediary between you and third-party service providers.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>As a user of our services, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information when creating an account</li>
            <li>Maintain the security of your account credentials</li>
            <li>Not use our services for any illegal or unauthorized purposes</li>
            <li>Comply with all applicable laws and social media platform terms of service</li>
            <li>Not resell our services without authorization</li>
          </ul>

          <h2>4. Orders and Payments</h2>
          <ul>
            <li>All orders are processed after payment confirmation</li>
            <li>Prices are subject to change without prior notice</li>
            <li>We accept payments through authorized payment gateways only</li>
            <li>Orders cannot be cancelled once processing has begun</li>
          </ul>

          <h2>5. Service Delivery</h2>
          <p>
            We strive to deliver all orders in a timely manner. However, delivery times may vary 
            based on order volume, service type, and third-party provider availability. We do not 
            guarantee specific delivery times unless explicitly stated.
          </p>

          <h2>6. No Guarantee Policy</h2>
          <p>
            While we strive to provide high-quality services, we cannot guarantee:
          </p>
          <ul>
            <li>Permanent retention of followers, likes, or views</li>
            <li>Specific results or outcomes from our services</li>
            <li>That services will meet your specific requirements</li>
            <li>Uninterrupted or error-free service</li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>
            SMM Panel shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use of our services. Our total liability 
            shall not exceed the amount paid for the specific service in question.
          </p>

          <h2>8. Account Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time for violations 
            of these terms, fraudulent activity, or any other reason at our sole discretion.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of our services 
            after changes constitutes acceptance of the modified terms.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            For questions about these Terms of Service, contact us at:
          </p>
          <ul>
            <li>Email: support@smmpanel.com</li>
            <li>Phone: +91 9876543210</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 SMM Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
