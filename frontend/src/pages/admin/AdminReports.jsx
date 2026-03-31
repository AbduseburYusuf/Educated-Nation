import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api.js';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminReports() {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [
        educatedPerWoreda,
        educatedPerVillage,
        professionData,
        diplomaPerWoreda,
        degreePerWoreda
      ] = await Promise.all([
        reportsAPI.educatedPerWoreda(),
        reportsAPI.educatedPerVillage(),
        reportsAPI.profession(),
        reportsAPI.diplomaPerWoreda(),
        reportsAPI.degreePerWoreda()
      ]);
      setReports({
        educatedPerWoreda: educatedPerWoreda.data,
        educatedPerVillage: educatedPerVillage.data,
        professionData: professionData.data,
        diplomaPerWoreda: diplomaPerWoreda.data,
        degreePerWoreda: degreePerWoreda.data
      });
    } catch (err) {
      console.error('Reports failed', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#912EFF', '#FF4D4F'];

  if (loading) return <div className="text-center py-12">Loading reports...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports & Statistics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Profession Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={reports.professionData || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {reports.professionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Educated per Woreda</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.educatedPerWoreda || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

