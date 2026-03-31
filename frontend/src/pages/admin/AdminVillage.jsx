import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminVillage() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', woreda_id: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchVillages();
  }, []);

  const fetchVillages = async () => {
    try {
      const response = await adminAPI.villages.getAll();
      setVillages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch villages');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.villages.update(editingId, formData);
      } else {
        await adminAPI.villages.create(formData);
      }
      fetchVillages();
      setFormData({ name: '', woreda_id: '' });
      setEditingId(null);
    } catch (err) {
      alert('Failed to save');
    }
  };

  const editVillage = (village) => {
    setFormData({ name: village.name, woreda_id: village.woreda_id });
    setEditingId(village.id);
  };

  const deleteVillage = async (id) => {
    if (!confirm('Delete this village?')) return;
    try {
      await adminAPI.villages.delete(id);
      fetchVillages();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'woreda_name', header: 'Woreda' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => editVillage(row)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteVillage(row.id)}
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
        <h1 className="text-3xl font-bold">Village Management</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Village' : 'Add Village'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Village Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input 
            placeholder="Woreda ID" 
            type="number"
            value={formData.woreda_id}
            onChange={(e) => setFormData({...formData, woreda_id: e.target.value})}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
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
                setFormData({ name: '', woreda_id: '' });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div>Loading villages...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={villages} columns={columns} />
      )}
    </div>
  );
}

