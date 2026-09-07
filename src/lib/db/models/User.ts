import mongoose, { Schema } from 'mongoose';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  is_active: boolean;
  site_id?: string;
  sites?: string[];
  is_super_admin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'admin' },
    is_active: { type: Boolean, default: true },
    site_id: { type: String },
    sites: { type: [String], default: [] },
    is_super_admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;

