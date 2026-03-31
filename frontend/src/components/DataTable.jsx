export default function DataTable({ data = [], columns = [], title = 'Data' }) {
  if (!data.length) return <div className="card p-8 text-center text-gray-500">No data available</div>;

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((col, index) => {
              const columnKey = col.key || col.header || col.label || `col-${index}`;
              return (
                <th key={columnKey} className="border border-gray-300 p-3 text-left">
                  {col.header || col.label || col.key}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-gray-50">
              {columns.map((col, index) => {
                const columnKey = col.key || col.header || col.label || `col-${index}`;
                return (
                  <td key={columnKey} className="border border-gray-300 p-3">
                    {col.render ? col.render(row) : (row[col.key] || '-')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

