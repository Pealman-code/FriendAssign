import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AllGroupDetails = () => {
  const { id } = useParams(); // Get the assignment ID from the URL
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific assignment by ID
    fetch(`http://localhost:3000/api/assignments/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Assignment not found');
        }
        return response.json();
      })
      .then((data) => {
        setAssignment(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching assignment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load assignment details. Please try again.',
        });
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner text-primary"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Assignment not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Assignment Details</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Title</h3>
              <p className="text-gray-700">{assignment.title}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700">{assignment.description}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Marks</h3>
              <p className="text-gray-700">{assignment.marks}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Difficulty</h3>
              <p className="text-gray-700">{assignment.difficulty}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Due Date</h3>
              <p className="text-gray-700">
                {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Created By</h3>
              <p className="text-gray-700">{assignment.userName || 'Anonymous'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Creator Email</h3>
              <p className="text-gray-700">{assignment.userEmail || 'N/A'}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Thumbnail</h3>
              <img
                src={assignment.thumbnailUrl}
                alt={assignment.title}
                className="w-full max-h-[300px] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllGroupDetails;