import mongoose, { Schema } from 'mongoose';

export interface IActivityLog {
  _id?: string;
  action: string;
  action_type?: string;
  user?: string;
  user_name?: string;
  user_email: string;
  role?: string;
  user_role?: string;
  orderId?: string;
  object_guid?: string;
  target_guid?: string;
  details?: string;
  page?: string;
  view?: string;
  site_id?: string;
  siteName?: string;
  count?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    action_type: { type: String },
    user: { type: String },
    user_name: { type: String },
    user_email: { type: String, required: true, index: true },
    role: { type: String, index: true },
    user_role: { type: String },
    orderId: { type: String, index: true },
    object_guid: { type: String },
    target_guid: { type: String },
    details: { type: String, default: '' },
    page: { type: String },
    view: { type: String },
    site_id: { type: String },
    siteName: { type: String },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
