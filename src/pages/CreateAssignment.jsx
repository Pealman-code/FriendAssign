import React, { useState, useEffect, useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/MyProvider';

const CreateAssignment = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    marks: '',
    thumbnailUrl: '',
    difficulty: 'Easy',
    dueDate: new Date(),
    userEmail: user?.email || '', // Pre-populate with user's email
    userName: user?.displayName || '', // Pre-populate with user's display name
  });

  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

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
    // Update formData with user info when user changes
    setFormData((prev) => ({
      ...prev,
      userEmail: user?.email || '',
      userName: user?.displayName || '',
    }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.marks ||
      !formData.thumbnailUrl ||
      !imagePreview ||
      formData.description.length < 20 ||
      !formData.userEmail ||
      !formData.userName
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields, provide a valid image URL for the thumbnail, ensure the description is at least 20 characters long, and ensure user email and name are present.',
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
          userEmail: formData.userEmail, // Include user email
          userName: formData.userName, // Include user name
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
            {/* User Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User Email</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                placeholder="User email"
                required
              />
            </div>
            {/* User Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">User Name</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                placeholder="User name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${formData.title ? 'bg-white' : ''}`}
                placeholder="Assignment title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${formData.description ? 'bg-white' : ''}`}
                placeholder="Detailed assignment description"
                required
              />
              {formData.description.length < 20 && formData.description.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  📝 Please write a bit more! The description should be at least 20 characters long so others can clearly understand your assignment.
                </p>
              )}
            </div>
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1">Marks</label>
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${formData.marks ? 'bg-white' : ''}`}
                  placeholder="Total marks"
                  required
                />
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
                className={`w-full p-2 border rounded ${formData.thumbnailUrl ? 'bg-white' : ''}`}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <DatePicker
                selected={formData.dueDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded"
                dateFormat="MMMM d, yyyy"
              />
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