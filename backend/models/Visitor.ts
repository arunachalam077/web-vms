import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  purpose: string;
  hostName: string;
  modeOfEntry: string;
  company: string;
  vehicleNumber: string;
  visitDate: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  status: string;
  exitCode: string;
}

const VisitorSchema: Schema = new Schema({
  fullName: { type: String, required: [true, 'Full name is required'] },
  phoneNumber: { type: String, required: [true, 'Phone number is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  purpose: { type: String, required: [true, 'Purpose is required'] },
  hostName: { type: String, required: [true, 'Host name is required'] },
  company: { type: String, required: [true, 'Company is required'] },
  vehicleNumber: { type: String, required: [true, 'Vehicle number is required'] },
  modeOfEntry: { type: String, required: [true, 'Mode of entry is required'] },
  visitDate: { type: Date, required: [true, 'Visit date is required'] },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date, default: null },
  status: { type: String, enum: ['checked-in', 'checked-out'], default: 'checked-in' },
  exitCode: { type: String, required: [true, 'Exit code is required'], unique: true },
}, { 
  timestamps: true,
  strict: true // This ensures only fields defined in the schema are saved
});

// Add pre-save middleware to ensure required fields
VisitorSchema.pre('save', function(next) {
  if (!this.company || !this.vehicleNumber || !this.modeOfEntry) {
    next(new Error('Company, vehicle number, and mode of entry are required'));
  }
  next();
});

export default mongoose.model<IVisitor>('Visitor', VisitorSchema); 