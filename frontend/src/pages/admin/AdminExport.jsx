import { useState } from 'react';
import { exportAPI } from '../../services/api.js';

export default function AdminExport() {
  const [loading, setLoading] = useState('');
  const [notice, setNotice] = useState('');

  const downloadBlob = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const runExport = async (type, label, request) => {
    setLoading(type);
    setNotice('');
    try {
      const response = await request();
      downloadBlob(response.data, `${type}.csv`);
      setNotice(`${label} export downloaded.`);
    } catch (err) {
      alert('Export failed');
    } finally {
      setLoading('');
    }
  };

  const exportPersons = () => runExport('persons', 'Persons', exportAPI.persons);
  const exportStudents = () => runExport('students', 'Students', exportAPI.students);
  const exportWorkers = () => runExport('workers', 'Workers', exportAPI.workers);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-8">Export Data</h1>
      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-blue-200 hover:border-blue-400">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Persons Export</h3>
          <p className="text-gray-600 mb-6">Download all persons data as CSV</p>
          <button 
            onClick={exportPersons}
            disabled={loading === 'persons'}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-all"
          >
            {loading === 'persons' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Students Export</h3>
          <p className="text-gray-600 mb-6">Download students data</p>
          <button
            onClick={exportStudents}
            disabled={loading === 'students'}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-emerald-400 transition-all"
          >
            {loading === 'students' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-dashed border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Workers Export</h3>
          <p className="text-gray-600 mb-6">Download workers data</p>
          <button
            onClick={exportWorkers}
            disabled={loading === 'workers'}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-400 transition-all"
          >
            {loading === 'workers' ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>
    </div>
  );
}
