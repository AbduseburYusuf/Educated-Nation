import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api.js';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6666'];

export default function Reports() {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        reportsAPI.diplomaPerWoreda(),
        reportsAPI.degreePerWoreda(),
        reportsAPI.profession(),
        reportsAPI.educatedPerWoreda(),
        reportsAPI.educatedPerVillage(),
      ]);
      setReports({
        diploma: results[0].data,
        degree: results[1].data,
        profession: results[2].data,
        perWoreda: results[3].data,
        perVillage: results[4].data,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="card p-8 text-center">Loading reports...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3>Diploma per Woreda</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.diploma || []}>
              <XAxis dataKey="woreda_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Degree per Woreda</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.degree || []}>
              <XAxis dataKey="woreda_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Educated per Woreda</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.perWoreda || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3>Profession Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={reports.profession || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {reports.profession.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

