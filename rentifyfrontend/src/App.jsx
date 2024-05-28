import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { useAuth } from "./AuthContext";
import Mylistings from "./components/Mylistings/Mylistings";
import Property from "./components/property/Property";
import Listing from "./components/showlisting/listing";

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Use conditional rendering to render different components based on isLoggedIn */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mylistings" element={<Mylistings></Mylistings>} />
        <Route path="/property" element={<Property></Property>} />
        <Route
          path="/listing/id/:id"
          element={isLoggedIn ? <Listing /> : <Login />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
