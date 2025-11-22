import React, { useState, useEffect } from 'react';
import { PendingSubmission } from '../types';
import { BabyIcon, SparklesIcon } from '../components/Icons';

export const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submissions, setSubmissions] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadPendingSubmissions(token);
    }
  }, []);

  const handleLogin = () => {
    if (!password) {
      setAuthError('Please enter password');
      return;
    }

    // Store password as token for API calls
    sessionStorage.setItem('admin_token', password);
    setIsAuthenticated(true);
    setAuthError('');
    loadPendingSubmissions(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setPassword('');
    setSubmissions([]);
  };

  const loadPendingSubmissions = async (token: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setAuthError('Invalid password');
        sessionStorage.removeItem('admin_token');
        setIsAuthenticated(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load submissions');
      }

      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      alert('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: string, result: 'Boy' | 'Girl') => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) return;

    setReviewingId(submissionId);

    try {
      const response = await fetch('/api/admin/review', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          result,
          reviewerName: 'Admin', // You can customize this
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Remove from list
      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
      alert(`Review submitted: ${result}`);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewingId(null);
    }
  };

  const handleRefresh = () => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      loadPendingSubmissions(token);
    }
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
              <BabyIcon className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-3xl font-serif italic text-gray-800 mb-2">NubHub Admin</h1>
            <p className="text-gray-500 text-sm">Manual Review Dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none transition-colors"
              />
              {authError && (
                <p className="mt-2 text-sm text-red-500">{authError}</p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gray-900 text-white font-medium py-3 rounded-xl hover:bg-black transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-indigo-100 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif italic text-gray-800 flex items-center gap-3">
            <BabyIcon className="w-8 h-8 text-rose-500" />
            NubHub Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {submissions.length} pending review{submissions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all flex items-center gap-2"
          >
            <SparklesIcon className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && submissions.length === 0 && (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-serif italic text-gray-800 mb-2">All caught up!</h2>
          <p className="text-gray-500">No submissions pending review at the moment.</p>
        </div>
      )}

      {/* Submissions Grid */}
      {!loading && submissions.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={submission.imageUrl}
                  alt="Ultrasound scan"
                  className="w-full h-full object-contain"
                />
                {submission.aiResult && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-purple-500/90 text-white text-xs font-bold rounded-full">
                    AI: {submission.aiResult} ({submission.aiConfidence}%)
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-800 truncate">{submission.email}</p>
                </div>

                {submission.aiReasoning && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium mb-1">AI Analysis</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{submission.aiReasoning}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs text-gray-400">
                    Submitted: {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReview(submission.id, 'Boy')}
                    disabled={reviewingId === submission.id}
                    className="py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {reviewingId === submission.id ? 'Submitting...' : '👶 Boy'}
                  </button>
                  <button
                    onClick={() => handleReview(submission.id, 'Girl')}
                    disabled={reviewingId === submission.id}
                    className="py-3 px-4 bg-pink-500 text-white rounded-xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    {reviewingId === submission.id ? 'Submitting...' : '👶 Girl'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
