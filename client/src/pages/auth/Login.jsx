import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/login", {
        username: loginValue,
        email: loginValue,
        password,
      });
      localStorage.setItem("userId", res.data.userId);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle 500px at 96% 0%, #525254 0%, rgba(30,30,32,0.0) 70%)," +
          "radial-gradient(circle 400px at 0% 100%, #525254 0%, #1E1E20 70%)," +
          "radial-gradient(ellipse 100% 80% at 60% 40%, #1E1E20 0%, #1E1E20 100%)",
      }}
    >
      <div className="glass-card w-full min-h-screen flex items-center justify-center">
        {/* Back Button */}
        <Link
          to="/"
          className="absolute top-8 left-8 text-neutral-400 hover:text-white text-sm font-medium px-4 py-2 rounded transition"
        >
          &lt; Back
        </Link>

        <div className="w-full max-w-md bg-transparent flex flex-col items-center px-8 sm:px-6 md:px-8 py-8 sm:py-12">
          {/* Logo Placeholder */}
          <div className="mb-2 flex justify-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center">
              <svg
                width="60"
                height="54"
                viewBox="0 0 40 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="2"
                  width="36"
                  height="30"
                  rx="4"
                  stroke="#fff"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="8" cy="8" r="2" fill="#fff" />
                <circle cx="14" cy="8" r="2" fill="#fff" />
                <circle cx="20" cy="8" r="2" fill="#fff" />
                <text
                  x="10"
                  y="24"
                  fontSize="12"
                  fill="#fff"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  &lt;/&gt;
                </text>
              </svg>
            </div>
          </div>
          {/* Welcome Text */}
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Yooo, Welcome back!
          </h2>

          {/* Form */}
          <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              className="bg-[#1d1d1f] border rounded-2xl px-4 py-3 text-white placeholder-neutral-600 border-[#525254] focus:outline-none focus:ring-1 focus:ring-white"
              autoComplete="username email"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              placeholder="********"
              className="bg-[#1d1d1f] border rounded-2xl px-4 py-3 text-white placeholder-neutral-600 border-[#525254] focus:outline-none focus:ring-1 focus:ring-white"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold rounded-2xl py-3 mt-2 transition hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>

          <p className="text-neutral-400 mb-2 mt-1 text-center text-sm">
            First time here?{" "}
            <Link to="/signup" className="text-white underline">
              Sign up for free
            </Link>
          </p>

          <div className="flex flex-col items-center w-full mt-4">
            <div className="flex items-center w-full mb-4">
              <hr className="flex-grow border-t border-[#525254]" />
              <span className="mx-4 text-[#525254] text-xs font-semibold">
                or
              </span>
              <hr className="flex-grow border-t border-[#525254]" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-white text-[#1E1E20] font-semibold rounded-2xl py-3 border border-gray-300 hover:bg-gray-100 transition">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/1024px-Google_Favicon_2025.svg.png"
                alt="Google logo"
                className="w-5 h-5"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
          {/* Terms & Privacy */}
          <p className="text-neutral-500 text-xs text-center mt-6">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and our{" "}
            <Link to="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
