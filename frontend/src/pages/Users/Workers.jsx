import { useState, useEffect } from 'react';
import { workersAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

const columns = [
  { key: 'person_name', label: 'Name' },
  { key: 'profession_name', label: 'Profession' },
  { key: 'department', label: 'Department' },
  { key: 'education_level_name', label: 'Education Level' },
  { key: 'organization', label: 'Organization' },
  { key: 'woreda_name', label: 'Woreda' },
];

export default function Workers() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    workersAPI.getAll().then(res => setWorkers(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Workers</h1>
      <DataTable data={workers} columns={columns} title="Workers List" />
    </div>
  );
}

