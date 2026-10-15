export function buildOrderDocuments(orderDoc: any) {
  const rawCustDocs = orderDoc?.customerDocuments;
  const rawFlags = orderDoc?.consultationFlags;

  const idCardUrl = rawCustDocs?.id_card || orderDoc?.id_card || orderDoc?.id_card_url || orderDoc?.idDocumentUrl || null;
  const fullPhotoUrl = rawCustDocs?.full_photo || orderDoc?.full_photo || orderDoc?.full_photo_url || orderDoc?.photoUrl || null;
  const videoRecordings = Array.isArray(rawCustDocs?.video_recordings)
    ? rawCustDocs.video_recordings
    : Array.isArray(orderDoc?.video_recordings)
    ? orderDoc.video_recordings
    : [];

  const customerDocuments = {
    id_card: idCardUrl,
    full_photo: fullPhotoUrl,
    review_full_photo: rawCustDocs?.review_full_photo || orderDoc?.review_full_photo || null,
    previous_prescriptions: rawCustDocs?.previous_prescriptions || orderDoc?.previous_prescriptions || [],
    previous_prescriptions_count: rawCustDocs?.previous_prescriptions_count ?? (rawCustDocs?.previous_prescriptions?.length || orderDoc?.previous_prescriptions?.length || 0),
    video_recordings: videoRecordings,
  };

  const consultationFlags = {
    has_full_photo: Boolean(rawFlags?.has_full_photo ?? orderDoc?.hasFullPhoto ?? orderDoc?.has_full_photo ?? fullPhotoUrl),
    has_id_card: Boolean(rawFlags?.has_id_card ?? orderDoc?.hasIdCard ?? orderDoc?.has_id_card ?? idCardUrl),
    has_video_recording: Boolean(rawFlags?.has_video_recording ?? orderDoc?.hasVideoRecording ?? orderDoc?.has_video_recording ?? (videoRecordings.length > 0)),
    consultation_reviewed: Boolean(rawFlags?.consultation_reviewed ?? orderDoc?.consultation_reviewed),
    image_id_verified: Boolean(rawFlags?.image_id_verified ?? orderDoc?.image_id_verified),
    scr_accessed: Boolean(rawFlags?.scr_accessed ?? orderDoc?.scr_accessed),
    sms_sent: Boolean(rawFlags?.sms_sent ?? orderDoc?.sms_sent),
    postal_sent: Boolean(rawFlags?.postal_sent ?? orderDoc?.postal_sent),
  };

  return { customerDocuments, consultationFlags };
}
