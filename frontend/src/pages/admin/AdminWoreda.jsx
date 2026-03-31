import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminWoreda() {
  const [woredas, setWoredas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchWoredas();
  }, []);

  const fetchWoredas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.woredas.getAll();
      setWoredas(response.data);
    } catch (err) {
      setError('Failed to fetch woredas');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    setError('');
    try {
      if (editingId) {
        await adminAPI.woredas.update(editingId, formData);
        setNotice('Woreda updated.');
      } else {
        await adminAPI.woredas.create(formData);
        setNotice('Woreda created.');
      }
      resetForm();
      fetchWoredas();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save woreda');
    } finally {
      setSaving(false);
    }
  };

  const editWoreda = (woreda) => {
    setFormData({ name: woreda.name });
    setEditingId(woreda.id);
    setError('');
    setNotice('');
  };

  const deleteWoreda = async (id) => {
    if (!confirm('Delete this woreda?')) return;
    setError('');
    setNotice('');
    try {
      await adminAPI.woredas.delete(id);
      setNotice('Woreda deleted.');
      fetchWoredas();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete woreda');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => editWoreda(row)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => deleteWoreda(row.id)}
            className="rounded-lg bg-rose-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-rose-600"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Location setup</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Woreda Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Add, rename, or remove woredas. Village-level management remains available in the separate village screen.
          </p>
        </div>
        <a
          href="/admin/village"
          className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Open Village Management
        </a>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-stone-900">{editingId ? 'Edit Woreda' : 'Add Woreda'}</h2>
          <p className="mt-1 text-sm text-stone-600">Keep location names clean and consistent for reporting and profile forms.</p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <input
            placeholder="Woreda name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            className="flex-1 rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Woreda' : 'Add Woreda'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </button>
          )}
        </div>

        {(notice || error) && (
          <div className={`mt-5 rounded-xl px-4 py-3 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {error || notice}
          </div>
        )}
      </form>

      {loading ? (
        <div className="rounded-[1.5rem] border border-stone-200 bg-white px-6 py-12 text-center text-stone-500 shadow-sm">
          Loading woredas...
        </div>
      ) : error && !woredas.length ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
          {error}
        </div>
      ) : (
        <DataTable data={woredas} columns={columns} title="Registered Woredas" />
      )}
    </div>
  );
}
