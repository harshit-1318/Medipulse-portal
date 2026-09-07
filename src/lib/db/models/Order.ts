import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder {
  _id?: string;
  siteId?: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  isUrgent?: boolean;
  isParked?: boolean;
  tags?: string[];
  shopify_order_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    siteId: { type: String, default: '65e0123456789abcdef00001' },
    orderNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    status: { type: String, default: 'pending' },
    total: { type: Number, default: 0 },
    isUrgent: { type: Boolean, default: false },
    isParked: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    shopify_order_id: { type: String },
    items: [
      {
        name: { type: String },
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
