import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../provider/MyProvider';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateGroup = () => {
  const { user, loading } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    groupName: '',
    hobbyCategory: '',
    description: '',
    meetingLocation: '',
    maxMembers: '',
    startDate: '',
    imageUrl: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const hobbyCategories = [
    'Drawing & Painting',
    'Photography',
    'Video Gaming',
    'Fishing',
    'Running',
    'Cooking',
    'Reading',
    'Writing',
  ];

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get('https://assignment-ten-server-olive.vercel.app/groups', {
          params: { email: user.email },
        });
        if (response.data.success) {
          const group = response.data.data.find((g) => g._id === id);
          if (!group) {
            Swal.fire('Error', 'Group not found', 'error');
            navigate('/auth/my-group');
            return;
          }
          const groupData = {
            groupName: group.groupName,
            hobbyCategory: group.hobbyCategory,
            description: group.description,
            meetingLocation: group.meetingLocation,
            maxMembers: group.maxMembers,
            startDate: group.startDate.split('T')[0], // Format for date input
            imageUrl: group.imageUrl,
          };
          setFormData(groupData);
          setOriginalData(groupData);
        } else {
          Swal.fire('Error', response.data.message || 'Failed to fetch group', 'error');
        }
      } catch (error) {
        console.error('Error fetching group:', error);
        Swal.fire('Error', 'Failed to fetch group. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchGroup();
  }, [user, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const updatedData = { ...formData, [name]: value };
    const hasChanged = Object.keys(updatedData).some(
      (key) => updatedData[key] !== originalData[key]
    );
    setIsFormChanged(hasChanged);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.groupName ||
      !formData.hobbyCategory ||
      !formData.description ||
      !formData.meetingLocation ||
      !formData.maxMembers ||
      !formData.startDate ||
      !formData.imageUrl
    ) {
      Swal.fire('Error', 'Please fill in all required fields!', 'error');
      return;
    }

    if (isNaN(formData.maxMembers) || formData.maxMembers <= 0) {
      Swal.fire('Error', 'Max Members must be a positive number!', 'error');
      return;
    }

    const groupData = {
      ...formData,
      maxMembers: parseInt(formData.maxMembers),
    };

    try {
      const response = await axios.patch(`https://assignment-ten-server-olive.vercel.app/groups/${id}`, groupData);
      if (response.data.success) {
        Swal.fire({
          title: 'Success',
          text: 'Group updated successfully!',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        navigate('/auth/my-group');
      } else {
        Swal.fire('Error', response.data.message || 'Failed to update group', 'error');
      }
    } catch (error) {
      console.error('Error updating group:', error);
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Failed to update group. Please try again.',
        'error'
      );
    }
  };

  if (loading || isLoading) {
    return <div className="loading loading-spinner text-primary"></div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 lg:px-12">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Update Group
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-lg rounded-lg p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="groupName">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="hobbyCategory">
              Hobby Category
            </label>
            <select
              id="hobbyCategory"
              name="hobbyCategory"
              value={formData.hobbyCategory}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {hobbyCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="meetingLocation">
              Meeting Location
            </label>
            <input
              type="text"
              id="meetingLocation"
              name="meetingLocation"
              value={formData.meetingLocation}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter meeting location"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="maxMembers">
              Max Members
            </label>
            <input
              type="number"
              id="maxMembers"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter maximum number of members"
              min="1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="imageUrl">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="userName">
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={user?.displayName || 'Anonymous'}
              className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="userEmail">
              User Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={user?.email || 'N/A'}
              className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
              readOnly
            />
          </div>
        </div>

        {/* Description (Full Width) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Describe your group"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={!isFormChanged}
            className={`btn btn-primary w-full md:w-1/2 px-6 py-3 text-white rounded-md transition-colors duration-300 ${isFormChanged ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Update Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateGroup;