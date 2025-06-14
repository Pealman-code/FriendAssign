import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../provider/MyProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const MyGroup = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch groups for the logged-in user
  useEffect(() => {
    if (user) {
      const fetchGroups = async () => {
        try {
          const response = await axios.get('https://assignment-ten-server-olive.vercel.app/groups', {
            params: { email: user.email }
          });
          if (response.data.success) {
            setGroups(response.data.data);
          } else {
            Swal.fire('Error', response.data.message || 'Failed to fetch groups', 'error');
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
          Swal.fire('Error', 'Failed to fetch groups. Please try again.', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchGroups();
    }
  }, [user]);

  // Handle delete group
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://assignment-ten-server-olive.vercel.app/groups/${id}`);
        if (response.data.success) {
          setGroups(groups.filter(group => group._id !== id));
          Swal.fire('Deleted!', 'Group has been deleted.', 'success');
        } else {
          Swal.fire('Error', response.data.message || 'Failed to delete group', 'error');
        }
      } catch (error) {
        console.error('Error deleting group:', error);
        Swal.fire('Error', 'Failed to delete group. Please try again.', 'error');
      }
    }
  };

  // Handle update
  const handleUpdate = (id) => {
    navigate(`/auth/updateGroup/${id}`);
  };

  // Show loading state
  if (loading || isLoading) {
    return <div className="flex justify-center items-center h-screen"><div className="loading loading-spinner text-primary"></div></div>;
  }

  // Ensure user is authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        My Groups
      </h1>
      {groups.length === 0 ? (
        <p className="text-center text-gray-600">No groups found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow-lg rounded-lg min-w-[600px]">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-xs sm:text-sm">
                <th className="p-2 sm:p-3 text-center">Image</th>
                <th className="p-2 sm:p-3">Group Name</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Hobby Category</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">Description</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Meeting Location</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Max Members</th>
                <th className="p-2 sm:p-3 hidden sm:table-cell">Start Date</th>
                <th className="p-2 sm:p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group._id} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="p-2 sm:p-3">
                    <img
                      src={group.imageUrl}
                      alt={group.groupName}
                      className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded mx-auto"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                    />
                  </td>
                  <td className="p-2 sm:p-3">{group.groupName}</td>
                  <td className="p-2 sm:p-3 hidden md:table-cell">{group.hobbyCategory}</td>
                  <td className="p-2 sm:p-3 hidden lg:table-cell">{group.description}</td>
                  <td className="p-2 sm:p-3 hidden md:table-cell">{group.meetingLocation}</td>
                  <td className="p-2 sm:p-3 hidden sm:table-cell">{group.maxMembers}</td>
                  <td className="p-2 sm:p-3 hidden sm:table-cell">
                    {new Date(group.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        onClick={() => handleUpdate(group._id)}
                        className="btn btn-xs sm:btn-sm btn-primary bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="btn btn-xs sm:btn-sm btn-error bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyGroup;