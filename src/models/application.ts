import mongoose, { Schema } from 'mongoose';
import { IApplication } from '../utils/@type';

const ApplicationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    applicantName: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    panNumber: {
      type: String,
      required: true,
      trim: true
    },
    panImage: {
      type: String,
      required: true
    },
    aadhaarNumber: {
      type: String,
      required: true,
      trim: true
    },
    aadhaarImage: {
      type: String,
      required: true
    },
    documents: [{ type: String }],

    applicationNumber: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    rejectionReason: {
      type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
