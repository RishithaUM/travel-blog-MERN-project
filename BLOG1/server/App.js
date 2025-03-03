import React, { useState } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true); // Switch between Login and Signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  // Handle Login/Signup form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = { username, password };

    if (isLogin) {
      // Handle Login
      Axios.post("http://localhost:5000/login", user)
        .then((response) => {
          // Store user info (e.g., in localStorage or context)
          localStorage.setItem("user", JSON.stringify(response.data));

          // Redirect to the travel blog page
          history.push("/travel-blog");
        })
        .catch((error) => {
          console.error("Login failed", error);
        });
    } else {
      // Handle Signup
      Axios.post("http://localhost:5000/signup", user)
        .then((response) => {
          // Redirect to login after successful signup
          setIsLogin(true);
        })
        .catch((error) => {
          console.error("Signup failed", error);
        });
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? "Login" : "Signup"}</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default App;
