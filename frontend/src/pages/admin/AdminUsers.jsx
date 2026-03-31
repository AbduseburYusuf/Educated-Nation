import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import DataTable from '../../components/DataTable.jsx';

const emptyForm = {
  username: '',
  email: '',
  password: '',
  role: 'user',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminAPI.users.getAll();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    setError('');

    try {
      await adminAPI.users.create(formData);
      setFormData(emptyForm);
      setNotice('User created successfully.');
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.error || err.response?.data?.errors?.map((item) => item.msg).join(', ') || 'Failed to create user';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = async (userId) => {
    if (!confirm('Toggle this user role?')) return;
    setNotice('');
    setError('');
    try {
      await adminAPI.users.toggleRole(userId);
      setNotice('User role updated.');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle role');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Delete this user account?')) return;
    setNotice('');
    setError('');
    try {
      await adminAPI.users.delete(userId);
      setNotice('User deleted.');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          row.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
        }`}>
          {row.role}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => {
        const isCurrentUser = row.id === user?.id;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => toggleRole(row.id)}
              disabled={isCurrentUser}
              className={`rounded-lg px-3 py-1 text-sm font-medium text-white ${
                isCurrentUser
                  ? 'cursor-not-allowed bg-stone-400'
                  : row.role === 'admin'
                    ? 'bg-rose-500 hover:bg-rose-600'
                    : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isCurrentUser ? 'Current Admin' : row.role === 'admin' ? 'Make User' : 'Make Admin'}
            </button>
            <button
              onClick={() => deleteUser(row.id)}
              disabled={isCurrentUser}
              className={`rounded-lg px-3 py-1 text-sm font-medium text-white ${
                isCurrentUser ? 'cursor-not-allowed bg-stone-400' : 'bg-stone-700 hover:bg-stone-800'
              }`}
            >
              Delete
            </button>
          </div>
        );
      },
    },
    { key: 'created_at', header: 'Created' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-400">Access control</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Users Management</h1>
          <p className="mt-2 max-w-2xl text-sm text-stone-600">
            Create login accounts for staff and adjust access roles without leaving the admin workspace.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-stone-900">Add User</h2>
          <p className="mt-1 text-sm text-stone-600">New users are created with secure password hashing on the server.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Temporary password"
            value={formData.password}
            onChange={handleChange}
            className="rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {(notice || error) && (
          <div className={`mt-5 rounded-xl px-4 py-3 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
            {error || notice}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-stone-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Creating...' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData(emptyForm);
              setError('');
              setNotice('');
            }}
            className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <div className="rounded-[1.5rem] border border-stone-200 bg-white px-6 py-12 text-center text-stone-500 shadow-sm">
          Loading users...
        </div>
      ) : error && !users.length ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-sm">
          {error}
        </div>
      ) : (
        <DataTable data={users} columns={columns} title="System Users" />
      )}
    </div>
  );
}
