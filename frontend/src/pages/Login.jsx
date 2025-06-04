import React, { useContext, useState } from "react";
import aiImg from "../assets/Robot.jpeg";
import { FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const navigate=useNavigate()

  const { BACKEND_URL, setUserData } = useContext(userDataContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password } = formData;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(response.data);

      setLoading(false);

      alert("Login successful!");
    } catch (err) {
      setUserData(null);

      setError(err.response?.data?.message || "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${aiImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="w-full h-[100vh] min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700 backdrop-blur-lg shadow-2xl shadow-blue-950"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-700"
      >
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center tracking-wide">
          Login to Chat with Your AI Virtual Assistant
        </h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        {/* Email */}
        <label className="block mb-4 relative">
          <span className="text-gray-800 mb-1 block font-medium tracking-wide">
            Email
          </span>
          <div className="relative">
            <FiMail
              className="absolute left-3 top-3 text-gray-800 opacity-70"
              size={20}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 placeholder-gray-800 placeholder-opacity-70 text-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-opacity-30 transition"
            />
          </div>
        </label>

        {/* Password */}
        <label className="block mb-6 relative">
          <span className="text-gray-800 mb-1 block font-medium tracking-wide">
            Password
          </span>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-3 text-gray-800 opacity-70"
              size={20}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 placeholder-gray-800 placeholder-opacity-70 text-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-opacity-30 transition"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-3 text-white font-semibold tracking-wide disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-800">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;


