import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCreditCard,
  HiOutlineShoppingCart,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineUsers,
  HiOutlineViewGrid,
  HiOutlineCash,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const userMenuItems = [
    { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
    { path: '/new-order', icon: HiOutlineShoppingCart, label: 'New Order' },
    { path: '/orders', icon: HiOutlineClipboardList, label: 'Order History' },
    { path: '/my-services', icon: HiOutlineCollection, label: 'Services' },
    { path: '/add-funds', icon: HiOutlineCreditCard, label: 'Add Funds' },
    { path: '/profile', icon: HiOutlineUser, label: 'Profile' },
  ];

  const adminMenuItems = [
    { path: '/admin', icon: HiOutlineViewGrid, label: 'Dashboard' },
    { path: '/admin/orders', icon: HiOutlineClipboardList, label: 'All Orders' },
    { path: '/admin/services', icon: HiOutlineCollection, label: 'Manage Services' },
    { path: '/admin/users', icon: HiOutlineUsers, label: 'Manage Users' },
    { path: '/admin/add-funds', icon: HiOutlineCash, label: 'Add Funds' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark-200 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold">SMM Panel</span>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-700">
          <p className="text-sm text-gray-400">Welcome,</p>
          <p className="font-semibold truncate">{user?.name}</p>
          {!isAdmin && (
            <p className="text-sm text-primary-400 mt-1">
              Balance: ₹{user?.walletBalance?.toFixed(2) || '0.00'}
            </p>
          )}
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-dark-100 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Switch role / Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          {isAdmin && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-dark-100 hover:text-white rounded-lg transition-colors mb-2"
            >
              <HiOutlineUser className="w-5 h-5" />
              <span>User Panel</span>
            </Link>
          )}
          {user?.role === 'admin' && !isAdmin && (
            <Link
              to="/admin"
              className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-dark-100 hover:text-white rounded-lg transition-colors mb-2"
            >
              <HiOutlineCog className="w-5 h-5" />
              <span>Admin Panel</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
