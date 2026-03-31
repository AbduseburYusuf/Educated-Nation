import { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll();
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'woreda_name', header: 'Woreda' },
    { key: 'village_name', header: 'Village' },
    { key: 'level', header: 'Level' },
    { key: 'field_of_study', header: 'Field' },
    { key: 'status', header: 'Status' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Students Management</h1>
      {loading ? (
        <div>Loading students...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={students} columns={columns} />
      )}
    </div>
  );
}

