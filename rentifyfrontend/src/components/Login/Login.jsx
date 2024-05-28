import { useState } from "react";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth(); // Get the login function from the context

  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await axios.post(
        "https://rentify-da6y.onrender.com/login",
        formData,
        {
          withCredentials: true,
        }
      );
      Cookies.set("email", data.data.email);
      login(data.data.email);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error.response.data.error);
      setErrorMessage("Invalid credentials");
    }
  }

  return (
    <div>
      <Navbar />
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
          <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Login</h2>
          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
          {["email", "password"].map((field) => (
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
          ))}
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
            Login
          </button>
          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.9em",
            }}
          >
            Dont have an account?{" "}
            <a href="/register">
              <span
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Register
              </span>
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
