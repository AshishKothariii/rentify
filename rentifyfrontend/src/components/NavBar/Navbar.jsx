import "./Navbar.css"; // Import the CSS file for styling
import logoImage from "./images.png"; // Import your PNG file from the same folder

const Navbar = () => {
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
      <div className="navbar-right">
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </nav>
  );
};
export default Navbar;
