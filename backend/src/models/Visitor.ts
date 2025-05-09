import mongoose from 'mongoose';

export interface IVisitor extends mongoose.Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  hostName: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  status: 'checked-in' | 'checked-out';
  visitDate: Date;
  exitCode: string;
}

const visitorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    trim: true,
    lowercase: true,
  },
  purpose: {
    type: String,
    required: [true, 'Please provide purpose of visit'],
    trim: true,
  },
  hostName: {
    type: String,
    required: [true, 'Please provide host name'],
    trim: true,
  },
  checkInTime: {
    type: Date,
    default: Date.now,
  },
  checkOutTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out'],
    default: 'checked-in',
  },
  visitDate: {
    type: Date,
    required: [true, 'Please provide visit date'],
  },
  exitCode: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IVisitor>('Visitor', visitorSchema); 