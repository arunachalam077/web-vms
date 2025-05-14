import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  name: string;
  phoneNumber: string;
  purpose: string;
  visitingWhom: string;
  modeOfEntry: string;
  guardName: string;
  guardId: string;
  entryTime: Date;
  exitTime?: Date;
  exitCode: string;
  checkedOut: boolean;
}

const VisitorSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  purpose: { type: String, required: true },
  visitingWhom: { type: String, required: true },
  modeOfEntry: { type: String, required: true },
  guardName: { type: String, required: true },
  guardId: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  exitCode: { type: String, required: true, unique: true },
  checkedOut: { type: Boolean, default: false }
});

export default mongoose.model<IVisitor>('Visitor', VisitorSchema); 