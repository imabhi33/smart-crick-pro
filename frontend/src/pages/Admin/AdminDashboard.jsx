import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import applicationService from '../../services/application.service';
import matchService from '../../services/match.service';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [filterStatus, setFilterStatus] = useState('pending');
  
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      loadData();
    }
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load applications
      const appResponse = await applicationService.getAllApplications(filterStatus);
      if (appResponse.success) {
        setApplications(appResponse.data);
      }

      // Load matches
      const matchResponse = await matchService.getAllMatches();
      if (matchResponse.success) {
        setMatches(matchResponse.data);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      const response = await applicationService.approveApplication(applicationId);
      if (response.success) {
        loadData();
        alert('Application approved successfully!');
      }
    } catch (err) {
      alert('Failed to approve application');
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await applicationService.rejectApplication(applicationId, reason);
      if (response.success) {
        loadData();
        alert('Application rejected');
      }
    } catch (err) {
      alert('Failed to reject application');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || colors.pending}`;
  };

  const getMatchStatusBadge = (status) => {
    const colors = {
      setup: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      innings1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      innings2: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return `px-3 py-1 rounded-full text-xs font-bold border ${colors[status] || colors.setup}`;
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-gray-400">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Role</div>
              <div className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-bold">
                Admin
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {applications.filter(app => app.status === 'pending').length}
            </div>
            <div className="text-gray-400 text-sm">Pending Applications</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {applications.filter(app => app.status === 'approved').length}
            </div>
            <div className="text-gray-400 text-sm">Approved Applications</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {matches.filter(match => match.status === 'innings1' || match.status === 'innings2').length}
            </div>
            <div className="text-gray-400 text-sm">Live Matches</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-primary-green mb-2">
              {matches.length}
            </div>
            <div className="text-gray-400 text-sm">Total Matches</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'applications'
                  ? 'bg-primary-blue text-white'
                  : 'hover:bg-white/10'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'matches'
                  ? 'bg-primary-blue text-white'
                  : 'hover:bg-white/10'
              }`}
            >
              Matches
            </button>
          </div>

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Match Creator Applications</h3>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary-blue"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="">All</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="text-gray-400">Loading applications...</div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <div className="text-gray-400">No applications found</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">{app.fullName}</h4>
                          <p className="text-gray-400 text-sm">{app.email}</p>
                        </div>
                        <div className={getStatusBadge(app.status)}>
                          {app.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400">Mobile</div>
                          <div className="text-white">{app.mobile}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Applied On</div>
                          <div className="text-white">{new Date(app.appliedAt).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-1">Reason</div>
                        <div className="text-white">{app.reason}</div>
                      </div>

                      {app.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(app._id)}
                            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => handleReject(app._id)}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}

                      {app.status === 'rejected' && app.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <div className="text-sm text-red-400">
                            <strong>Rejection Reason:</strong> {app.rejectionReason}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">All Matches</h3>
                <a
                  href="/scorecard"
                  className="px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-green rounded-lg font-semibold hover:scale-105 transition-transform"
                >
                  + Create New Match
                </a>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="text-gray-400">Loading matches...</div>
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🏏</div>
                  <div className="text-gray-400">No matches found</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match._id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">
                            {match.teamA.name} vs {match.teamB.name}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {match.groundName}, {match.location}
                          </p>
                        </div>
                        <div className={getMatchStatusBadge(match.status)}>
                          {match.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400">Match Date</div>
                          <div className="text-white">{new Date(match.matchDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Overs</div>
                          <div className="text-white">{match.totalOvers}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Current Score</div>
                          <div className="text-white">
                            {match.status === 'completed' ? 'Match Complete' :
                             match.status === 'setup' ? 'Not Started' :
                             `${match.currentInnings === 1 ? match.innings1?.runs : match.innings2?.runs}/${match.currentInnings === 1 ? match.innings1?.wickets : match.innings2?.wickets}`}
                          </div>
                        </div>
                      </div>

                      {/* Admin Actions */}
                      <div className="flex gap-3 pt-4 border-t border-white/10">
                        <a
                          href={`/match/${match._id}`}
                          className="px-4 py-2 bg-primary-blue hover:bg-blue-600 rounded-lg font-semibold transition-colors text-sm"
                        >
                          {match.status === 'completed' ? '👁️ View Match' : 
                           match.status === 'setup' ? '🚀 Start Match' : 
                           '📊 Manage Match'}
                        </a>
                        {match.status !== 'completed' && (
                          <a
                            href={`/match/${match._id}`}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors text-sm"
                          >
                            ✏️ Edit Scorecard
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
