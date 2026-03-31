import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user || user.role !== 'admin') {
    return <div className="text-center py-12"><h1 className="text-2xl text-red-600">Admin access required</h1></div>;
  }

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/persons', label: 'Persons', icon: '👤' },
    { path: '/admin/students', label: 'Students', icon: '🎓' },
    { path: '/admin/workers', label: 'Workers', icon: '💼' },
    { path: '/admin/unemployed', label: 'Unemployed', icon: '🎓' },
    { path: '/admin/woreda', label: 'Woreda', icon: '🏘️' },
    { path: '/admin/village', label: 'Village', icon: '🏘️' },
    { path: '/admin/professions', label: 'Professions', icon: '⚙️' },
    { path: '/admin/organizations', label: 'Organizations', icon: '🏢' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
    { path: '/admin/export', label: 'Export Data', icon: '📥' },
  ];

  const navItemClass = (path) =>
    `flex items-center rounded-2xl px-4 py-3 transition-colors ${
      location.pathname === path ? 'bg-blue-500 font-semibold text-white' : 'text-blue-50 hover:bg-blue-500/70'
    }`;

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <aside className="hidden w-72 shrink-0 bg-blue-600 text-white shadow-lg lg:flex lg:flex-col">
        <div className="border-b border-blue-500 p-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-blue-200">{user.username}</p>
        </div>
        <nav className="mt-6 flex-1 space-y-2 px-4 pb-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={navItemClass(item.path)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 pb-6">
          <button
            onClick={logout}
            className="w-full rounded-2xl bg-red-500 px-4 py-3 text-white font-medium transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex min-w-0 flex-col overflow-hidden">
        <div className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Admin</p>
              <h1 className="text-lg font-bold text-stone-900">Control Panel</h1>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-b border-stone-200 bg-blue-600 px-4 py-4 text-white shadow-lg lg:hidden">
            <div className="mb-4">
              <p className="text-sm font-medium text-blue-100">{user.username}</p>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={navItemClass(item.path)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="mt-2 w-full rounded-2xl bg-red-500 px-4 py-3 text-left font-medium transition hover:bg-red-600"
              >
                Logout
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:p-6">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
