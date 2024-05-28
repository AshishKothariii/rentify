import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({
  isLoggedIn: false,
  userEmail: null,
  login: () => {}, // Placeholder functions
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Check for existing token or email cookie on mount
    const token = Cookies.get("token"); // Assuming your backend uses 'token'
    const email = Cookies.get("email");

    if (token) {
      setIsLoggedIn(true);
      setUserEmail(email);
    } else if (email) {
      setIsLoggedIn(false);
      Cookies.remove("email");
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    // Clear cookies (adapt to your backend's setup)
    Cookies.remove("token");
    Cookies.remove("email");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
