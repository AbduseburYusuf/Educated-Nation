import { useState, useEffect } from 'react';
import { woredasAPI, villagesAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';

const woredaColumns = [
  { key: 'name', label: 'Name' },
];

const villageColumns = [
  { key: 'name', label: 'Name' },
  { key: 'woreda_name', label: 'Woreda' },
];

export default function WoredaMgmt() {
  const [woredas, setWoredas] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    woredasAPI.getAll().then(res => setWoredas(res.data));
    villagesAPI.getAll().then(res => setVillages(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Woreda & Village Management</h1>
      <DataTable data={woredas} columns={woredaColumns} title="Woredas" />
      <DataTable data={villages} columns={villageColumns} title="Villages" />
      {/* Simple add forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h3>Add Woreda</h3>
          <input placeholder="Woreda name" id="woreda-name" className="w-full mb-2 p-2 border" />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </div>
        <div className="card">
          <h3>Add Village</h3>
          <input placeholder="Village name" className="w-full mb-2 p-2 border" />
          <input placeholder="Woreda ID" type="number" className="w-full mb-2 p-2 border" />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </div>
    </div>
  );
}

