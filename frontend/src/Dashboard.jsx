import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ auth }) {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const basic = btoa(`${auth.user}:${auth.pass}`);
      const res = await axios.get("/api/submissions", {
        headers: { Authorization: `Basic ${basic}` }
      });
      setData(res.data);
    } catch (err) {
      alert("Failed to fetch data. Check credentials and backend.");
      console.error(err);
    }
  }

  const filtered = data.filter((d) => {
    const s = q.toLowerCase();
    return (
      d.name?.toLowerCase().includes(s) ||
      d.arrivalCity?.toLowerCase().includes(s) ||
      d.phone?.includes(q)
    );
  });

  function downloadCSV() {
    const rows = [
      ["Name","Arrival City","Arrival DateTime","Departure DateTime","Departure Method","Phone","CreatedAt"],
      ...filtered.map(r => [r.name, r.arrivalCity, r.arrivalDateTime, r.departureDateTime, r.departureMethod, r.phone, new Date(r.createdAt).toLocaleString()])
    ];
    const csv = rows.map(r => r.map(cell => `"${(cell||"").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "submissions.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">WhatsApp Submissions</h1>
        <div>
          <input placeholder="Search name, city or phone..." value={q} onChange={(e)=>setQ(e.target.value)} className="border px-3 py-2 mr-2 rounded" />
          <button onClick={downloadCSV} className="bg-green-600 text-white px-3 py-2 rounded">Export CSV</button>
          <button onClick={fetchData} className="ml-2 bg-blue-600 text-white px-3 py-2 rounded">Refresh</button>
        </div>
      </div>

      <div className="overflow-auto bg-white shadow rounded">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Arrival City</th>
              <th className="p-2 text-left">Arrival DateTime</th>
              <th className="p-2 text-left">Departure DateTime</th>
              <th className="p-2 text-left">Method</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">When</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u,i)=>(
              <tr key={u._id} className={i%2===0?"bg-white":"bg-gray-50"}>
                <td className="p-2">{i+1}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.arrivalCity}</td>
                <td className="p-2">{u.arrivalDateTime}</td>
                <td className="p-2">{u.departureDateTime}</td>
                <td className="p-2">{u.departureMethod}</td>
                <td className="p-2">{u.phone}</td>
                <td className="p-2">{new Date(u.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length===0 && <tr><td colSpan="8" className="p-4 text-center">No submissions</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
