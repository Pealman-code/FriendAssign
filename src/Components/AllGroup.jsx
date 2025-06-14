import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/MyProvider';
import Swal from 'sweetalert2';
import axios from 'axios';

const AllGroup = () => {
  const [groupsData, setGroupsData] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('https://assignment-ten-server-olive.vercel.app/groups');
        if (response.data.success) {
          setGroupsData(response.data.data);
        } else {
          console.error('Failed to fetch groups:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        Swal.fire('Error', 'Failed to load groups. Please try again.', 'error');
      }
    };

    fetchGroups();
  }, [user]);

  const handleViewMore = (id) => {
    if (!user) {
      Swal.fire({
        title: 'Please Log In',
        text: 'You need to log in first to view more details.',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/auth/login?redirect=/auth/services/${id}`);
        }
      });
    } else {
      navigate(`/auth/services/${id}`);
    }
  };

  return (
    <div className="p-20">
      <p className="text-4xl text-center font-bold mb-4">Featured Groups Section</p>
      <p className="text-xl text-center mb-8">Join your favorite group</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto p-2">
        {groupsData.map((group) => (
          <div key={group._id} className="bg-white shadow-lg rounded-lg p-6 w-full">
            <img
              src={group.imageUrl}
              alt={group.groupName}
              className="w-full h-58 object-cover rounded-lg mb-2"
            />
            <h3 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors duration-200">
              {group.groupName}
            </h3>
            <p className="text-gray-500 mb-1">{group.hobbyCategory}</p>
            <p className="text-sm text-gray-500 mb-1">Location: {group.meetingLocation}</p>
            <p className="text-sm text-gray-500 mb-1">Max Members: {group.maxMembers}</p>
            <p className="text-sm text-gray-500 font-bold hover:text-red-500 mb-6">Start Date: {group.startDate}</p>
            <button
              className="geneva btn btn-soft btn-primary"
              onClick={() => handleViewMore(group._id)}
            >
              View More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGroup;