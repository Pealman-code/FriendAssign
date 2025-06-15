import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const AllGroup = () => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch assignments from the backend
    fetch('http://localhost:3000/api/assignments')
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((error) => console.error('Error fetching assignments:', error));
  }, []);

  const handleDelete = (id) => {
    // Implement delete logic (e.g., API call to delete assignment)
    fetch(`http://localhost:3000/api/assignments/${id}`, {
      method: 'DELETE',
    })
      .then(() => setAssignments(assignments.filter((assignment) => assignment._id !== id)))
      .catch((error) => console.error('Error deleting assignment:', error));
  };

  const handleUpdate = (id) => {
    // Navigate to update page with the assignment id
    navigate(`/update-assignment/${id}`);
  };

  const handleView = (id) => {
    // Navigate to view page with the assignment id
    navigate(`/view-assignment/${id}`);
  };

  return (
    <>
     
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">All Assignments</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4 rounded-lg shadow-md">
                <img src={assignment.thumbnailUrl} alt={assignment.title} className="w-full h-48 object-cover rounded" />
                <h2 className="text-lg font-bold mt-2">{assignment.title}</h2>
                <p>Marks: {assignment.marks}</p>
                <p>Difficulty: {assignment.difficulty}</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleView(assignment._id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleUpdate(assignment._id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
    </>
  );
};

export default AllGroup;