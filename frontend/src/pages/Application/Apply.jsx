import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import applicationService from '../../services/application.service';

const Apply = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      checkApplicationStatus();
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        fullName: user?.name || '',
        email: user?.email || ''
      }));
    } else {
      setCheckingStatus(false);
    }
  }, [user, isAuthenticated]);

  const checkApplicationStatus = async () => {
    try {
      const response = await applicationService.getMyStatus();
      if (response.success) {
        setApplicationStatus(response.data);
      }
    } catch (err) {
      // No application found - user can apply
      setApplicationStatus(null);
    }
    setCheckingStatus(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await applicationService.submitApplication(formData);
      if (response.success) {
        setSuccess('Application submitted successfully!');
        setApplicationStatus(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    }
    
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'approved': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'rejected': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📋</div>
          <div className="text-xl font-bold gradient-text">Checking Application Status...</div>
        </div>
      </div>
    );
  }

  // Show login prompt for non-authenticated users
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full glass-effect rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Login Required</h2>
          <p className="text-gray-400 mb-6">Please login or create an account to apply for Match Creator role</p>
          <div className="flex flex-col gap-3">
            <a
              href="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Login Now
            </a>
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show application status if exists
  if (applicationStatus) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="glass-effect rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{getStatusIcon(applicationStatus.status)}</div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Application Status</h2>
              <p className="text-gray-400">Your Match Creator application details</p>
            </div>

            <div className={`p-6 rounded-xl border mb-6 ${getStatusColor(applicationStatus.status)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2 capitalize">{applicationStatus.status}</div>
                <div className="text-sm opacity-80">
                  Applied on: {new Date(applicationStatus.appliedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <div className="text-white font-medium">{applicationStatus.fullName}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mobile</label>
                  <div className="text-white font-medium">{applicationStatus.mobile}</div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <div className="text-white font-medium">{applicationStatus.email}</div>
              </div>
            </div>

            {applicationStatus.status === 'rejected' && applicationStatus.rejectionReason && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="text-sm text-red-400">
                  <strong>Rejection Reason:</strong> {applicationStatus.rejectionReason}
                </div>
              </div>
            )}

            {applicationStatus.status === 'approved' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-green-400 font-bold mb-2">🎉 Congratulations!</div>
                  <div className="text-sm text-green-400">
                    Your application has been approved. You can now create and manage matches!
                  </div>
                </div>
              </div>
            )}

            {applicationStatus.status === 'pending' && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-yellow-400 font-bold mb-2">⏳ Under Review</div>
                  <div className="text-sm text-yellow-400">
                    Your application is being reviewed by our admin team. Please wait for approval.
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <a
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show application form
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-effect rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Apply for Match Creator</h2>
            <p className="text-gray-400">Submit your application to create and manage cricket matches</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Reason for Organizing Matches *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue transition-colors resize-none"
                placeholder="Tell us why you want to organize cricket matches (e.g., local tournament, club matches, etc.)"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="text-sm text-blue-400">
                <strong>Note:</strong> After submitting your application, it will be reviewed by our admin team. 
                You'll be notified once your application is approved or if additional information is needed.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
