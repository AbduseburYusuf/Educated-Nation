import { useState, useEffect } from 'react';
import { unemployedAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminUnemployed() {
  const [unemployed, setUnemployed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUnemployed();
  }, []);

  const fetchUnemployed = async () => {
    try {
      const response = await unemployedAPI.getAll();
      setUnemployed(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch unemployed');
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'woreda_name', header: 'Woreda' },
    { key: 'village_name', header: 'Village' },
    { key: 'field_of_study', header: 'Field' },
    { key: 'graduation_year', header: 'Grad Year' },
    { key: 'status', header: 'Status' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Unemployed Graduates</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={unemployed} columns={columns} />
      )}
    </div>
  );
}

