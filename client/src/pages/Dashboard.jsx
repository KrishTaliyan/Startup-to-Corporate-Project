import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Get token and decode role (Simple version)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    // In a real app, decode the JWT. Here we rely on local storage if you saved user info
    const userStr = localStorage.getItem("user"); 
    if(userStr) {
        const user = JSON.parse(userStr);
        setRole(user.role);
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // If I am a Startup, I want to see Opportunities
      // If I am a Corporate, I might want to see Posts (or applications)
      const endpoint = "http://localhost:5000/api/opportunities"; 
      
      const res = await axios.get(endpoint, config);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        {role === "startup" ? "🚀 Innovation Opportunities" : "🏢 Corporate Dashboard"}
      </h1>

      <div style={styles.grid}>
        {items.length === 0 ? (
          <p>No active opportunities found.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.company}>Posted by: {item.companyName || "Unknown"}</p>
              <p style={styles.desc}>{item.description}</p>
              
              <div style={styles.tagContainer}>
                <span style={styles.tag}>💰 {item.budget || "N/A"}</span>
                <span style={styles.tag}>🏭 {item.industry}</span>
              </div>

              {role === "startup" && (
                <button style={styles.button} onClick={() => alert(`Applied to ${item.title}!`)}>
                  Apply Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Simple CSS-in-JS styles for quick visibility
const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    color: "#333",
    marginBottom: "30px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  cardTitle: {
    margin: "0 0 10px 0",
    color: "#2c3e50",
  },
  company: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "10px",
  },
  desc: {
    color: "#555",
    fontSize: "15px",
    lineHeight: "1.5",
    marginBottom: "15px",
  },
  tagContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  tag: {
    backgroundColor: "#e1ecf4",
    color: "#39739d",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
};

export default Dashboard;