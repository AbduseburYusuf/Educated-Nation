import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { reportsAPI } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const COLORS = ['#b45309', '#0f766e', '#1d4ed8', '#be123c', '#7c3aed', '#ea580c'];

const heritageCards = [
  {
    title: 'History',
    description:
      'The Argoba community has deep roots in east-central Ethiopia, with long-standing connections to areas linked to southeastern Wollo and northeastern Shewa.',
  },
  {
    title: 'Community',
    description:
      'Shared customs, local memory, faith, and social values continue to shape community identity across generations.',
  },
  {
    title: 'Language',
    description:
      'Argobba is an endangered Ethio-Semitic language and remains an important part of cultural continuity, even in multilingual households.',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const statsResponse = await reportsAPI.stats();
      setStats(statsResponse.data);
    } catch (err) {
      console.error('Stats failed', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[1.75rem] bg-white p-8 text-center shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  const professionData = stats.professionData || [];
  const degreeData = stats.degreeData || [];
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers || 0, tone: 'text-amber-700' },
    { label: 'Total Persons', value: stats.totalPersons || 0, tone: 'text-orange-700' },
    { label: 'Students', value: stats.students || 0, tone: 'text-emerald-700' },
    { label: 'Workers', value: stats.workers || 0, tone: 'text-sky-700' },
    { label: 'Unemployed', value: stats.unemployed || 0, tone: 'text-rose-700' },
    { label: 'Diploma Holders', value: stats.diplomaHolders || 0, tone: 'text-violet-700' },
    { label: 'Degree Holders', value: stats.degreeHolders || 0, tone: 'text-cyan-700' },
    { label: 'Masters Holders', value: stats.mastersHolders || 0, tone: 'text-pink-700' },
    { label: 'Woredas', value: stats.totalWoredas || 0, tone: 'text-yellow-700' },
    { label: 'Villages', value: stats.totalVillages || 0, tone: 'text-lime-700' },
  ];

  const quickLinks = [
    {
      title: 'Profile',
      description: 'Review or update your personal record and education information.',
      to: '/profile',
      label: 'Open Profile',
    },
    {
      title: 'Add Person',
      description: 'Register a new person record for student, worker, or graduate data.',
      to: '/add-person',
      label: 'Add Record',
    },
    {
      title: 'Students',
      description: 'Browse the current student listing and education-related records.',
      to: '/students',
      label: 'View Students',
    },
    {
      title: 'Workers',
      description: 'Check worker records and employment-related updates.',
      to: '/workers',
      label: 'View Workers',
    },
    {
      title: 'Reports',
      description: 'Explore summary reports for education and community progress.',
      to: '/reports',
      label: 'Open Reports',
    },
  ];

  if (user.role === 'admin') {
    quickLinks.push({
      title: 'Admin',
      description: 'Open the admin workspace for management tasks and approvals.',
      to: '/admin/dashboard',
      label: 'Open Admin',
    });
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-950 via-amber-900 to-orange-700 px-6 py-10 text-white shadow-xl sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">
              Home
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to the Argoba community dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-amber-50/90 sm:text-lg">
              Use this space to manage education records, keep your profile current, and see a
              concise overview of Argoba history and community identity.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition-transform hover:-translate-y-0.5"
              >
                About the Community
              </Link>
              <Link
                to="/profile"
                className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Go to Profile
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-200">Overview</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-amber-100/80">Community records</p>
                <p className="text-3xl font-bold">{stats.totalPersons || 0}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-amber-100/80">Students</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.students || 0}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <p className="text-amber-100/80">Workers</p>
                  <p className="mt-1 text-2xl font-semibold">{stats.workers || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">About</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            Overview of Argoba history and community
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600 sm:text-base">
            The dashboard highlights the Argoba community as a living heritage rooted in local
            history, language, and shared social life. It connects today&apos;s education records to a
            broader community story rather than treating the data as isolated numbers.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {heritageCards.map((card) => (
              <div key={card.title} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                <h3 className="text-lg font-semibold text-stone-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{card.description}</p>
              </div>
            ))}
          </div>
          <Link
            to="/about"
            className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Read the full About page
          </Link>
        </article>

        <aside className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            Profile
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            Keep your information complete and current
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-700 sm:text-base">
            Your profile is the center of your participation in the system. Update your personal
            record, add new education details, and keep your status ready for reporting.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              to="/profile"
              className="block rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-stone-900 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Open My Profile
            </Link>
            <Link
              to="/add-person"
              className="block rounded-2xl border border-stone-300 px-5 py-4 text-sm font-semibold text-stone-700 transition-colors hover:bg-white"
            >
              Add a New Person Record
            </Link>
          </div>
        </aside>
      </section>

      {user.role === 'admin' && (
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                Home
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">Quick actions</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-stone-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                <Link
                  to={item.to}
                  className="mt-5 inline-flex rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
                >
                  {item.label}
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {user.role === 'admin' && (
        <section>
          <div className="mb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Overview
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">Community statistics</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {statCards.map((card) => (
              <div key={card.label} className="rounded-[1.5rem] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">
                  {card.label}
                </h3>
                <div className={`mt-3 text-3xl font-bold ${card.tone}`}>{card.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold tracking-tight text-stone-900">
            Profession distribution
          </h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={professionData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                >
                  {professionData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold tracking-tight text-stone-900">
            Degrees per woreda
          </h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={degreeData}
                  dataKey="count"
                  nameKey="woreda_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                >
                  {degreeData.map((entry, index) => (
                    <Cell
                      key={`${entry.woreda_name}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
