import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  name: string;
  phoneNumber: string;
  purpose: string;
  visitingWhom: string;
  entryTime: Date;
  exitTime?: Date;
  exitCode: string;
  checkedOut: boolean;
  guardName: string;
  guardId: string;
}

const VisitorSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  purpose: { type: String, required: true },
  visitingWhom: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  exitCode: { type: String, required: true, unique: true },
  checkedOut: { type: Boolean, default: false },
  guardName: { type: String, required: true },
  guardId: { type: String, required: true }
});

export default mongoose.model<IVisitor>('Visitor', VisitorSchema); 