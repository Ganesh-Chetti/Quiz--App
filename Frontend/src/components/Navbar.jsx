import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const updateUser = () => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    let parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (storedToken && parsedUser) {
      setUser({ username: parsedUser.username, role: storedRole });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser(); 
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null); 
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </div>


      
      <div className="nav-user">
        <ThemeToggle />
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register/user">User Register</Link>
            <Link to="/register/admin">Admin Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
