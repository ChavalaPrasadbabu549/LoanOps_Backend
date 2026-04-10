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
    voterId: {
      type: String,
      required: true,
    },
    bankStatement: {
      type: String,
      required: true,
    },
    houseTax: {
      type: String,
      required: true,
    },
    documents: [{ type: String }],
    applicationNumber: {
      type: String,
      required: true,
      unique: true
    },
    loanAmount: {
      type: Number,
      required: true
    },
    loanType: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: false
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    rejectionReason: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: true
    },
    remarks: {
      type: String,
      required: false
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', ApplicationSchema);
