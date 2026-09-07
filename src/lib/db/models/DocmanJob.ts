import mongoose, { Schema } from 'mongoose';

export interface IDocmanJob {
  _id?: string;
  laravel_document_id: number | string;
  command_type: string;
  status: string;
  completed_at?: string | null;
  workerId?: string | null;
  lastError?: string | null;
  idempotencyKey?: string | null;
  externalId?: string | null;
  payload: {
    Patient: {
      Identifier: string;
      FamilyName: string;
      GivenNames: string;
      BirthDate: string;
      Gender: number;
      Email: string;
    };
    Document: {
      Description: string;
      EventDate: string;
      FileExtension: string;
      FileUrl: string;
      FileHash: string;
      ExternalSystemId: string;
    };
    RecipientOdsCode: string | null;
    GPData: {
      organisation_code: string;
      gp_name: string;
      address: string;
    } | null;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const DocmanJobSchema = new Schema<IDocmanJob>(
  {
    laravel_document_id: { type: Schema.Types.Mixed, required: true },
    command_type: { type: String, default: 'SendDocument' },
    status: { type: String, default: 'pending' },
    completed_at: { type: String, default: null },
    workerId: { type: String, default: null },
    lastError: { type: String, default: null },
    idempotencyKey: { type: String, default: null },
    externalId: { type: String, default: null },
    payload: {
      Patient: {
        Identifier: { type: String, default: '' },
        FamilyName: { type: String, default: '' },
        GivenNames: { type: String, default: '' },
        BirthDate: { type: String, default: '' },
        Gender: { type: Number, default: 1 },
        Email: { type: String, default: '' },
      },
      Document: {
        Description: { type: String, default: '' },
        EventDate: { type: String, default: '' },
        FileExtension: { type: String, default: 'pdf' },
        FileUrl: { type: String, default: '' },
        FileHash: { type: String, default: '' },
        ExternalSystemId: { type: String, default: '' },
      },
      RecipientOdsCode: { type: String, default: null },
      GPData: {
        organisation_code: { type: String, default: '' },
        gp_name: { type: String, default: '' },
        address: { type: String, default: '' },
      },
    },
  },
  { timestamps: true }
);

export const DocmanJob = mongoose.models.DocmanJob || mongoose.model<IDocmanJob>('DocmanJob', DocmanJobSchema);
export default DocmanJob;
