import { useState, useEffect } from 'react';
import { studentsAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

const columns = [
  { key: 'person_name', label: 'Name' },
  { key: 'level', label: 'Level' },
  { key: 'education_level_name', label: 'Education Level' },
  { key: 'field_of_study', label: 'Field' },
  { key: 'year_or_grade', label: 'Year/Grade' },
  { key: 'woreda_name', label: 'Woreda' },
];

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    studentsAPI.getAll().then(res => setStudents(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Students</h1>
      <DataTable data={students} columns={columns} title="Students List" />
    </div>
  );
}

