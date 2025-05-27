// controllers/visitorController.js
const Visitor = require('../models/Visitor');
const { generateExitCode } = require('../utils/exitCodeGenerator');
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  purpose: { type: String, required: true },
  hostName: { type: String, required: true },
  company: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  modeOfEntry: { type: String, required: true },
  visitDate: { type: Date, required: true },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date, default: null },
  status: { type: String, enum: ['checked-in', 'checked-out'], default: 'checked-in' },
  exitCode: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);

// Register a new visitor
exports.registerVisitor = async (req, res) => {
  try {
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    
    const {
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate
    } = req.body;

    console.log('Extracted field values:', {
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate
    });

    // Generate a unique exit code
    const exitCode = generateExitCode();

    const visitor = new Visitor({
      fullName,
      phoneNumber,
      email,
      purpose,
      hostName,
      company,
      vehicleNumber,
      modeOfEntry,
      visitDate,
      exitCode,
      checkInTime: new Date(),
      status: 'checked-in'
    });

    console.log('Visitor object to save:', JSON.stringify(visitor, null, 2));
    
    await visitor.save();
    console.log('Visitor saved successfully');

    res.status(201).json({
      success: true,
      data: {
        visitor,
        exitCode
      },
      message: 'Visitor registered successfully'
    });
  } catch (error) {
    console.error('Error registering visitor:', error);
    console.error('Error details:', error.message);
    
    // If it's a validation error, log more details
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message
      })));
    }
    
    res.status(400).json({
      success: false,
      message: 'Error registering visitor',
      error: error.message
    });
  }
};

// Get all visitors with optional filtering
exports.getAllVisitors = async (req, res) => {
  try {
    const { search, status, host, startDate, endDate } = req.query;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (host) {
      query.hostName = { $regex: host, $options: 'i' };
    }
    
    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = new Date(startDate);
      if (endDate) query.visitDate.$lte = new Date(endDate);
    }
    
    const visitors = await Visitor.find(query)
      .sort({ visitDate: -1, checkInTime: -1 });
    
    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Check out a visitor
exports.checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }
    
    if (visitor.status === 'checked-out') {
      return res.status(400).json({
        success: false,
        error: 'Visitor is already checked out'
      });
    }
    
    visitor.status = 'checked-out';
    visitor.checkOutTime = new Date();
    await visitor.save();
    
    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: 'Visitor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get unique hosts
exports.getUniqueHosts = async (req, res) => {
  try {
    const hosts = await Visitor.distinct('hostName');
    res.status(200).json({
      success: true,
      data: hosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get visitor statistics
exports.getVisitorStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    const checkedInVisitors = await Visitor.countDocuments({ status: 'checked-in' });
    const checkedOutVisitors = await Visitor.countDocuments({ status: 'checked-out' });
    
    // Get today's visitors
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({
      visitDate: { $gte: today }
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        checkedInVisitors,
        checkedOutVisitors,
        todayVisitors
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};