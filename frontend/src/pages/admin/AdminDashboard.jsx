import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminAPI, reportsAPI } from '../../services/api.js';

const CHART_COLORS = ['#d97706', '#0f766e', '#1d4ed8', '#7c3aed', '#b45309', '#be123c'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [professionData, setProfessionData] = useState([]);
  const [educatedPerWoreda, setEducatedPerWoreda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [statsResponse, pendingResponse, professionResponse, woredaResponse] = await Promise.all([
        reportsAPI.stats(),
        adminAPI.persons.getAll({ status: 'pending' }),
        reportsAPI.profession(),
        reportsAPI.educatedPerWoreda(),
      ]);

      setStats(statsResponse.data);
      setPendingCount((pendingResponse.data || []).length);
      setProfessionData(professionResponse.data || []);
      setEducatedPerWoreda((woredaResponse.data || []).slice(0, 6));
    } catch (err) {
      console.error('Admin dashboard failed', err);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const statCards = useMemo(() => {
    const current = stats || {};

    return [
      { label: 'Pending approvals', value: pendingCount, accent: 'text-amber-300', surface: 'from-amber-600/30 to-orange-500/10' },
      { label: 'Registered users', value: current.totalUsers || 0, accent: 'text-sky-300', surface: 'from-sky-600/30 to-blue-500/10' },
      { label: 'People records', value: current.totalPersons || 0, accent: 'text-violet-300', surface: 'from-violet-600/30 to-purple-500/10' },
      { label: 'Students', value: current.students || 0, accent: 'text-emerald-300', surface: 'from-emerald-600/30 to-green-500/10' },
      { label: 'Workers', value: current.workers || 0, accent: 'text-cyan-300', surface: 'from-cyan-600/30 to-teal-500/10' },
      { label: 'Unemployed grads', value: current.unemployed || 0, accent: 'text-rose-300', surface: 'from-rose-600/30 to-red-500/10' },
    ];
  }, [pendingCount, stats]);

  const quickActions = useMemo(() => {
    const current = stats || {};
    return [
      {
        title: 'Pending approvals',
        description: 'Review records waiting for an admin decision.',
        path: '/admin/persons',
        tone: 'from-amber-500 to-orange-600',
        value: pendingCount,
      },
      {
        title: 'Users and roles',
        description: 'Create accounts and manage role access safely.',
        path: '/admin/users',
        tone: 'from-sky-500 to-blue-600',
        value: current.totalUsers || 0,
      },
      {
        title: 'Location setup',
        description: 'Maintain woreda and village reference data.',
        path: '/admin/woreda',
        tone: 'from-emerald-500 to-teal-600',
        value: current.totalWoredas || 0,
      },
      {
        title: 'Export center',
        description: 'Download persons, students, and workers CSV files.',
        path: '/admin/export',
        tone: 'from-rose-500 to-pink-600',
        value: current.totalPersons || 0,
      },
    ];
  }, [pendingCount, stats]);

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-stone-800 bg-stone-950 px-8 py-16 text-center text-stone-100 shadow-2xl">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#111827_0%,#292524_60%,#57534e_100%)] text-stone-50 shadow-2xl">
        <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
              Admin command center
            </div>
            <div className="space-y-3">
              <h1 className="admin-auth-title text-4xl text-stone-50 sm:text-5xl">
                Oversight dashboard built for approvals, audits, and fast action.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
                This space is intentionally different from the regular user dashboard. It highlights operational load,
                pending decisions, and the quickest routes into admin work.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/admin/persons"
                className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-950 transition hover:bg-amber-400"
              >
                Review queue
              </Link>
              <Link
                to="/admin/users"
                className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/10"
              >
                Manage users
              </Link>
              <Link
                to="/admin/export"
                className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/10"
              >
                Export data
              </Link>
              <button
                type="button"
                onClick={fetchDashboard}
                className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.slice(0, 4).map((card) => (
              <div
                key={card.label}
                className={`rounded-[1.5rem] border border-white/10 bg-gradient-to-br ${card.surface} p-5 backdrop-blur`}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-stone-300">{card.label}</p>
                <p className={`mt-4 text-4xl font-semibold ${card.accent}`}>{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`mb-5 h-2 rounded-full bg-gradient-to-r ${action.tone}`} />
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-stone-900">{action.title}</h2>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                {action.value}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-600">{action.description}</p>
            <span className="mt-6 inline-flex items-center text-sm font-semibold text-stone-900 transition group-hover:text-amber-700">
              Open section
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Coverage</p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">Educated people by woreda</h2>
            </div>
            <Link to="/admin/reports" className="text-sm font-semibold text-amber-700">
              Open reports
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={educatedPerWoreda}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e7e5e4" />
              <XAxis dataKey="name" stroke="#57534e" tickLine={false} axisLine={false} />
              <YAxis stroke="#57534e" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#f5f5f4' }} />
              <Bar dataKey="total" radius={[12, 12, 0, 0]}>
                {educatedPerWoreda.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Workforce mix</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">Profession distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={professionData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={4}
              >
                {professionData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Education</p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">{stats?.diplomaHolders || 0}</p>
          <p className="mt-2 text-sm text-stone-600">Diploma holders currently registered.</p>
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Higher education</p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">{stats?.degreeHolders || 0}</p>
          <p className="mt-2 text-sm text-stone-600">Degree holders available across the system.</p>
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-400">Postgraduate</p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">{stats?.mastersHolders || 0}</p>
          <p className="mt-2 text-sm text-stone-600">Masters-level records tracked in the database.</p>
        </div>
      </section>
    </div>
  );
}
