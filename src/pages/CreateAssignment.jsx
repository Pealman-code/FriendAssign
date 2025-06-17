import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/MyProvider';

const CreateAssignment = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    marks: '',
    thumbnailUrl: '',
    difficulty: 'Easy',
    dueDate: new Date(), // Default to today
    userEmail: user?.email || '',
    userName: user?.displayName || '',
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5) {
      newErrors.title = 'Title is required and must be at least 5 characters long.';
    }
    if (!formData.description || formData.description.length < 20) {
      newErrors.description = 'Description is required and must be at least 20 characters long.';
    }
    if (!formData.marks || isNaN(formData.marks) || formData.marks <= 0) {
      newErrors.marks = 'Marks must be a positive number.';
    }
    if (!formData.thumbnailUrl || !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i.test(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'A valid image URL (png, jpg, jpeg, gif) is required.';
    }
    // Check if dueDate is in the past (compare with start of today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    if (!formData.dueDate || new Date(formData.dueDate) < today) {
      newErrors.dueDate = 'Due date must be today or in the future.';
    }
    if (!formData.userEmail) {
      newErrors.userEmail = 'User email is required.';
    }
    if (!formData.userName) {
      newErrors.userName = 'User name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dueDate: date });
  };

  useEffect(() => {
    if (formData.thumbnailUrl) {
      const img = new Image();
      img.onload = () => setImagePreview(formData.thumbnailUrl);
      img.onerror = () => setImagePreview(null);
      img.src = formData.thumbnailUrl;
    } else {
      setImagePreview(null);
    }
  }, [formData.thumbnailUrl]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      userEmail: user?.email || '',
      userName: user?.displayName || '',
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form.',
      });
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          marks: parseInt(formData.marks),
          thumbnailUrl: formData.thumbnailUrl,
          difficulty: formData.difficulty,
          dueDate: formData.dueDate.toISOString(),
          userEmail: formData.userEmail,
          userName: formData.userName,
        }),
      });
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Assignment created successfully!',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          setFormData({
            title: '',
            description: '',
            marks: '',
            thumbnailUrl: '',
            difficulty: 'Easy',
            dueDate: new Date(),
            userEmail: user?.email || '',
            userName: user?.displayName || '',
          });
          setImagePreview(null);
          navigate('/assignments');
        });
      } else {
        throw new Error('Failed to create assignment');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save assignment. Please try again.',
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto p-4">
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">New Assignment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                required
              />
              {errors.userEmail && <p className="text-red-500 text-sm">{errors.userEmail}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                required
              />
              {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Assignment title"
                required
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Detailed assignment description"
                required
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${errors.marks ? 'border-red-500' : ''}`}
                  placeholder="Total marks"
                  required
                />
                {errors.marks && <p className="text-red-500 text-sm">{errors.marks}</p>}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${errors.thumbnailUrl ? 'border-red-500' : ''}`}
                placeholder="https://example.com/image.jpg"
                required
              />
              {errors.thumbnailUrl && <p className="text-red-500 text-sm">{errors.thumbnailUrl}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <DatePicker
                selected={formData.dueDate}
                onChange={handleDateChange}
                className={`w-full p-2 border rounded ${errors.dueDate ? 'border-red-500' : ''}`}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()} // Restrict to today (June 17, 2025) or future
              />
              {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
            </div>
            {imagePreview && (
              <div className="mb-4">
                <img src={imagePreview} alt="Thumbnail Preview" className="w-full max-h-[150px] object-cover rounded" />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create Assignment
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CreateAssignment;