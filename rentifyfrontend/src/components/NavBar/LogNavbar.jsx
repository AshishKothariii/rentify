import { useState } from "react";
import "./Navbar.css"; // Import the CSS file for styling
import logoImage from "./images.png"; // Import your PNG file from the same folder
import { useAuth } from "../../AuthContext";

const LogNavbar = () => {
  const [rentisExpanded, setrentisExpanded] = useState(false);
  const { logout } = useAuth();

  const handlerentToggle = () => {
    setrentisExpanded(!rentisExpanded);
  };
  const HandleLogout = () => {
    logout();
  };
  return (
    <nav className="navbar" style={{}}>
      <div className="navbar-logo">
        <a href="/">
          <img
            src={logoImage}
            alt="Logo"
            style={{ width: "100px", height: "60px" }}
          />
        </a>
      </div>
      <div style={{ marginLeft: "900px" }}>
        <a href="/mylistings" className="Mylistings">
          MyListings
        </a>
      </div>
      <div className="navbar-right">
        <a href="/property">POST PROPERTY</a>
        <a>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{ display: "flex", cursor: "pointer" }}
              onClick={handlerentToggle}
            >
              <span>LOGOUT</span>
              <span>{rentisExpanded ? "▲" : "▼"}</span>
            </div>
            {rentisExpanded && (
              <div style={{ marginLeft: "8px" }}>
                <div className="Budgetslidercontainer">
                  <button onClick={HandleLogout}> Logout</button>
                </div>
              </div>
            )}
          </div>
        </a>
      </div>
    </nav>
  );
};
export default LogNavbar;
