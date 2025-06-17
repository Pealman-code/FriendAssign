import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/MyProvider'; // Import AuthContext
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const AllGroupDetails = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submission, setSubmission] = useState({
    googleDocsLink: '',
    notes: ''
  });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get user from AuthContext

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/assignments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assignment details');
        }
        const data = await response.json();
        setAssignment(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assignment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load assignment details. Please try again.',
        });
        setLoading(false);
        navigate('/assignments');
      }
    };

    fetchAssignment();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubmission((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'You must be logged in to submit an assignment.',
      });
      navigate('/auth/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/assignments/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...submission,
          userEmail: user.email,
          userName: user.displayName || 'Anonymous'
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit assignment');
      }
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Assignment submitted successfully!',
      });
      setIsModalOpen(false);
      setSubmission({ googleDocsLink: '', notes: '' });
      navigate('/auth/pending-assignments'); // Redirect to pending page
    } catch (error) {
      console.error('Error submitting assignment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit assignment. Please try again.',
      });
    }
  };

  const openModal = () => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to submit an assignment.',
      });
      navigate('/auth/login');
      return;
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No assignment found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto p-4">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{assignment.title}</h2>
            <img
              src={assignment.thumbnailUrl}
              alt={assignment.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
            <p className="text-sm text-gray-600 mb-2">
              <span
                className={
                  assignment.difficulty === 'Medium'
                    ? 'text-yellow-600'
                    : assignment.difficulty === 'Hard'
                    ? 'text-red-600'
                    : 'text-green-600'
                }
              >
                Difficulty: {assignment.difficulty}
              </span>
            </p>
            <p className="text-sm text-gray-600 mb-2">Marks: {assignment.marks || 'Not specified'}</p>
            <p className="text-sm text-gray-600 mb-2">
              Due Date: {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Description</h3>
            <p className="text-gray-700 mb-4">{assignment.description}</p>
            <div className="flex space-x-4">
              <button
                className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                onClick={() => navigate('/assignments')}
              >
                Back to Assignments
              </button>
              <button
                className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                onClick={openModal}
              >
                Take Assignment
              </button>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Submit Assignment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Google Docs Link</label>
                <input
                  type="url"
                  name="googleDocsLink"
                  value={submission.googleDocsLink}
                  onChange={handleInputChange}
                  placeholder="https://docs.google.com/..."
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={submission.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes here..."
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default AllGroupDetails;