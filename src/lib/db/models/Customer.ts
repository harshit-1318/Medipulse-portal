import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer {
  _id?: string;
  siteId?: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  totalOrders: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    siteId: { type: String, default: '65e0123456789abcdef00001' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: '' },
    status: { type: String, default: 'active' },
    totalOrders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
export default Customer;
