import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

const RefundPolicy = () => {
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
          <h1 className="text-4xl font-bold">Refund Policy</h1>
          <p className="text-primary-100 mt-2">Last updated: December 4, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 legal-content">
          <h2>1. Refund Eligibility</h2>
          <p>
            We want you to be satisfied with our services. Refunds may be issued under the 
            following circumstances:
          </p>
          <ul>
            <li>Order not started within 72 hours</li>
            <li>Wrong service delivered</li>
            <li>Duplicate charges</li>
            <li>Technical errors on our end</li>
          </ul>

          <h2>2. Non-Refundable Cases</h2>
          <p>Refunds will NOT be issued for:</p>
          <ul>
            <li>Orders that have already been completed or partially completed</li>
            <li>Drop in followers/likes after delivery (this is normal and expected)</li>
            <li>Account suspension or deletion by the social media platform</li>
            <li>Incorrect link or information provided by the user</li>
            <li>Change of mind after order placement</li>
            <li>Services purchased during promotional offers (unless otherwise stated)</li>
          </ul>

          <h2>3. Partial Refunds</h2>
          <p>
            If an order is partially completed and cannot be fulfilled, a partial refund may be 
            issued for the undelivered portion. The refund amount will be calculated based on 
            the remaining quantity.
          </p>

          <h2>4. Wallet Credits</h2>
          <p>
            In most cases, approved refunds will be credited to your SMM Panel wallet balance 
            rather than the original payment method. Wallet credits can be used for future orders.
          </p>

          <h2>5. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol>
            <li>Log in to your account</li>
            <li>Go to your Order History</li>
            <li>Find the order in question</li>
            <li>Contact our support team with your order ID and reason for refund</li>
          </ol>

          <h2>6. Processing Time</h2>
          <p>
            Refund requests are typically processed within 24-48 business hours. If approved, 
            wallet credits will be added immediately. Bank refunds (if applicable) may take 
            5-7 business days to reflect in your account.
          </p>

          <h2>7. Dispute Resolution</h2>
          <p>
            If you disagree with our refund decision, you may escalate the matter by contacting 
            our support team. We will review your case and provide a final decision within 
            72 hours.
          </p>

          <h2>8. Chargebacks</h2>
          <p>
            Filing a chargeback without first contacting our support team may result in 
            permanent account suspension. We encourage you to reach out to us first to resolve 
            any issues.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For refund requests or questions about this policy, please contact us:
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

export default RefundPolicy;
