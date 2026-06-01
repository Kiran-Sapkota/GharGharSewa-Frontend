import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { 
  HiOutlineHome, 
  HiOutlineSearch, 
  HiOutlineChatAlt2, 
  HiOutlineCalendar, 
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { authUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = {
    user: [
      { name: 'Home', path: '/', icon: HiOutlineHome },
      { name: 'Services', path: '/search', icon: HiOutlineSearch },
      { name: 'AI Chat', path: '/chatbot', icon: HiOutlineChatAlt2 },
      { name: 'Bookings', path: '/bookings', icon: HiOutlineCalendar },
      { name: 'Profile', path: '/profile', icon: HiOutlineUserCircle },
    ],
    provider: [
      { name: 'Overview', path: '/provider-dashboard', icon: HiOutlineChartBar },
      { name: 'Profile', path: '/profile', icon: HiOutlineUserCircle },
    ],
    admin: [
      { name: 'Control Panel', path: '/admin-dashboard', icon: HiOutlineShieldCheck },
      { name: 'Profile', path: '/profile', icon: HiOutlineUserCircle },
    ]
  };

  const currentLinks = navLinks[authUser?.role] || [];

  const LinkItem = ({ link, onClick }) => {
    const isActive = location.pathname === link.path;
    return (
      <Link
        to={link.path}
        onClick={onClick}
        className={`flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group relative ${
          isActive 
            ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-500 dark:hover:text-emerald-400'
        }`}
      >
        <link.icon size={24} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
        <span className="font-bold tracking-tight">{link.name}</span>
        {isActive && (
          <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50 border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between">
        <h1 className="text-xl font-black text-emerald-500 uppercase tracking-tighter">GGS.</h1>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 active:scale-90 transition-transform"
        >
          {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt2 size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-50 dark:border-slate-800/50 w-80 z-40 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-3xl' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full p-8 pt-10 lg:pt-8">
          <div className="mb-12 px-2 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                Ghar<span className="text-emerald-500">Ghar</span>
              </h1>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mt-1">Sewa Platform</p>
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-all duration-300 active:rotate-45"
            >
              {isDarkMode ? <HiOutlineSun size={22} /> : <HiOutlineMoon size={22} />}
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {currentLinks.map((link) => (
              <LinkItem key={link.path} link={link} onClick={() => setIsOpen(false)} />
            ))}
          </nav>

          <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl mb-4">
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase mb-2">Connected as</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                  {authUser?.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{authUser?.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate uppercase">{authUser?.role}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 font-bold group"
            >
              <HiOutlineLogout size={24} className="group-hover:-translate-x-1 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
