import { useState, useEffect } from 'react';
import { workersAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await workersAPI.getAll();
      setWorkers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch workers');
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'woreda_name', header: 'Woreda' },
    { key: 'village_name', header: 'Village' },
    { key: 'profession_name', header: 'Profession' },
    { key: 'organization_name', header: 'Organization' },
    { key: 'status', header: 'Status' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Workers Management</h1>
      {loading ? (
        <div>Loading workers...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={workers} columns={columns} />
      )}
    </div>
  );
}

