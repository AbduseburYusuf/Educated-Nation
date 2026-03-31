import { useState, useEffect } from 'react';
import { woredasAPI, villagesAPI, professionsAPI, educationLevelsAPI, organizationsAPI, personsAPI, studentsAPI, workersAPI, unemployedAPI } from '../services/api.js';
import { STUDENT_LEVELS, PERSON_TYPES, GENDERS } from '../utils/constants.js';

export default function PersonForm({ person: initialPerson, editMode = false, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birth_date: '',
    phone: '',
    national_id: '',
    type: 'student',
    woreda_id: '',
    village_id: '',
    // Student
    level: '',
    grade_or_year: '',
    field_of_study: '',
    education_level_id: '',
    institution_name: '',
    // Worker
    profession_id: '',
    department: '',
    organization_id: '',
    // Unemployed
    unemployment_field_of_study: '',
    unemployment_education_level_id: '',
    graduation_year: '',
  });
  const [woredas, setWoredas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (!formData.woreda_id) return;

    const availableVillages = villages.filter(
      (v) => String(v.woreda_id) === String(formData.woreda_id)
    );

    if (!availableVillages.length) {
      if (formData.village_id) {
        setFormData((prev) => ({ ...prev, village_id: '' }));
      }
      return;
    }

    const hasSelectedVillage = availableVillages.some(
      (v) => String(v.id) === String(formData.village_id)
    );

    if (!hasSelectedVillage) {
      setFormData((prev) => ({ ...prev, village_id: String(availableVillages[0].id) }));
    }
  }, [formData.woreda_id, formData.village_id, villages]);

  useEffect(() => {
    if (initialPerson) {
      const childData = {};
      if (initialPerson.type === 'student' && initialPerson.student) {
        childData.level = initialPerson.student.level || '';
        childData.grade_or_year = initialPerson.student.grade_or_year || '';
        childData.field_of_study = initialPerson.student.field_of_study || '';
        childData.education_level_id = initialPerson.student.education_level_id || '';
        childData.institution_name = initialPerson.student.institution_name || '';
      } else if (initialPerson.type === 'worker' && initialPerson.worker) {
        childData.profession_id = initialPerson.worker.profession_id || '';
        childData.department = initialPerson.worker.department || '';
        childData.organization_id = initialPerson.worker.organization_id || '';
        childData.education_level_id = initialPerson.worker.education_level_id || '';
        childData.field_of_study = initialPerson.worker.field_of_study || '';
      } else if (initialPerson.type === 'unemployed_graduate' && initialPerson.unemployed) {
        childData.unemployment_field_of_study = initialPerson.unemployed.field_of_study || '';
        childData.unemployment_education_level_id = initialPerson.unemployed.education_level_id || '';
        childData.graduation_year = initialPerson.unemployed.graduation_year || '';
      }
      
      setFormData({
        name: initialPerson.name || '',
        gender: initialPerson.gender || '',
        birth_date: initialPerson.birth_date || '',
        phone: initialPerson.phone || '',
        national_id: initialPerson.national_id || '',
        type: initialPerson.type || 'student',
        woreda_id: initialPerson.woreda_id ? String(initialPerson.woreda_id) : '',
        village_id: initialPerson.village_id ? String(initialPerson.village_id) : '',
        ...childData
      });
    }
  }, [initialPerson]);

  const fetchDropdowns = async () => {
    try {
      const [woredasRes, villagesRes, professionsRes, educationLevelsRes, organizationsRes] = await Promise.all([
        woredasAPI.getAll(),
        villagesAPI.getAll(),
        professionsAPI.getAll(),
        educationLevelsAPI.getAll(),
        organizationsAPI.getAll()
      ]);
      setWoredas(woredasRes.data);
      setVillages(villagesRes.data);
      setProfessions(professionsRes.data);
      setEducationLevels(educationLevelsRes.data);
      setOrganizations(organizationsRes.data);
    } catch (err) {
      console.error('Failed to fetch dropdowns', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'woreda_id' ? { village_id: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    try {
      const personData = {
        name: formData.name,
        gender: formData.gender,
        birth_date: formData.birth_date,
        phone: formData.phone || null,
        national_id: formData.national_id || null,
        woreda_id: parseInt(formData.woreda_id),
        village_id: parseInt(formData.village_id),
        type: formData.type,
      };

      let personRes;
      if (editMode && initialPerson) {
        personRes = await personsAPI.update(initialPerson.id, personData);
      } else {
        personRes = await personsAPI.create(personData);
      }
      const personId = personRes.data.id;

      // Update/create education
      if (formData.type === 'student') {
        const studentData = {
          person_id: personId,
          level: formData.level,
          grade_or_year: formData.grade_or_year,
          field_of_study: formData.field_of_study,
          education_level_id: formData.education_level_id ? parseInt(formData.education_level_id) : null,
          institution_name: formData.institution_name,
        };
        if (editMode) {
          await studentsAPI.update(personId, studentData);
        } else {
          await studentsAPI.create(studentData);
        }
      } else if (formData.type === 'worker') {
        const workerData = {
          person_id: personId,
          profession_id: parseInt(formData.profession_id),
          department: formData.department,
          education_level_id: parseInt(formData.education_level_id),
          organization_id: formData.organization_id ? parseInt(formData.organization_id) : null,
          field_of_study: formData.field_of_study,
        };
        if (editMode) {
          await workersAPI.update(personId, workerData);
        } else {
          await workersAPI.create(workerData);
        }
      } else if (formData.type === 'unemployed_graduate') {
        const unemployedData = {
          person_id: personId,
          field_of_study: formData.unemployment_field_of_study,
          education_level_id: parseInt(formData.unemployment_education_level_id),
          graduation_year: parseInt(formData.graduation_year),
        };
        if (editMode) {
          await unemployedAPI.update(personId, unemployedData);
        } else {
          await unemployedAPI.create(unemployedData);
        }
      }

      onSuccess?.(personRes.data);
      if (!editMode) {
        setFormData({ name: '', gender: '', birth_date: '', phone: '', national_id: '', type: 'student', woreda_id: '', village_id: '', level: '', grade_or_year: '', field_of_study: '', education_level_id: '', institution_name: '', profession_id: '', department: '', organization_id: '', unemployment_field_of_study: '', unemployment_education_level_id: '', graduation_year: '' });
      }
    } catch (err) {
      console.error('Full error:', err.response);
      const errMsg = err.response?.data?.error || 
                     err.response?.data?.errors?.map(e => e.msg).join(', ') || 
                     err.message || 'An unknown error occurred';
      setError(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isStudent = formData.type === 'student';
  const isWorker = formData.type === 'worker';
  const isUnemployed = formData.type === 'unemployed_graduate';
  const filteredVillages = villages.filter(
    (v) => String(v.woreda_id) === String(formData.woreda_id)
  );
  const selectedWoreda = woredas.find((woreda) => String(woreda.id) === String(formData.woreda_id));
  const selectedVillage = filteredVillages.find((village) => String(village.id) === String(formData.village_id));
  const typeLabel = PERSON_TYPES.find((type) => type.value === formData.type)?.label || 'Student';
  const typeTheme = {
    student: {
      hero: 'from-sky-900 via-blue-700 to-cyan-500',
      panel: 'border-sky-200 bg-sky-50',
      accent: 'text-sky-800',
      note: 'Capture the school path, level, and field information clearly for academic reporting.',
    },
    worker: {
      hero: 'from-emerald-900 via-teal-700 to-cyan-500',
      panel: 'border-emerald-200 bg-emerald-50',
      accent: 'text-emerald-800',
      note: 'Highlight profession, department, organization, and education background for workforce insights.',
    },
    unemployed_graduate: {
      hero: 'from-amber-900 via-orange-700 to-yellow-500',
      panel: 'border-amber-200 bg-amber-50',
      accent: 'text-amber-800',
      note: 'Keep graduation details complete so follow-up support and planning remain accurate.',
    },
  }[formData.type];

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
      <div className={`bg-gradient-to-br ${typeTheme.hero} px-6 py-8 text-white sm:px-8`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              {editMode ? 'Profile editor' : 'New submission'}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {editMode ? 'Refine your saved profile' : 'Create a polished record'}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
              Keep identity, location, and education details complete so your profile is easy to review and report on.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Record Type</p>
              <p className="mt-2 text-lg font-semibold">{typeLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Region</p>
              <p className="mt-2 text-lg font-semibold">{selectedWoreda?.name || 'Choose region'}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Village</p>
              <p className="mt-2 text-lg font-semibold">{selectedVillage?.name || 'Choose village'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <section className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-6">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Identity</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-900">Personal details</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Use clear, verifiable personal details so your record stays useful for reporting and approvals.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Full Name <span className="text-rose-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option value="">Select Gender</option>
                {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Birth Date</label>
              <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">National ID</label>
              <input type="text" name="national_id" value={formData.national_id} onChange={handleChange} className="form-input" />
            </div>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">Placement</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-900">Profile type and location</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              These fields decide which detail section you complete and where your record appears in location reports.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Type <span className="text-rose-500">*</span></label>
              <select name="type" value={formData.type} onChange={handleChange} className="form-select" required>
                {PERSON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Region <span className="text-rose-500">*</span></label>
              <select name="woreda_id" value={formData.woreda_id} onChange={handleChange} className="form-select" required>
                <option value="">Select region</option>
                {woredas.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Village <span className="text-rose-500">*</span></label>
              <select name="village_id" value={formData.village_id} onChange={handleChange} className="form-select" required>
                <option value="">Select village</option>
                {filteredVillages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

      {isStudent && (
        <section className={`space-y-4 rounded-[1.5rem] border p-6 ${typeTheme.panel}`}>
          <div className="mb-5">
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${typeTheme.accent}`}>Student track</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-900">Student details</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700">{typeTheme.note}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Level <span className="text-rose-500">*</span></label>
              <select name="level" value={formData.level} onChange={handleChange} className="form-select" required>
                <option value="">Select</option>
                {STUDENT_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Education Level</label>
              <select name="education_level_id" value={formData.education_level_id} onChange={handleChange} className="form-select">
                <option value="">N/A</option>
                {educationLevels.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Grade/Year</label>
              <input type="text" name="grade_or_year" value={formData.grade_or_year} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Field of Study</label>
              <input type="text" name="field_of_study" value={formData.field_of_study} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Institution Name</label>
              <input type="text" name="institution_name" value={formData.institution_name} onChange={handleChange} className="form-input" />
            </div>
          </div>
        </section>
      )}

      {isWorker && (
        <section className={`space-y-4 rounded-[1.5rem] border p-6 ${typeTheme.panel}`}>
          <div className="mb-5">
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${typeTheme.accent}`}>Worker track</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-900">Worker details</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700">{typeTheme.note}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Profession <span className="text-rose-500">*</span></label>
              <select name="profession_id" value={formData.profession_id} onChange={handleChange} className="form-select" required>
                <option value="">Select</option>
                {professions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Education Level <span className="text-rose-500">*</span></label>
              <select name="education_level_id" value={formData.education_level_id} onChange={handleChange} className="form-select" required>
                <option value="">Select</option>
                {educationLevels.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Organization</label>
              <select name="organization_id" value={formData.organization_id} onChange={handleChange} className="form-select">
                <option value="">Select</option>
                {organizations.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Field of Study</label>
              <input type="text" name="field_of_study" value={formData.field_of_study} onChange={handleChange} className="form-input" />
            </div>
          </div>
        </section>
      )}

      {isUnemployed && (
        <section className={`space-y-4 rounded-[1.5rem] border p-6 ${typeTheme.panel}`}>
          <div className="mb-5">
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${typeTheme.accent}`}>Graduate track</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-900">Unemployed graduate details</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700">{typeTheme.note}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Field of Study <span className="text-rose-500">*</span></label>
              <input type="text" name="unemployment_field_of_study" value={formData.unemployment_field_of_study} onChange={handleChange} className="form-input" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Education Level <span className="text-rose-500">*</span></label>
              <select name="unemployment_education_level_id" value={formData.unemployment_education_level_id} onChange={handleChange} className="form-select" required>
                <option value="">Select</option>
                {educationLevels.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Graduation Year <span className="text-rose-500">*</span></label>
              <input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleChange} className="form-input" required />
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              type="button"
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

        <div className="rounded-[1.5rem] bg-stone-950 px-6 py-5 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Final Step</p>
              <p className="mt-2 text-sm leading-6 text-stone-300">
                Review the fields above, then save your record to keep your profile current.
              </p>
            </div>
            <button 
              type="submit" 
              disabled={submitLoading} 
              className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-950 transition hover:bg-amber-400 disabled:opacity-50"
            >
              {submitLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving
                </>
              ) : (
                editMode ? 'Update Profile' : 'Submit Information'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
