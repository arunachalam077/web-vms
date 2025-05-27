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
  status: 'checked-in' | 'checked-out';
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
  modeOfEntry: { 
    type: String, 
    required: [true, 'Mode of entry is required'],
    enum: ['Walk-in', 'Van', 'Lorry', 'Car', 'Bike']
  },
  visitDate: { type: Date, required: [true, 'Visit date is required'] },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date, default: null },
  status: { 
    type: String, 
    enum: ['checked-in', 'checked-out'], 
    default: 'checked-in' 
  },
  exitCode: { 
    type: String, 
    required: [true, 'Exit code is required'], 
    unique: true 
  }
}, { 
  timestamps: true,
  strict: true
});

// Add pre-save middleware to ensure required fields only on new documents
VisitorSchema.pre('save', function(next) {
  // Only validate required fields for new documents
  if (this.isNew) {
    if (!this.company || !this.vehicleNumber || !this.modeOfEntry) {
      next(new Error('Company, vehicle number, and mode of entry are required'));
      return;
    }
  }
  next();
});

// Add method to check out visitor
VisitorSchema.methods.checkOut = async function() {
  if (this.status === 'checked-out') {
    throw new Error('Visitor is already checked out');
  }
  
  // Use updateOne to bypass validation for checkout
  const result = await this.constructor.updateOne(
    { _id: this._id },
    { 
      $set: { 
        status: 'checked-out',
        checkOutTime: new Date()
      }
    }
  );

  if (result.nModified === 0) {
    throw new Error('Failed to update visitor status');
  }

  // Update the current document instance
  this.status = 'checked-out';
  this.checkOutTime = new Date();
  
  return this;
};

// Add method to delete visitor
VisitorSchema.methods.deleteVisitor = async function() {
  try {
    const result = await this.constructor.deleteOne({ _id: this._id });
    if (result.deletedCount === 0) {
      throw new Error('Failed to delete visitor');
    }
    return true;
  } catch (error) {
    console.error('Error deleting visitor:', error);
    throw error;
  }
};

// Add static method to find by exit code
VisitorSchema.statics.findByExitCode = function(exitCode: string) {
  return this.findOne({ exitCode });
};

export default mongoose.model<IVisitor>('Visitor', VisitorSchema); 