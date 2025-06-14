import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/MyProvider";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";

const Login = () => {
  const { signIn, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then(() => {
        Swal.fire("Success", "Login successful!", "success");
        navigate("/");
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        Swal.fire("Success", "Google login successful!", "success");
        navigate("/");
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl p-8 rounded-lg">
        <h2 className="font-semibold text-3xl text-center">Login to Your Account</h2>
        <form onSubmit={handleLogin} className="card-body">
          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="label">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="input w-full"
              placeholder="Password"
              required
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div className="mt-2">
          </div>
          <button type="submit" className="btn btn-neutral mt-4 w-full">Login</button>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline mt-2 w-full"
          >
            Login with Google
          </button>
          <p className="font-semibold text-center mt-4">
            Don't have an account?{" "}
            <NavLink className="link link-secondary" to="/auth/register">
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
