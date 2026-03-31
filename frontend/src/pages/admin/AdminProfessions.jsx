import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminProfessions() {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const response = await adminAPI.professions.getAll();
      setProfessions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch professions');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.professions.update(editingId, formData);
      } else {
        await adminAPI.professions.create(formData);
      }
      fetchProfessions();
      setFormData({ name: '' });
      setEditingId(null);
    } catch (err) {
      alert('Failed to save');
    }
  };

  const editProfession = (profession) => {
    setFormData({ name: profession.name });
    setEditingId(profession.id);
  };

  const deleteProfession = async (id) => {
    if (!confirm('Delete this profession?')) return;
    try {
      await adminAPI.professions.delete(id);
      fetchProfessions();
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
            onClick={() => editProfession(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteProfession(row.id)}
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
        <h1 className="text-3xl font-bold">Professions Management</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Profession' : 'Add Profession'}</h2>
        <input 
          placeholder="Profession Name" 
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
        <div>Loading professions...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={professions} columns={columns} />
      )}
    </div>
  );
}

