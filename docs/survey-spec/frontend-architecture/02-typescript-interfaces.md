# 4.5 Frontend Architecture: TypeScript Interfaces

### **`src/types/survey.ts`**
```ts
type SurveyStatus = 'draft' | 'published';
type SurveySessionStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

interface Survey {
  _id: string; title: string; description?: string; slug: string;
  status: SurveyStatus; currentVersion: number;
  schema: Record<string, any>; draftSchema?: Record<string, any>;
  settings: SurveySettings;
  totalSessions?: number; completedSessions?: number;
  createdAt: string; updatedAt: string;
}

interface SurveySettings {
  expiryDays: number; captchaEnabled: boolean;
  allowedDomains: string[]; submissionLimit: number | null;
}

interface SurveyVersion {
  _id: string; versionNumber: number; schema: Record<string, any>;
  changelog?: string; createdBy: { _id: string; username: string }; createdAt: string;
}

interface SurveySession {
  _id: string; surveyId: string; customerId: string; orderId?: string;
  token: string; status: SurveySessionStatus;
  partialResponse: Record<string, any> | null; currentPage: number;
  submittedResponse: Record<string, any> | null; submittedAt?: string;
  expiresAt: string; sentAt: string;
  customer?: { _id: string; name: string; email: string };
}

interface PublicSurveySessionData {
  sessionId: string; status: SurveySessionStatus;
  surveyTitle: string; schema: Record<string, any>;
  partialResponse: Record<string, any> | null; currentPage: number;
  expiresAt: string;
}
```

### **`src/types/lead.ts`**
```ts
type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed' | 'lost';

interface Lead {
  _id: string;
  customer: { _id: string; name: string; email: string; phone?: string };
  survey: { _id: string; title: string };
  orderId?: string; status: LeadStatus;
  assignedTo: { _id: string; username: string; email: string } | null;
  submittedResponse?: Record<string, any>;
  notes?: LeadNote[]; activityLog?: LeadActivity[];
  notesCount?: number; createdAt: string; updatedAt: string;
}

interface LeadNote {
  _id: string; text: string;
  createdBy: { _id: string; username: string }; createdAt: string;
}

interface LeadActivity {
  action: 'created' | 'status_changed' | 'assigned' | 'note_added';
  from?: string | null; to?: string | null;
  performedBy: { _id: string; username: string }; timestamp: string;
}
```
