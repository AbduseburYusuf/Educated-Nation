import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../services/api.js';
import SiteFooter from '../../components/SiteFooter.jsx';

const registerHighlights = [
  'Fast signup flow that works cleanly on mobile and desktop',
  'Personal account space for profile records, reports, and updates',
  'Separate admin portal kept outside the regular user experience',
];

export default function Register() {
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        username: credentials.username.trim(),
        email: credentials.email.trim(),
        password: credentials.password,
      };

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw data;
      }

      navigate('/login', {
        state: {
          registered: true,
          username: payload.username,
        },
      });
    } catch (err) {
      console.error('Register error:', err);
      let errorMsg = 'Registration failed';
      if (err) {
        if (err.error) {
          errorMsg = err.error;
        } else if (err.errors) {
          errorMsg = err.errors.map((e) => e.msg).join(', ');
        } else {
          errorMsg = JSON.stringify(err);
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-shell min-h-screen flex flex-col">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="register-orb register-orb-one" />
        <div className="register-orb register-orb-two" />
        <div className="register-grid relative z-10 mx-auto grid w-full max-w-6xl items-stretch gap-6 lg:grid-cols-[1fr_1.02fr] xl:gap-10">
          <section className="auth-hero-panel rounded-[2rem] border border-white/15 bg-[linear-gradient(160deg,rgba(2,44,34,0.95)_0%,rgba(6,78,59,0.92)_56%,rgba(15,118,110,0.88)_100%)] p-6 text-white shadow-2xl backdrop-blur sm:p-8 lg:p-10">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-emerald-200/40 bg-emerald-200/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-50">
                Create Account
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-100/85">Nation Educated</p>
                <h1 className="register-display max-w-2xl text-4xl leading-tight text-white sm:text-5xl xl:text-6xl">
                  Join with a profile setup that already feels ready for real use.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
                  Create your account once, then continue on phone or desktop to manage records,
                  update your profile, and track community progress with confidence.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {registerHighlights.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/14 bg-white/8 p-4 backdrop-blur">
                  <p className="text-sm leading-6 text-emerald-50">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-emerald-100/12 bg-emerald-950/35 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">Account setup notes</p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-emerald-50">
                <p>Use a memorable username with at least 3 characters.</p>
                <p>Use an active email address so your account stays easy to recover later.</p>
                <p>Your password must be at least 6 characters long.</p>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <div className="auth-form-panel w-full rounded-[2rem] border border-stone-200/90 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
              <div className="mb-8 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-800">Register</p>
                <h2 className="register-display text-3xl leading-tight text-stone-900 sm:text-4xl">
                  Start your account
                </h2>
                <p className="text-sm leading-6 text-stone-700">
                  Fill in the details below and we&apos;ll take you straight to sign in when your account is ready.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-stone-800">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    minLength="3"
                    autoComplete="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Choose a username"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-stone-800">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter your email"
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
                    minLength="6"
                    autoComplete="new-password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3.5 text-stone-950 shadow-sm outline-none transition placeholder:text-stone-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Create a password"
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
                  className="w-full rounded-2xl bg-[linear-gradient(135deg,#022c22_0%,#047857_56%,#14b8a6_100%)] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-3 text-sm text-stone-700 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-emerald-800 transition hover:text-emerald-900">
                    Sign in
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
