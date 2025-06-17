import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/MyProvider';

const AllGroup = () => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch('http://localhost:3000/api/assignments')
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((error) => console.error('Error fetching assignments:', error));
  }, []);

  const groupedAssignments = [];
  for (let i = 0; i < assignments.length; i += 3) {
    groupedAssignments.push(assignments.slice(i, i + 3));
  }

  const handleViewClick = (id) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to view assignment details.',
      });
      navigate('/auth/login'); // Redirect to login page
      return;
    }
    navigate(`/auth/services/${id}`);
  };

  const handleEditClick = (id) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to edit assignments.',
      });
      return;
    }
    // Fetch assignment to check ownership
    fetch(`http://localhost:3000/api/assignments/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.userEmail !== user.email) {
          Swal.fire({
            icon: 'error',
            title: 'Unauthorized',
            text: 'You can only edit your own assignments.',
          });
          return;
        }
        navigate(`/auth/updateGroup/${id}`);
      })
      .catch((error) => {
        console.error('Error checking assignment ownership:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to verify assignment ownership.',
        });
      });
  };

  const handleDeleteClick = async (id) => {
  if (!user) {
    Swal.fire({
      icon: 'error',
      title: 'Not Logged In',
      text: 'Please log in to delete assignments.',
    });
    return;
  }

  // Fetch assignment to check ownership
  try {
    const response = await fetch(`http://localhost:3000/api/assignments/${id}`);
    const data = await response.json();

    if (data.userEmail !== user.email) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You can only delete your own assignments.',
      });
      return;
    }

    // Show confirmation only if user is authorized
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this assignment? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const deleteResponse = await fetch(`http://localhost:3000/api/assignments/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: user.email }),
        });

        const deleteData = await deleteResponse.json();

        if (deleteResponse.ok) {
          setAssignments(assignments.filter((assignment) => assignment._id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Assignment has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: deleteData.message || 'Failed to delete assignment.',
          });
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting the assignment.',
        });
      }
    }
  } catch (error) {
    console.error('Error checking assignment ownership:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to verify assignment ownership.',
    });
  }
};
  return (
    <div className="mt-24 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2 text-center">All Assignments</h2>
      <p className="text-sm text-gray-300 mb-6 text-center">
        Browse through the list of available assignments and join the ones that interest you!
      </p>
      <div className="w-full max-w-7xl">
        {groupedAssignments.map((group, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4">
            {group.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 p-5 rounded-lg shadow-md text-white w-full max-w-md"
              >
                <img
                  src={assignment.thumbnailUrl}
                  alt={assignment.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-300 hover:text-blue-500 transition-colors">
                    {assignment.title}
                  </h3>
                  <p className="text-sm mt-1">
                    <span
                      className={
                        assignment.difficulty === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }
                    >
                      ● {assignment.difficulty}
                    </span>
                  </p>
                  <p className="text-sm mt-1">By: {assignment.userName || 'Anonymous'}</p>
                  <p className="text-base mt-2 font-bold text-gray-300 hover:text-white transition-colors">
                    Marks: {assignment.marks || 0}
                  </p>
                </div>
                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    className="text-white hover:text-blue-300 relative group cursor-pointer"
                    title="View"
                    onClick={() => handleViewClick(assignment._id)}
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5c-4.136 0-7.5 3.364-7.5 7.5s3.364 7.5 7.5 7.5 7.5-3.364 7.5-7.5-3.364-7.5-7.5-7.5zm0 13c-3.308 0-6-2.692-6-6s2.692-6 6-6 6 2.692 6 6-2.692 6-6 6z" />
                      <path d="M12 8a1 1 0 00-1 1v4a1 1 0 001 1h.005a1 1 0 001-1V9a1 1 0 00-1-1z" />
                    </svg>
                    <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      View
                    </span>
                  </button>
                  <button
                    className="text-white hover:text-yellow-300 relative group cursor-pointer"
                    title="Edit"
                    onClick={() => handleEditClick(assignment._id)}
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      Edit
                    </span>
                  </button>
                  <button
                    className="text-white hover:text-red-300 relative group cursor-pointer"
                    title="Delete"
                    onClick={() => handleDeleteClick(assignment._id)}
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-4.5z" />
                    </svg>
                    <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGroup;