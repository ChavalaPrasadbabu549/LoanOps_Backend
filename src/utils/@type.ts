import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  number?: string;
  profile?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  applicantName: string;
  mobileNumber: string;
  panNumber: string;
  panImage: string;
  aadhaarNumber: string;
  aadhaarImage: string;
  documents: string[];
  applicationNumber: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  missingFields: string[];
  createdAt: Date;
  updatedAt: Date;
}