import React, { useState } from 'react';
import { useHR } from '../context/HRContext';
import { 
  Users, 
  LayoutDashboard, 
  CalendarDays, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  UserCircle 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useHR();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user?.role === UserRole.ADMIN;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { 
      path: '/employees', 
      label: isAdmin ? 'Employees' : 'My Profile', 
      icon: isAdmin ? <Users size={20} /> : <UserCircle size={20} /> 
    },
    { path: '/leaves', label: 'Leave Management', icon: <CalendarDays size={20} /> },
    { path: '/payroll', label: 'Payroll', icon: <DollarSign size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative z-30 w-64 h-full bg-slate-900 text-white flex flex-col transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
            <div className="bg-blue-600 p-2 rounded-lg">
                <Sparkles size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">HR Central</h1>
                <p className="text-xs text-slate-400">Enterprise Edition</p>
            </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive(item.path) 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {user?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar for Mobile */}
        <header className="bg-white shadow-sm md:hidden flex items-center justify-between p-4 z-10">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
                <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-800">HR Central</h1>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;