import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login, logout, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const adminDestination = (() => {
    const fromPath = location.state?.from?.pathname;
    if (typeof fromPath === 'string' && fromPath.startsWith('/admin') && fromPath !== '/admin/login') {
      return fromPath;
    }
    return '/admin/dashboard';
  })();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const useDemoAdmin = () => {
    setCredentials({ username: 'admin', password: 'password123' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials.username, credentials.password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.user?.role !== 'admin') {
      logout();
      setError('This portal is reserved for administrators.');
      setLoading(false);
      return;
    }

    navigate(adminDestination, { replace: true });
    setLoading(false);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-100">Loading admin portal...</div>;
  }

  if (user?.role === 'admin') {
    return <Navigate to={adminDestination} replace />;
  }

  return (
    <div className="admin-auth-shell min-h-screen overflow-hidden flex flex-col">
      <div className="admin-auth-grid" />
      <div className="relative z-10 flex-1 px-6 py-10 lg:px-10">
        <div className="mx-auto grid min-h-full max-w-6xl items-stretch gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col justify-between rounded-[2rem] border border-stone-700/60 bg-stone-950/80 p-8 text-stone-100 shadow-2xl backdrop-blur sm:p-10">
            <div className="space-y-8">
              <div className="inline-flex w-fit items-center rounded-full border border-amber-400/40 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Administrative Access
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-400">Nation Educated Console</p>
                <h1 className="admin-auth-title max-w-xl text-5xl leading-tight text-stone-50 sm:text-6xl">
                  Separate control room for approvals, reporting, and data management.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                  This entry is intentionally different from the public user login. It is designed for administrators who
                  review records, manage lookup data, and export reports.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Review</p>
                <p className="mt-2 text-sm text-stone-200">Approve or reject records with a protected admin session.</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Oversight</p>
                <p className="mt-2 text-sm text-stone-200">Track users, students, workers, and area-level reporting in one place.</p>
              </div>
              <div className="rounded-2xl border border-stone-800 bg-stone-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Export</p>
                <p className="mt-2 text-sm text-stone-200">Download structured data when you need a quick operational snapshot.</p>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="w-full rounded-[2rem] border border-stone-200 bg-white/90 p-8 shadow-2xl backdrop-blur sm:p-10">
              <div className="mb-8 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Restricted Sign-In</p>
                <h2 className="admin-auth-title text-4xl leading-tight text-stone-900">Admin Portal</h2>
                <p className="text-sm leading-6 text-stone-600">
                  Sign in with an administrator account to enter the control panel.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">Demo admin credentials</p>
                      <p className="mt-1 text-amber-800">Username: <span className="font-semibold">admin</span>  Password: <span className="font-semibold">password123</span></p>
                    </div>
                    <button
                      type="button"
                      onClick={useDemoAdmin}
                      className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-amber-700"
                    >
                      Use Demo Admin
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-700">Username or Email</span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    placeholder="admin"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-700">Password</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    placeholder="Enter password"
                  />
                </label>

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-stone-950 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Authorizing...' : 'Enter Admin Portal'}
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-3 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
                <Link to="/login" className="font-medium text-stone-900 underline decoration-amber-500 underline-offset-4">
                  Regular user login
                </Link>
                <Link to="/" className="font-medium text-amber-700">
                  Return to main site
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="relative z-10">
        <SiteFooter variant="dark" />
      </div>
    </div>
  );
}
