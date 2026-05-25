import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    try {

      await axios.post(
        "http://localhost:5000/login",
        {
          username,
          password
        }
      );

      navigate("/dashboard");

    } catch {

      alert("Invalid Login");

    }
  };

  return (

    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-700 to-purple-700">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96">

        <h1 className="text-3xl font-bold text-center mb-8">
          Hospital CMS
        </h1>

        <input
          placeholder="Username"
          className="border p-3 w-full mb-4 rounded-xl"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4 rounded-xl"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={login}
          className="w-full bg-blue-700 text-white p-3 rounded-xl"
        >
          Login
        </button>

      </div>

    </div>

  );
}

export default Login;