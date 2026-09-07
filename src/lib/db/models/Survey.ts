import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvey {
  _id?: string;
  siteId?: string;
  title: string;
  description?: string;
  slug: string;
  status: string;
  currentVersion: number;
  schema: Record<string, any>;
  draftSchema?: Record<string, any>;
  settings?: {
    expiryDays?: number;
    captchaEnabled?: boolean;
    allowedDomains?: string[];
    submissionLimit?: number | null;
  };
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SurveySettingsSchema = new Schema(
  {
    expiryDays: { type: Number, default: 7 },
    captchaEnabled: { type: Boolean, default: false },
    allowedDomains: { type: [String], default: () => [] },
    submissionLimit: { type: Number, default: null },
  },
  { _id: false }
);

const SurveySchema = new Schema<ISurvey>(
  {
    siteId: { type: String, default: '65e0123456789abcdef00001' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    slug: { type: String, required: true },
    status: { type: String, default: 'published' },
    currentVersion: { type: Number, default: 1 },
    schema: { type: Schema.Types.Mixed, default: {} },
    draftSchema: { type: Schema.Types.Mixed, default: {} },
    settings: {
      type: SurveySettingsSchema,
      default: () => ({
        expiryDays: 7,
        captchaEnabled: false,
        allowedDomains: [],
        submissionLimit: null,
      }),
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development' && mongoose.models.Survey) {
  delete mongoose.models.Survey;
}

export const Survey = mongoose.models.Survey || mongoose.model<ISurvey>('Survey', SurveySchema);
export default Survey;
