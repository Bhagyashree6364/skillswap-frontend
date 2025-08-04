import React, { useState, useEffect } from "react";
import axios from "axios";

// Animated background styles for login and match pages
const loginPageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'gradientLogin 10s ease infinite',
  background: 'linear-gradient(-45deg, #a1c4fd, #c2e9fb, #d4fc79, #96e6a1)',
  backgroundSize: '400% 400%',
};

const matchPageStyle = {
  minHeight: '100vh',
  paddingTop: '40px',
  animation: 'gradientMatch 12s ease infinite',
  background: 'linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1)',
  backgroundSize: '400% 400%',
};

// Keyframe animations
const gradientAnimation = `
  @keyframes gradientLogin {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }
  @keyframes gradientMatch {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
  }
`;

function App() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    skills_have: "",
    skills_want: "",
  });

  const [matches, setMatches] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showMatchesPage, setShowMatchesPage] = useState(false);

  // Inject global styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = gradientAnimation;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const data = {
      email: form.email,
      password: form.password,
      name: form.name,
      skills_have: form.skills_have.split(",").map((s) => s.trim()),
      skills_want: form.skills_want.split(",").map((s) => s.trim()),
    };
    try {
      await axios.post("http://localhost:5000/api/register", data);
      alert("Registered successfully!");
    } catch (err) {
      alert("User already exists or error during registration.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email: form.email,
        password: form.password,
      });
      setToken(res.data.token);
      setIsLoggedIn(true);
      setShowMatchesPage(true);
      alert("Login successful!");
    } catch {
      alert("Invalid email or password");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setShowMatchesPage(false);
    localStorage.removeItem("token");
    setMatches([]);
    setForm({
      email: "",
      password: "",
      name: "",
      skills_have: "",
      skills_want: "",
    });
  };

  const handleMatch = async () => {
    if (!token) {
      alert("You must be logged in to fetch matches.");
      return;
    }

    const data = {
      skills_have: form.skills_have.split(",").map((s) => s.trim()),
      skills_want: form.skills_want.split(",").map((s) => s.trim()),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/match", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMatches(res.data);
    } catch (err) {
      console.error("Fetch match error:", err.response?.data || err.message);
      alert("Error fetching matches. Make sure you are logged in.");
    }
  };

  // Matches Page
  if (isLoggedIn && showMatchesPage) {
    return (
      <div style={matchPageStyle}>
        <div style={{ maxWidth: 700, margin: "auto", padding: 20, fontFamily: "Segoe UI", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 12 }}>
          <h2 style={{ textAlign: "center", color: "#2c3e50" }}>🎯 Your Skill Matches</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <button onClick={handleLogout} style={{ backgroundColor: "#e74c3c", color: "white", padding: "10px 16px", border: "none", borderRadius: 6 }}>
              Logout
            </button>
            <button onClick={handleMatch} style={{ padding: "10px 16px", backgroundColor: "#27ae60", color: "white", border: "none", borderRadius: 6 }}>
              Refresh Matches
            </button>
          </div>

          {matches.length === 0 ? (
            <p style={{ textAlign: "center" }}>No matches found yet.</p>
          ) : (
            <ul style={{ paddingLeft: 0, listStyleType: "none" }}>
              {matches.map((user) => (
                <li key={user._id} style={{
                  background: "#fdfdfd",
                  marginBottom: 12,
                  padding: 16,
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  <p><strong>👤 Name:</strong> {user.name}</p>
                  <p><strong>📧 Email:</strong> {user.email}</p>
                  <p><strong>🔗 Contact:</strong>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}&su=SkillSwap Match&body=Hi ${user.name}, I found you on SkillSwap and would like to connect.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: '10px',
                        padding: '8px 14px',
                        backgroundColor: '#2980b9',
                        color: 'white',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      Email {user.name}
                    </a>
                  </p>
                  <p><strong>🛠️ Has:</strong> {user.skills_have.join(", ")}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // Login/Register Page
  return (
    <div style={loginPageStyle}>
      <div style={{ maxWidth: 500, margin: "auto", padding: 30, fontFamily: "Segoe UI", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 12 }}>
        <h2 style={{ textAlign: "center", color: "#34495e", marginBottom: 20 }}>🔄 SkillSwap Platform</h2>

        <input
          name="email"
          placeholder="📧 Email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 12, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <input
          name="password"
          placeholder="🔒 Password"
          type="password"
          value={form.password}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 12, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <input
          name="name"
          placeholder="🙋 Your Name"
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 12, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <input
          name="skills_have"
          placeholder="🛠️ Skills You Have (comma separated)"
          value={form.skills_have}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 12, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <input
          name="skills_want"
          placeholder="🎯 Skills You Want (comma separated)"
          value={form.skills_want}
          onChange={handleChange}
          style={{ width: "100%", padding: 10, marginBottom: 20, border: "1px solid #ccc", borderRadius: 6 }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleRegister} style={{ padding: "10px 16px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: 6 }}>Register</button>
          <button onClick={handleLogin} style={{ padding: "10px 16px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: 6 }}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default App;
