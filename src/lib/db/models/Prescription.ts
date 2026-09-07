import mongoose, { Schema } from 'mongoose';

export interface IPrescription {
  _id?: string;
  shopifyOrderId?: string;
  storeOrderId?: string;
  orderNumber?: string;
  customerId?: string;
  patientName?: string;
  patientEmail?: string;
  medication?: string;
  dosage?: string;
  pharmacistName?: string | null;
  pharmacistEmail?: string | null;
  pharmacistRegNo?: string | null;
  gphcNumber?: string | null;
  prescriptionPdf?: string | null;
  generatedAt?: Date | string;
  orderDate?: Date | string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    shopifyOrderId: { type: String, default: '' },
    storeOrderId: { type: String, default: '' },
    orderNumber: { type: String, default: '' },
    customerId: { type: String, default: '' },
    patientName: { type: String, default: '' },
    patientEmail: { type: String, default: '' },
    medication: { type: String, default: 'Semaglutide 0.25mg Pen' },
    dosage: { type: String, default: 'Standard' },
    pharmacistName: { type: String, default: 'Dr. Sarah Jenkins' },
    pharmacistEmail: { type: String, default: 'sarah.j@medipulse.io' },
    pharmacistRegNo: { type: String, default: '2089412' },
    gphcNumber: { type: String, default: '2089412' },
    prescriptionPdf: { type: String, default: null },
    generatedAt: { type: Date, default: Date.now },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'verified' },
  },
  { timestamps: true }
);

export const Prescription = mongoose.models.Prescription || mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
export default Prescription;
