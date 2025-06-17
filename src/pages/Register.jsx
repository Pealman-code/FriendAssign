import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/MyProvider';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';

const Register = () => {
  const { createUser, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name is required and must be at least 2 characters long.';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'A valid email is required.';
    }
    if (formData.photoURL && !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i.test(formData.photoURL)) {
      newErrors.photoURL = 'Photo URL must be a valid image URL (png, jpg, jpeg, gif).';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*]/.test(formData.password)
    ) {
      newErrors.password =
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      photoURL: form.photoURL.value,
      password: form.password.value,
    };

    if (!validateForm(formData)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form.',
      });
      return;
    }

    createUser(formData.email, formData.password)
      .then((result) => {
        updateProfile(result.user, {
          displayName: formData.name,
          photoURL: formData.photoURL || 'https://i.ibb.co/WvJPwjkh/b41b784be9a6392773515b32217b39eb.jpg',
        })
          .then(() => {
            Swal.fire('Success', 'Registration successful!', 'success');
            navigate('/auth/login');
          })
          .catch((error) => {
            Swal.fire('Error', error.message, 'error');
          });
      })
      .catch((error) => {
        Swal.fire('Error', error.message, 'error');
      });
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        Swal.fire('Success', 'Google login successful!', 'success');
        navigate('/');
      })
      .catch((error) => {
        Swal.fire('Error', error.message, 'error');
      });
  };

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl p-8 rounded-lg">
        <h2 className="font-semibold text-3xl text-center">Register Your Account</h2>
        <form onSubmit={handleRegister} className="card-body">
          <label className="label">Name</label>
          <input
            name="name"
            type="text"
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Name"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Email"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <label className="label">Photo URL</label>
          <input
            name="photoURL"
            type="url"
            className={`input ${errors.photoURL ? 'border-red-500' : ''}`}
            placeholder="Photo URL"
          />
          {errors.photoURL && <p className="text-red-500 text-sm">{errors.photoURL}</p>}

          <label className="label">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`input w-full ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Password"
              required
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button type="submit" className="btn btn-neutral mt-4">Register</button>
          <button type="button" onClick={handleGoogleLogin} className="btn btn-outline mt-2">
            Register with Google
          </button>

          <p className="font-semibold text-center mt-2">
            Already Have An Account?{' '}
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