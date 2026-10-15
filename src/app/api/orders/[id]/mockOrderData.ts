export const DEFAULT_CONSULTATION_FLAGS = {
  has_full_photo: false,
  has_id_card: false,
  has_video_recording: false,
  consultation_reviewed: false,
  image_id_verified: false,
  scr_accessed: false,
  sms_sent: false,
  postal_sent: false,
};

export const DEFAULT_CUSTOMER_DOCUMENTS = {
  id_card: null,
  full_photo: null,
  review_full_photo: null,
  previous_prescriptions: [],
  previous_prescriptions_count: 0,
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
