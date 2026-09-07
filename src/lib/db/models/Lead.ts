import mongoose, { Schema } from 'mongoose';

export interface ILead {
  _id?: string;
  siteId?: string;
  surveyId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  status: string;
  notes?: Array<{ text: string; createdAt: Date }>;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    siteId: { type: String, default: '65e0123456789abcdef00001' },
    surveyId: { type: String },
    customerId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    status: { type: String, default: 'new' },
    notes: [{ text: String, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
export default Lead;
