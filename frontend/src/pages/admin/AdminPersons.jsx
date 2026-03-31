import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api.js';
import DataTable from '../../components/DataTable.jsx';
import { Link } from 'react-router-dom';

export default function AdminPersons() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPersons();
  }, [statusFilter]);

  const fetchPersons = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await adminAPI.persons.getAll(params);
      setPersons(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch persons');
      setLoading(false);
    }
  };

  const approvePerson = async (id) => {
    if (!confirm('Approve this person?')) return;
    try {
      await adminAPI.persons.approve(id);
      fetchPersons();
    } catch (err) {
      alert('Failed to approve');
    }
  };

  const rejectPerson = async (id) => {
    if (!confirm('Reject this person?')) return;
    try {
      await adminAPI.persons.reject(id);
      fetchPersons();
    } catch (err) {
      alert('Failed to reject');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'woreda_name', header: 'Woreda' },
    { key: 'village_name', header: 'Village' },
    { key: 'status', header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'approved' ? 'bg-green-100 text-green-800' :
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => approvePerson(row.id)}
            disabled={row.status === 'approved'}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400"
          >
            Approve
          </button>
          <button 
            onClick={() => rejectPerson(row.id)}
            disabled={row.status === 'rejected'}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Persons Management</h1>
        <div className="flex space-x-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div>Loading persons...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={persons} columns={columns} />
      )}
    </div>
  );
}

