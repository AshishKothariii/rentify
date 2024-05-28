import React, { useState } from "react";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileno: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await axios.post(
        "http://localhost:8080/register",
        formData,
        {
          withCredentials: true,
        }
      );
      Cookies.set("email", data.data.email);
      login(data.data.email);
      navigate("/");
      // Redirect to /home upon successful registration
    } catch (error) {
      // Handle errors
      console.error("Error during registration:", error.response.data.error);
      setErrorMessage("User already exists");
    }
  }

  return (
    <div>
      <Navbar></Navbar>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "1rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "300px",
          }}
        >
          <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
            Register
          </h2>
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
          {["firstName", "lastName", "email", "mobileno", "password"].map(
            (field) => (
              <div key={field} style={{ margin: "1rem 0" }}>
                <label
                  htmlFor={field}
                  style={{ display: "block", fontWeight: "bold" }}
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  placeholder={`Enter your ${field.toLowerCase()}`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            )
          )}
          <button
            type="submit"
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Register
          </button>
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.9em",
            }}
          >
            Already have an account?
            <a href="/login">
              <span
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Sign In
              </span>
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
