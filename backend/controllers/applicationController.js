const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Submit application to become match creator
// @route   POST /api/applications
// @access  Private (Viewer)
const submitApplication = async (req, res) => {
  try {
    const { fullName, mobile, email } = req.body;

    // Validation
    if (!fullName || !mobile || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already has an application
    const existingApp = await Application.findOne({ userId: req.user._id });
    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application',
        data: existingApp
      });
    }

    // Check if user is already a match creator
    if (req.user.role === 'match_creator') {
      return res.status(400).json({
        success: false,
        message: 'You are already a match creator'
      });
    }

    // Create application
    const application = await Application.create({
      userId: req.user._id,
      fullName,
      mobile,
      email
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get my application status
// @route   GET /api/applications/my-status
// @access  Private
const getMyApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({ userId: req.user._id });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('userId', 'name email')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Approve application (Admin only)
// @route   PUT /api/applications/:id/approve
// @access  Private (Admin)
const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been reviewed'
      });
    }

    // Update application
    application.status = 'approved';
    application.reviewedAt = Date.now();
    application.reviewedBy = req.user._id;
    await application.save();

    // Update user role
    await User.findByIdAndUpdate(application.userId, {
      role: 'match_creator',
      mobile: application.mobile
    });

    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Reject application (Admin only)
// @route   PUT /api/applications/:id/reject
// @access  Private (Admin)
const rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been reviewed'
      });
    }

    // Update application
    application.status = 'rejected';
    application.rejectionReason = reason || 'Not specified';
    application.reviewedAt = Date.now();
    application.reviewedBy = req.user._id;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  submitApplication,
  getMyApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication
};
