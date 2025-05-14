const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    trim: true,
    lowercase: true
  },
  purpose: {
    type: String,
    required: [true, 'Please provide purpose of visit'],
    trim: true
  },
  hostName: {
    type: String,
    required: [true, 'Please provide host name'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  visitDate: {
    type: Date,
    required: [true, 'Please provide visit date']
  },
  modeOfEntry: {
    type: String,
    required: [true, 'Please provide mode of entry'],
    enum: ['Walk-in', 'Van', 'Lorry', 'Car', 'Bike']
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in'
  },
  exitCode: {
    type: String,
    required: true,
    unique: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for common queries
visitorSchema.index({ fullName: 1 });
visitorSchema.index({ phoneNumber: 1 });
visitorSchema.index({ visitDate: 1 });
visitorSchema.index({ status: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor; 