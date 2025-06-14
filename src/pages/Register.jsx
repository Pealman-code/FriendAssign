import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/MyProvider";
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import Swal from "sweetalert2";

const Register = () => {
  const { createUser, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasMinLength) return "Password must be at least 6 characters long.";
    return "";
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      Swal.fire("Error", passwordValidationError, "error");
      return;
    }

    createUser(email, password)
      .then((result) => {
        updateProfile(result.user, {
          displayName: name,
          photoURL: photoURL || "https://i.ibb.co/WvJPwjkh/b41b784be9a6392773515b32217b39eb.jpg",
        })
          .then(() => {
            Swal.fire("Success", "Registration successful!", "success");
            navigate("/auth/login");
          })
          .catch((error) => {
            Swal.fire("Error", error.message, "error");
          });
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
        <h2 className="font-semibold text-3xl text-center">Register Your Account</h2>
        <form onSubmit={handleRegister} className="card-body">
          <label className="label">Name</label>
          <input name="name" type="text" className="input" placeholder="Name" required />

          <label className="label">Email</label>
          <input name="email" type="email" className="input" placeholder="Email" required />

          <label className="label">Photo URL</label>
          <input name="photoURL" type="url" className="input" placeholder="Photo URL" />

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

          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

          <button type="submit" className="btn btn-neutral mt-4">Register</button>
          <button type="button" onClick={handleGoogleLogin} className="btn btn-outline mt-2">
            Register with Google
          </button>

          <p className="font-semibold text-center mt-2">
            Already Have An Account?{" "}
            <NavLink className="link link-secondary" to="/auth/login">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
