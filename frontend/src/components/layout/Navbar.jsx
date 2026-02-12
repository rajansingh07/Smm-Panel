import { HiOutlineMenuAlt2, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Menu button */}
        <button
          className="lg:hidden text-gray-600 hover:text-gray-900"
          onClick={onMenuClick}
        >
          <HiOutlineMenuAlt2 className="w-6 h-6" />
        </button>

        {/* Right section */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-900">
            <HiOutlineBell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {/* User avatar */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
