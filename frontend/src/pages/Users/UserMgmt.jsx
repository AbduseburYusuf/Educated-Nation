import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import DataTable from '../../components/DataTable.jsx';

export default function UserMgmt() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.users.getAll();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const toggleRole = async (userId) => {
    if (!confirm('Toggle role?')) return;
    try {
      await adminAPI.users.toggleRole(userId);
      fetchUsers(); // Refresh
    } catch (err) {
      alert('Failed to toggle role');
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (row) => (
        <button 
          onClick={() => toggleRole(row.id)}
          className={`px-3 py-1 rounded text-sm font-medium ${
            row.role === 'admin' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {row.role === 'admin' ? 'Make User' : 'Make Admin'}
        </button>
      )
    },
    { key: 'created_at', header: 'Created' }
  ];

  if (user?.role !== 'admin') {
    return <div className="text-center py-12"><h1 className="text-2xl text-red-600">Admin access required</h1></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Add User
        </button>
      </div>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <DataTable data={users} columns={columns} />
      )}
    </div>
  );
}
