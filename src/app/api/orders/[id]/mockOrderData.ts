export const DEFAULT_CONSULTATION_FLAGS = {
  has_full_photo: true,
  has_id_card: true,
  has_video_recording: false,
  consultation_reviewed: true,
  image_id_verified: true,
  scr_accessed: true,
  sms_sent: true,
  postal_sent: false,
};

export const DEFAULT_CUSTOMER_DOCUMENTS = {
  id_card: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60',
  full_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=60',
  review_full_photo: null,
  previous_prescriptions: [],
  previous_prescriptions_count: 1,
  video_recordings: [],
};

export const DEFAULT_PHARMACIST_INFO = {
  name: 'Dr. Sarah Jenkins, MPharm',
  registrationNumber: 'GPhC #2084912',
  approvedAt: new Date('2026-08-15T11:00:00Z').toISOString(),
};

export const createOrderCommActions = (cleanId: string) => ({
  sendVideoConsultation: { enabled: true, roomUrl: `/api/video/create-room/${cleanId}`, method: 'GET', payload: {} },
  sendDocumentReminder: { enabled: true, actionUrl: `/api/orders/${cleanId}/document-reminder`, method: 'POST', payload: {} },
  sendPrescriptionReminder: { enabled: true, actionUrl: `/api/orders/${cleanId}/prescription-reminder`, method: 'POST', payload: {} },
  sendMessage: { enabled: true, actionUrl: `/api/orders/${cleanId}/message`, method: 'POST', payload: { id: cleanId, message: '' } },
  sendGpEmail: { enabled: true, actionUrl: `/api/orders/${cleanId}/gp-email`, method: 'POST', payload: {} },
  ageVerifiedEmail: { enabled: true, actionUrl: `/api/orders/${cleanId}/age-verification`, method: 'POST', payload: {} },
  sendSixMonthReview: { enabled: true, actionUrl: `/api/orders/${cleanId}/six-month-review`, method: 'POST', payload: {} },
});
