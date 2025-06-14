import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/MyProvider';
import axios from 'axios';

const AllGroupDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
    if (joinedGroups.includes(id)) {
      setHasJoined(true);
    }

    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`https://assignment-ten-server-olive.vercel.app/groups/${id}`);
        if (response.data.success) {
          const dbGroup = response.data.data;
          setGroup({
            name: dbGroup.groupName,
            image: dbGroup.imageUrl,
            category: dbGroup.hobbyCategory,
            description: dbGroup.description,
            location: dbGroup.meetingLocation,
            max_members: dbGroup.maxMembers,
            start_date: dbGroup.startDate,
          });
        } else {
          setError('Group not found');
        }
      } catch (error) {
        console.error('Error loading group details:', error);
        setError('Error loading group details');
      } finally {
        setLoading(false);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`https://assignment-ten-server-olive.vercel.app/feedbacks/${id}`);
        if (response.data.success) {
          setFeedbacks(response.data.data);
        }
      } catch (error) {
        console.error('Error loading feedbacks:', error);
      }
    };

    fetchGroupDetails();
    fetchFeedbacks();
  }, [id]);

  const handleJoinGroup = () => {
    if (hasJoined) {
      Swal.fire({
        icon: 'warning',
        title: 'Already Joined',
        text: 'You have already joined this group!',
        confirmButtonText: 'OK',
      });
      return;
    }

    setHasJoined(true);
    const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
    joinedGroups.push(id);
    localStorage.setItem('joinedGroups', JSON.stringify(joinedGroups));

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `You have successfully joined ${group.name}!`,
      confirmButtonText: 'OK',
    });
  };

  const handleLeaveGroup = () => {
    const joinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
    const updatedGroups = joinedGroups.filter(groupId => groupId !== id);
    localStorage.setItem('joinedGroups', JSON.stringify(updatedGroups));
    setHasJoined(false);

    Swal.fire({
      icon: 'success',
      title: 'Left Group',
      text: `You have successfully left ${group.name}!`,
      confirmButtonText: 'OK',
    });
  };

  const handleFeedbackSubmit = async () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to submit feedback.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!feedback.trim()) {
      setFeedbackError('Feedback cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`https://assignment-ten-server-olive.vercel.app/feedbacks/${id}`, {
        feedback,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || 'https://via.placeholder.com/40',
        groupId: id,
      });

      if (response.data.success) {
        setFeedbacks([response.data.data, ...feedbacks]); // Add new feedback at the top
        setFeedback('');
        setFeedbackError('');
        Swal.fire({
          icon: 'success',
          title: 'Feedback Submitted',
          text: 'Your feedback has been added successfully!',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit feedback.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleLikeFeedback = async (feedbackId) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Not Logged In',
        text: 'Please log in to like feedback.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.post(`https://assignment-ten-server-olive.vercel.app/feedbacks/${feedbackId}/like`, {
        userId: user.uid,
      });

      if (response.data.success) {
        setFeedbacks(
          feedbacks.map((fb) =>
            fb._id === feedbackId
              ? { ...fb, likes: response.data.data.likes, likedBy: response.data.data.likedBy }
              : fb
          )
        );
      }
    } catch (error) {
      console.error('Error liking feedback:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to like feedback.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleUpdateFeedback = async (feedbackId, currentFeedback) => {
    const { value: updatedFeedback } = await Swal.fire({
      title: 'Update Feedback',
      input: 'textarea',
      inputLabel: 'Your Feedback',
      inputValue: currentFeedback,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    });

    if (updatedFeedback && updatedFeedback.trim()) {
      try {
        const response = await axios.patch(`https://assignment-ten-server-olive.vercel.app/feedbacks/${feedbackId}`, {
          feedback: updatedFeedback,
        });

        if (response.data.success) {
          setFeedbacks(
            feedbacks.map((fb) =>
              fb._id === feedbackId ? { ...fb, feedback: updatedFeedback } : fb
            )
          );
          Swal.fire({
            icon: 'success',
            title: 'Feedback Updated',
            text: 'Your feedback has been updated successfully!',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error('Error updating feedback:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update feedback.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this feedback?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://assignment-ten-server-olive.vercel.app/feedbacks/${feedbackId}`);
        if (response.data.success) {
          setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId));
          Swal.fire({
            icon: 'success',
            title: 'Feedback Deleted',
            text: 'Your feedback has been deleted successfully!',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete feedback.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const isGroupActive = () => {
    if (!group) return false;
    const today = new Date();
    const startDate = new Date(group.start_date);
    return startDate >= today;
  };

  if (loading) return <div className="p-24 text-center">Loading...</div>;
  if (error) return <div className="p-24 text-center text-red-500">{error}</div>;

  return (
    <div className="p-24 max-w-4xl mx-auto">
      <div className="bg-gray-100 p-6 rounded-lg mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Group Details</h1>
        <p className="text-gray-600 mt-2">Discover more about this group</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
      <img
        src={group.image}
        alt={group.name}
        className="w-full max-h-92 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-500 mb-2">
        <strong>Category:</strong> {group.category}
      </p>
      <p className="text-gray-500 mb-2">
        <strong>Description:</strong> {group.description}
      </p>
      <p className="text-gray-500 mb-2">
        <strong>Location:</strong> {group.location}
      </p>
      <p className="text-gray-500 mb-2">
        <strong>Max Members:</strong> {group.max_members}
      </p>
      <p className="text-gray-500 mb-6">
        <strong>Start Date:</strong> {group.start_date}
      </p>

      {isGroupActive() ? (
        <div className="mb-8 flex space-x-4">
          <button
            onClick={handleJoinGroup}
            className={`px-4 py-2 rounded-md text-white ${hasJoined ? 'bg-gray-400 cursor-not-allowed' : 'btn btn-success'
              }`}
            disabled={hasJoined}
          >
            {hasJoined ? 'Already Joined' : 'Join Group'}
          </button>
          {hasJoined && (
            <button
              onClick={handleLeaveGroup}
              className="btn btn-active btn-error"
            >
              Leave Group
            </button>
          )}
        </div>
      ) : (
        <p className="text-red-600 font-semibold mb-8">
          This group is no longer active.
        </p>
      )}

      <div className="mb-8">
        <Link to="/">
          <button className="btn btn-info mb-4">Back to Home</button>
        </Link>
        <h3 className="text-xl font-semibold mb-4">Add Your Feedback</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
              Feedback
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="4"
              placeholder="Write your feedback here..."
            />
          </div>
          {feedbackError && (
            <p className="text-red-500 text-sm">{feedbackError}</p>
          )}
          <button
            onClick={handleFeedbackSubmit}
            className="btn btn-active btn-primary"
          >
            Submit Feedback
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Feedback</h3>
        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback yet.</p>
        ) : (
          <ul className="space-y-4">
            {feedbacks.map((fb) => (
              <li key={fb._id} className="border-b pb-4 flex items-start space-x-4 relative">
                <img
                  src={fb.userPhoto}
                  alt={fb.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800 font-semibold">{fb.userName}</p>
                    {user && user.uid === fb.userId && (
                      <div className="relative group">
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01"></path>
                          </svg>
                        </button>
                        <div className="absolute right-0  w-32 bg-white border rounded-md shadow-lg hidden group-hover:block">
                          <button
                            onClick={() => handleUpdateFeedback(fb._id, fb.feedback)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(fb._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600">{fb.feedback}</p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() => handleLikeFeedback(fb._id)}
                      className={`text-sm mr-2 ${fb.likedBy?.includes(user?.uid) ? 'text-blue-600' : 'text-gray-600'
                        }`}
                    >
                      Like
                    </button>
                    <span className="text-sm text-gray-500">{fb.likes || 0} Likes</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllGroupDetails;