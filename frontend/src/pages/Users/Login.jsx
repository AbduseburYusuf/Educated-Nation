import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import SiteFooter from '../../components/SiteFooter.jsx';

const loginHighlights = [
  'Responsive dashboard experience across phone and desktop',
  'Secure profile access for students, workers, and graduates',
  'Separate admin portal for review, reports, and management',
];

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registeredMessage = location.state?.registered
    ? `Account created for ${location.state?.username || 'your profile'}. Please sign in.`
    : '';

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials.username, credentials.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-shell min-h-screen flex flex-col">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
        <div className="login-grid relative z-10 mx-auto grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] xl:gap-10">
          <section className="auth-hero-panel rounded-[2rem] border border-white/15 bg-[linear-gradient(160deg,rgba(2,6,23,0.94)_0%,rgba(15,23,42,0.92)_55%,rgba(8,47,73,0.88)_100%)] p-6 text-white shadow-2xl backdrop-blur sm:p-8 lg:p-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-cyan-200/35 bg-cyan-200/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-50">
                Welcome Back
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/80">Nation Educated</p>
                <h1 className="login-display max-w-2xl text-4xl leading-tight text-white sm:text-5xl xl:text-6xl">
                  A cleaner, calmer way to return to your records.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-slate-100 sm:text-base">
                  Sign in to manage your profile, review community insights, and continue working from any device.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {loginHighlights.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/14 bg-white/8 p-4 backdrop-blur">
                  <p className="text-sm leading-6 text-slate-50">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-cyan-100/10 bg-slate-950/45 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Need admin access?</p>
              <p className="mt-3 text-sm leading-6 text-slate-100">
                Administrators use a separate secure entry so the regular login stays focused and simple.
              </p>
              <Link
                to="/admin/login"
                className="mt-4 inline-flex rounded-full border border-cyan-200/40 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-200/12"
              >
                Open Admin Portal
              </Link>
            </div>
          </section>

          <section className="flex items-center">
            <div className="auth-form-panel w-full rounded-[2rem] border border-stone-200/90 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
              <div className="mb-8 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-800">Sign In</p>
                <h2 className="login-display text-3xl leading-tight text-stone-900 sm:text-4xl">
                  Access your account
                </h2>
                <p className="text-sm leading-6 text-stone-700">
                  Use your username or email and continue where you left off.
                </p>
              </div>

              {registeredMessage && (
                <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {registeredMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-stone-800">
                    Username or Email
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    placeholder="Enter username or email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-stone-800">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-500 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                    placeholder="Enter password"
                  />
                </div>
                {error && (
                  <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_58%,#22d3ee_100%)] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing In...' : 'Enter Dashboard'}
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-3 text-sm text-stone-700 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  New here?{' '}
                  <Link to="/register" className="font-semibold text-sky-800 transition hover:text-sky-900">
                    Create an account
                  </Link>
                </p>
                <Link to="/about" className="font-semibold text-stone-900 transition hover:text-stone-950">
                  Learn about the community
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      <SiteFooter variant="dark" />
    </div>
  );
}
