import React, { useState, useEffect } from "react";
import API from "../api";

export default function Dashboard() {
  // ================= STATE =================
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: ""
  });

  const [grievances, setGrievances] = useState([]);

  // ================= FETCH =================
  const fetchGrievances = async () => {
    try {
      const res = await API.get("/grievances");
      setGrievances(res.data);
    } catch {
      alert("Error fetching grievances");
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  // ================= CREATE =================
  const createGrievance = async () => {
    if (!form.title || !form.description || !form.category) {
      alert("All fields required");
      return;
    }

    try {
      await API.post("/grievances", form);
      alert("Grievance submitted");

      setForm({
        title: "",
        description: "",
        category: ""
      });

      fetchGrievances();
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating grievance");
    }
  };

  // ================= DELETE =================
  const deleteGrievance = async (id) => {
    try {
      await API.delete(`/grievances/${id}`);
      fetchGrievances();
    } catch {
      alert("Error deleting grievance");
    }
  };

  // ================= UPDATE =================
  const updateStatus = async (id) => {
    try {
      await API.put(`/grievances/${id}`, { status: "Resolved" });
      fetchGrievances();
    } catch {
      alert("Error updating status");
    }
  };

  // ================= SEARCH =================
  const searchGrievance = async (text) => {
    try {
      if (!text) return fetchGrievances();

      const res = await API.get(`/grievances/search?title=${text}`);
      setGrievances(res.data);
    } catch {
      alert("Error searching");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* ===== CREATE FORM ===== */}
      <h3>Submit Grievance</h3>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        placeholder="Category (Academic/Hostel/Transport/Other)"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <br /><br />
      <button onClick={createGrievance}>Submit</button>

      {/* ===== SEARCH ===== */}
      <h3>Search</h3>
      <input
        placeholder="Search by title"
        onChange={(e) => searchGrievance(e.target.value)}
      />

      {/* ===== LIST ===== */}
      <h3>All Grievances</h3>

      {grievances.length === 0 ? (
        <p>No grievances found</p>
      ) : (
        grievances.map((g) => (
          <div
            key={g._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              margin: "10px 0"
            }}
          >
            <h4>{g.title}</h4>
            <p>{g.description}</p>
            <p><b>Category:</b> {g.category}</p>
            <p><b>Status:</b> {g.status}</p>

            <button onClick={() => updateStatus(g._id)}>
              Mark Resolved
            </button>

            <button onClick={() => deleteGrievance(g._id)}>
              Delete
            </button>
          </div>
        ))
      )}

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}