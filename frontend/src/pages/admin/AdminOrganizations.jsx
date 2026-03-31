import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await adminAPI.organizations.getAll();
      setOrganizations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch organizations');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.organizations.update(editingId, formData);
      } else {
        await adminAPI.organizations.create(formData);
      }
      fetchOrganizations();
      setFormData({ name: '' });
      setEditingId(null);
    } catch (err) {
      alert('Failed to save');
    }
  };

  const editOrganization = (organization) => {
    setFormData({ name: organization.name });
    setEditingId(organization.id);
  };

  const deleteOrganization = async (id) => {
    if (!confirm('Delete this organization?')) return;
    try {
      await adminAPI.organizations.delete(id);
      fetchOrganizations();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => editOrganization(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteOrganization(row.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizations Management</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Organization' : 'Add Organization'}</h2>
        <input 
          placeholder="Organization Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <div className="mt-6 flex space-x-3">
          <button 
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button 
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '' });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Loading organizations...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={organizations} columns={columns} />
      )}
    </div>
  );
}

