const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  hostName: {
    type: String,
    required: true,
    trim: true
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
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
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for common queries
visitorSchema.index({ fullName: 1 });
visitorSchema.index({ hostName: 1 });
visitorSchema.index({ visitDate: 1 });
visitorSchema.index({ status: 1 });

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor; 