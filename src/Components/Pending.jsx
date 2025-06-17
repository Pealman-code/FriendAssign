import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { AuthContext } from '../provider/MyProvider';

const Pending = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [markData, setMarkData] = useState({ obtainedMarks: '', feedback: '' });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetch('http://localhost:3000/api/submissions/pending')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load submissions.' });
        setLoading(false);
      });
  }, []);

  const openMarkModal = (submission) => {
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please log in to mark submissions.' });
      navigate('/auth/login');
      return;
    }
    setSelectedSubmission(submission);
    setMarkData({ obtainedMarks: '', feedback: '' });
    setIsModalOpen(true);
  };

  const closeMarkModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleMarkInputChange = (e) => setMarkData({ ...markData, [e.target.name]: e.target.value });

  const handleMarkSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please log in to mark submissions.' });
      navigate('/auth/login');
      return;
    }
    if (!markData.obtainedMarks || isNaN(markData.obtainedMarks) || markData.obtainedMarks < 0) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Enter valid marks.' });
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/submissions/${selectedSubmission._id}/mark`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...markData, userEmail: user.email }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to mark submission');
      Swal.fire({ icon: 'success', title: 'Success', text: 'Submission marked!' });
      setSubmissions(submissions.filter((sub) => sub._id !== selectedSubmission._id));
      closeMarkModal();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to mark submission.' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-20 pb-20">
        <div className="container mx-auto p-4">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Pending Assignments</h2>
          {submissions.length === 0 ? (
            <p className="text-center text-gray-600">No pending assignments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Assignment Title</th>
                    <th className="py-3 px-6 text-left">Total Marks</th>
                    <th className="py-3 px-6 text-left">Examinee Name</th>
                    <th className="py-3 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {submissions.map((submission) => (
                    <tr key={submission._id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{submission.title}</td>
                      <td className="py-3 px-6 text-left">{submission.marks}</td>
                      <td className="py-3 px-6 text-left">{submission.userName}</td>
                      <td className="py-3 px-6 text-center">
                        {user?.email === submission.userEmail ? (
                          <span className="text-gray-600">Your Submission</span>
                        ) : (
                          <button
                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            onClick={() => openMarkModal(submission)}
                          >
                            Give Mark
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Mark Submission</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Google Docs Link</label>
                <a
                  href={selectedSubmission.googleDocsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {selectedSubmission.googleDocsLink}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <p className="mt-1 text-gray-600">{selectedSubmission.notes || 'No notes provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Marks Obtained</label>
                <input
                  type="number"
                  name="obtainedMarks"
                  value={markData.obtainedMarks}
                  onChange={handleMarkInputChange}
                  placeholder="Enter marks"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  name="feedback"
                  value={markData.feedback}
                  onChange={handleMarkInputChange}
                  placeholder="Enter feedback"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                  onClick={closeMarkModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  onClick={handleMarkSubmit}
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

export default Pending;