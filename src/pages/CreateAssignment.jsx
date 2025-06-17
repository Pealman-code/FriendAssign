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
    title: '', description: '', marks: '', thumbnailUrl: '', difficulty: 'Easy',
    dueDate: new Date(), userEmail: user?.email || '', userName: user?.displayName || '',
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showDescriptionMessage, setShowDescriptionMessage] = useState(false); // New state for message visibility
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters.';
    if (!formData.description || formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters.';
    if (!formData.marks || isNaN(formData.marks) || formData.marks <= 0) newErrors.marks = 'Marks must be a positive number.';
    if (!formData.thumbnailUrl || !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i.test(formData.thumbnailUrl)) newErrors.thumbnailUrl = 'Valid image URL required.';
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!formData.dueDate || new Date(formData.dueDate) < today) newErrors.dueDate = 'Due date must be today or future.';
    if (!formData.userEmail) newErrors.userEmail = 'User email required.';
    if (!formData.userName) newErrors.userName = 'User name required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Show message if description is being typed and is less than 20 characters
    if (name === 'description') {
      setShowDescriptionMessage(value.length > 0 && value.length < 20);
    }
  };

  const handleDateChange = (date) => setFormData({ ...formData, dueDate: date });

  useEffect(() => {
    if (formData.thumbnailUrl) {
      const img = new Image();
      img.onload = () => setImagePreview(formData.thumbnailUrl);
      img.onerror = () => setImagePreview(null);
      img.src = formData.thumbnailUrl;
    } else setImagePreview(null);
  }, [formData.thumbnailUrl]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, userEmail: user?.email || '', userName: user?.displayName || '' }));
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Fix form errors.' });
    try {
      const response = await fetch('https://assignment-11-server-iota-three.vercel.app/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          marks: parseInt(formData.marks),
          dueDate: formData.dueDate.toISOString(),
        }),
      });
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Assignment created!', timer: 2000, showConfirmButton: false })
          .then(() => {
            setFormData({ title: '', description: '', marks: '', thumbnailUrl: '', difficulty: 'Easy', dueDate: new Date(), userEmail: user?.email || '', userName: user?.displayName || '' });
            setImagePreview(null);
            setShowDescriptionMessage(false); // Reset message visibility
            navigate('/assignments');
          });
      } else throw new Error('Failed to create assignment');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to save assignment.' });
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto p-4">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">New Assignment</h2>
            {['userEmail', 'userName', 'title', 'description', 'marks', 'thumbnailUrl'].map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">{field === 'userEmail' ? 'User Email' : field === 'userName' ? 'User Name' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                {field === 'description' ? (
                  <>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                      placeholder="Detailed assignment description"
                      required
                    />
                    {showDescriptionMessage && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        📝 Please write a bit more! The description should be at least 20 characters long so others can clearly understand your assignment.
                      </p>
                    )}
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  </>
                ) : (
                  <input
                    type={field === 'userEmail' ? 'email' : field === 'marks' ? 'number' : field === 'thumbnailUrl' ? 'url' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={field === 'userEmail' || field === 'userName' ? undefined : handleChange}
                    readOnly={field === 'userEmail' || field === 'userName'}
                    className={`w-full p-2 border rounded ${field === 'userEmail' || field === 'userName' ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'} dark:text-gray-200 ${errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder={field === 'thumbnailUrl' ? 'https://example.com/image.jpg' : `${field.charAt(0).toUpperCase() + field.slice(1)}`}
                    required
                  />
                )}
                {errors[field] && field !== 'description' && <p className="text-red-500 text-sm">{errors[field]}</p>}
              </div>
            ))}
            <div className="mb-4 flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Due Date</label>
                <DatePicker
                  selected={formData.dueDate}
                  onChange={handleDateChange}
                  className={`w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-200 ${errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date()}
                />
                {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
              </div>
            </div>
            {imagePreview && <div className="mb-4"><img src={imagePreview} alt="Thumbnail Preview" className="w-full max-h-[150px] object-cover rounded" /></div>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">Create Assignment</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CreateAssignment;