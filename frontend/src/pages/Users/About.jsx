import { Link } from 'react-router-dom';

const historyHighlights = [
  {
    title: 'A long-standing community in east-central Ethiopia',
    description:
      'The Argoba, often written Argobba, are closely associated with communities across east-central Ethiopia, especially in areas linked to southeastern Wollo and northeastern Shewa.',
  },
  {
    title: 'History carried in everyday life',
    description:
      'Local tradition in Shonke connects settlement in the area to around the 12th century, and the community is widely known for preserving identity through faith, family memory, weaving, trade, and shared customs.',
  },
  {
    title: 'Language, belonging, and continuity',
    description:
      'Argobba is an endangered Ethio-Semitic language. Even where households also use Amharic or Afaan Oromoo, research describes Argoba identity as being sustained through beliefs, values, traditions, and community practice.',
  },
];

const communityValues = [
  'Preserving educational records so families and institutions can plan with confidence.',
  'Making personal profiles easier to maintain as students, workers, and graduates update their status.',
  'Keeping community history visible alongside present-day development and achievement.',
];

export default function About() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-950 via-amber-900 to-orange-700 px-6 py-10 text-white shadow-xl sm:px-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">
          About
        </p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Argoba history, language, and community at a glance
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-amber-50/90 sm:text-lg">
          This page gives users a short introduction to the Argoba community while keeping the
          platform focused on education records, profiles, and community visibility.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition-transform hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
          <Link
            to="/profile"
            className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Open Profile
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {historyHighlights.map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
        <article className="rounded-[1.75rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Community Overview
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            A living heritage shaped by language, faith, and local memory
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700 sm:text-base">
            <p>
              The Argoba community is widely recognized as part of Ethiopia&apos;s rich historical and
              cultural landscape. Community life has often been associated with trade, agriculture,
              weaving, and long-established Muslim settlements.
            </p>
            <p>
              In places such as Shonke, the built environment itself is part of the story. Hilltop
              settlement patterns and long-standing houses are often described as visible symbols of
              continuity, identity, and resilience.
            </p>
            <p>
              This platform brings that background into the user dashboard so people are not only
              managing records, but also seeing the broader story of the community those records
              represent.
            </p>
          </div>
        </article>

        <aside className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
            Why It Matters
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900">
            What this dashboard is here to support
          </h2>
          <div className="mt-5 space-y-3">
            {communityValues.map((value) => (
              <div key={value} className="rounded-2xl bg-white/80 p-4 text-sm leading-6 text-stone-700">
                {value}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
}
