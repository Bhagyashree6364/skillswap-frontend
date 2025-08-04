import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchMatches = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        const data = {
          skills_have: storedUser?.skills_have || [],
          skills_want: storedUser?.skills_want || [],
        };

        const res = await axios.post("http://localhost:5000/api/match", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMatches(res.data);
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to fetch matches.");
      }
    };

    fetchMatches();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>👥 Matched Users</h2>
        <button onClick={handleLogout} style={{ background: "#dc3545", color: "#fff", padding: "6px 12px", borderRadius: 6 }}>Logout</button>
      </div>

      {matches.length === 0 && <p>No matches found.</p>}

      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {matches.map((user) => (
          <li key={user._id} style={{
            background: "#f9f9f9",
            marginBottom: 12,
            padding: 14,
            borderRadius: 8,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}&su=SkillSwap Match&body=Hi ${user.name}, I found you on SkillSwap and would like to connect.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 6,
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 6,
                textDecoration: "none"
              }}
            >
              Contact via Email
            </a>
            <p><strong>Skills:</strong> {user.skills_have.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
