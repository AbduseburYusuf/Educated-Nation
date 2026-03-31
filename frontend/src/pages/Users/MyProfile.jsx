import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import PersonForm from '../../components/PersonForm.jsx';
import { personsAPI } from '../../services/api.js';
import api from '../../services/api.js';
import { Link } from 'react-router-dom';

const TYPE_LABELS = {
  student: 'Student',
  worker: 'Worker',
  unemployed_graduate: 'Unemployed Graduate',
};

const STATUS_STYLES = {
  approved: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-rose-100 text-rose-800',
};

const TYPE_GUIDANCE = {
  student: {
    title: 'Education track',
    note: 'Keep school, field, and level details current so your learning record stays clear in reports.',
  },
  worker: {
    title: 'Work track',
    note: 'A complete profession and department record makes workforce reporting more reliable.',
  },
  unemployed_graduate: {
    title: 'Graduate track',
    note: 'Graduation details help the platform reflect current support and follow-up needs.',
  },
};

const formatDate = (value) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCompletionSummary = (person) => {
  if (!person) {
    return {
      percent: 0,
      filled: 0,
      total: 0,
      label: 'Not started',
      tone: 'bg-stone-200 text-stone-700',
    };
  }

  const baseFields = [
    person.name,
    person.gender,
    person.birth_date,
    person.phone,
    person.national_id,
    person.type,
    person.woreda_name || person.woreda_id,
    person.village_name || person.village_id,
  ];

  let detailFields = [];
  if (person.type === 'student') {
    detailFields = [
      person.student?.level,
      person.student?.grade_or_year,
      person.student?.field_of_study,
      person.student?.institution_name,
    ];
  } else if (person.type === 'worker') {
    detailFields = [
      person.worker?.profession?.name || person.worker?.profession_id,
      person.worker?.department,
      person.worker?.field_of_study,
      person.worker?.organization?.name || person.worker?.organization_id,
      person.worker?.education_level?.name || person.worker?.education_level_id,
    ];
  } else if (person.type === 'unemployed_graduate') {
    detailFields = [
      person.unemployed?.field_of_study,
      person.unemployed?.graduation_year,
      person.unemployed?.education_level?.name || person.unemployed?.education_level_id,
    ];
  }

  const total = baseFields.length + detailFields.length;
  const filled = [...baseFields, ...detailFields].filter(Boolean).length;
  const percent = total ? Math.round((filled / total) * 100) : 0;

  if (percent >= 85) {
    return { percent, filled, total, label: 'Strong', tone: 'bg-emerald-100 text-emerald-800' };
  }

  if (percent >= 60) {
    return { percent, filled, total, label: 'Good', tone: 'bg-sky-100 text-sky-800' };
  }

  return { percent, filled, total, label: 'Needs work', tone: 'bg-amber-100 text-amber-800' };
};

const getDetailRows = (person) => {
  if (!person) return [];

  if (person.type === 'student') {
    return [
      { label: 'Level', value: person.student?.level || 'Not set' },
      { label: 'Grade or Year', value: person.student?.grade_or_year || 'Not set' },
      { label: 'Field of Study', value: person.student?.field_of_study || 'Not set' },
      { label: 'Institution', value: person.student?.institution_name || 'Not set' },
    ];
  }

  if (person.type === 'worker') {
    return [
      { label: 'Department', value: person.worker?.department || 'Not set' },
      { label: 'Field of Study', value: person.worker?.field_of_study || 'Not set' },
      { label: 'Profession', value: person.worker?.profession?.name || (person.worker?.profession_id ? 'Selected' : 'Not set') },
      { label: 'Organization', value: person.worker?.organization?.name || (person.worker?.organization_id ? 'Linked' : 'Not set') },
    ];
  }

  return [
    { label: 'Field of Study', value: person.unemployed?.field_of_study || 'Not set' },
    { label: 'Graduation Year', value: person.unemployed?.graduation_year || 'Not set' },
    {
      label: 'Education Level',
      value: person.unemployed?.education_level?.name || (person.unemployed?.education_level_id ? 'Selected' : 'Not set'),
    },
    { label: 'Current Focus', value: 'Graduate follow-up and support visibility' },
  ];
};

const getNextStep = (person, completion) => {
  if (!person) {
    return 'Start with identity and location details below, then add your education or work information in the same form.';
  }

  if (!person.phone || !person.national_id) {
    return 'Add both phone and national ID to make verification smoother for reviewers.';
  }

  if (person.status === 'pending') {
    return 'Your submission is waiting for review. Keep details current so any follow-up is easy to handle.';
  }

  if (person.status === 'rejected') {
    return 'Refine the saved information below and resubmit with the missing or corrected details.';
  }

  if (completion.percent < 85) {
    return 'A few fields are still missing. Filling out the remaining details will make your record stronger in reports.';
  }

  return 'Your record looks strong. Revisit it whenever your education, work, or contact details change.';
};

export default function MyProfile() {
  const { user } = useAuth();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      const res = await personsAPI.myProfile();
      let fullPerson = res.data;
      
      if (fullPerson && fullPerson.type) {
        try {
          let childRes;
          switch(fullPerson.type) {
            case 'student':
              childRes = await api.get(`/students/${fullPerson.id}`);
              fullPerson.student = childRes.data;
              break;
            case 'worker':
              childRes = await api.get(`/workers/${fullPerson.id}`);
              fullPerson.worker = childRes.data;
              break;
            case 'unemployed_graduate':
              childRes = await api.get(`/unemployed/${fullPerson.id}`);
              fullPerson.unemployed = childRes.data;
              break;
          }
        } catch (childErr) {
          console.warn('Child data load failed, basic profile ok:', childErr);
        }
      }
      
      setPerson(fullPerson);
    } catch (err) {
      console.error('No profile yet', err);
      // No profile - will use editMode=false in form
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setSuccess('Profile updated successfully!');
    fetchMyProfile(); // Refresh
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="h-3 w-32 animate-pulse rounded-full bg-stone-200" />
            <div className="h-10 max-w-xl animate-pulse rounded-2xl bg-stone-200" />
            <div className="h-24 animate-pulse rounded-[1.5rem] bg-stone-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-28 animate-pulse rounded-[1.5rem] bg-stone-100" />
            <div className="h-28 animate-pulse rounded-[1.5rem] bg-stone-100" />
            <div className="h-28 animate-pulse rounded-[1.5rem] bg-stone-100" />
            <div className="h-28 animate-pulse rounded-[1.5rem] bg-stone-100" />
          </div>
        </div>
      </div>
    );
  }

  const typeLabel = TYPE_LABELS[person?.type] || 'Not started';
  const statusLabel = person?.status || 'draft';
  const statusStyle = STATUS_STYLES[person?.status] || 'bg-stone-200 text-stone-700';
  const locationLabel = person ? `${person.village_name || 'Village not set'} · ${person.woreda_name || 'Region not set'}` : 'Profile location will appear here';
  const primaryContact = person?.phone || person?.national_id || 'Add phone or ID for easier verification';
  const completion = getCompletionSummary(person);
  const detailRows = getDetailRows(person);
  const trackGuidance = TYPE_GUIDANCE[person?.type];
  const nextStep = getNextStep(person, completion);
  const heroTitle = person
    ? 'Keep your record polished, current, and ready for review.'
    : 'Create a profile that is easy to review and ready to grow with you.';
  const heroDescription = person
    ? 'Your profile holds the personal, location, and education details that power reporting, approvals, and community visibility across the platform.'
    : 'Start once with your personal and location details, then add the school, work, or graduate information that matches your path.';
  const readinessLabel = !person
    ? 'Waiting to start'
    : person.phone && person.national_id
      ? 'Verification ready'
      : 'Add contact + ID';
  const snapshotRows = person
    ? [
        { label: 'Full Name', value: person.name || 'Not set' },
        { label: 'Gender', value: person.gender || 'Not set' },
        { label: 'Birth Date', value: formatDate(person.birth_date) },
        { label: 'Location', value: locationLabel },
      ]
    : [];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-950 via-slate-900 to-amber-800 text-white shadow-xl">
        <div className="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-100">
              Profile Workspace
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-stone-200 sm:text-base">
                {heroDescription}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {person ? (
                <a
                  href="#profile-form"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5"
                >
                  Edit Profile
                </a>
              ) : (
                <a
                  href="#profile-form"
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:-translate-y-0.5"
                >
                  Start Your Profile
                </a>
              )}
              <Link
                to="/"
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Account</p>
              <p className="mt-3 text-2xl font-semibold text-white">{user.username}</p>
              <p className="mt-2 text-sm text-stone-200">{user.email || 'Email linked to your login account'}</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Record Type</p>
              <p className="mt-3 text-2xl font-semibold text-white">{typeLabel}</p>
              <p className="mt-2 text-sm text-stone-200">{trackGuidance?.title || 'Choose a path when you start your record.'}</p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Status</p>
              <div className="mt-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyle}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-200">
                {person ? `Last updated ${formatDate(person.updated_at || person.created_at)}` : 'Create your first submission to begin review.'}
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Completion</p>
              <div className="mt-3 flex items-center gap-3">
                <p className="text-3xl font-semibold text-white">{completion.percent}%</p>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${completion.tone}`}>
                  {completion.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-stone-200">
                {person ? `${completion.filled} of ${completion.total} key details filled in.` : 'Your first submission starts here.'}
              </p>
            </article>
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800 shadow-sm">
          {success}
        </div>
      )}

      {person ? (
        <>
          <section className="grid gap-4 lg:grid-cols-[1.05fr_1.05fr_0.9fr]">
            <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Profile Snapshot</p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-900">{person.name}</h2>
              <div className="mt-5 space-y-3">
                {snapshotRows.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-stone-100 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-sm font-medium text-stone-500">{item.label}</p>
                    <p className="text-sm text-right text-stone-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">{trackGuidance?.title || 'Track Details'}</p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-900">{typeLabel} details</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {trackGuidance?.note || 'Add the details that best describe your current record.'}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {detailRows.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">{item.label}</p>
                    <p className="mt-2 text-sm font-medium text-stone-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">Next Step</p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-900">{readinessLabel}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">{nextStep}</p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Primary contact</p>
                  <p className="mt-2 text-sm font-medium text-stone-800">{primaryContact}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Saved since</p>
                  <p className="mt-2 text-sm font-medium text-stone-800">{formatDate(person.created_at)}</p>
                </div>
                <a
                  href="#profile-form"
                  className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Update Information
                </a>
              </div>
            </article>
          </section>

          <div id="profile-form" className="scroll-mt-24">
            <PersonForm
              person={person}
              editMode={!!person}
              onSuccess={handleSuccess}
            />
          </div>
        </>
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Get Started</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                Build your first profile in one pass
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
                The form below will guide you through identity, location, and the student, worker, or graduate path that fits you best.
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">What to prepare</p>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    Have your name, region, village, phone number, and the main education or work details you want reflected in the system.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Why it matters</p>
                  <p className="mt-3 text-sm leading-6 text-stone-700">
                    A complete profile helps reviewers, reports, and community records stay accurate as your situation changes.
                  </p>
                </div>
              </div>
            </article>

            <aside className="rounded-[1.75rem] border border-sky-200 bg-sky-50 p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-800">Quick Checklist</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                Start strong from the first save
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  'Choose the profile type that matches your current path.',
                  'Set your region and village so location reports stay accurate.',
                  'Add phone and national ID when possible for easier verification.',
                  'Complete the education or work section before saving.',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="#profile-form"
                className="mt-6 inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Open the form
              </a>
            </aside>
          </section>

          <div id="profile-form" className="scroll-mt-24">
            <PersonForm
              person={person}
              editMode={!!person}
              onSuccess={handleSuccess}
            />
          </div>
        </>
      )}
    </div>
  );
}
