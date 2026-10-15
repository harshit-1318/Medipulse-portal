import { describe, it, expect } from 'vitest';
import { detectDocsStatus, getDocumentItemsStatus } from '../status';

describe('detectDocsStatus', () => {
    it('handles falsy objects', () => {
        expect(detectDocsStatus(null)).toBe(false);
        expect(detectDocsStatus({})).toBe(false);
    });

    it('detects from documents array & boolean flags', () => {
        expect(detectDocsStatus({ documents: ['doc1.pdf'] })).toBe(true);
        expect(detectDocsStatus({ documents: [] })).toBe(false);
        expect(detectDocsStatus({ documentsUploaded: true })).toBe(true);
        expect(detectDocsStatus({ hasDocuments: true })).toBe(true);
    });

    it('detects from explicit string status', () => {
        expect(detectDocsStatus({ documentStatus: 'uploaded' })).toBe(true);
        expect(detectDocsStatus({ document_status: 'UPLOADED' })).toBe(true);
    });

    it('detects from meta-data (has_id_card, etc)', () => {
        expect(detectDocsStatus({ has_id_card: true })).toBe(true);
        expect(detectDocsStatus({ has_full_photo: true })).toBe(true);
        expect(detectDocsStatus({ orderDocumentFilter: [{ uploaded: true }] })).toBe(true);
        expect(detectDocsStatus({ customerMeta: { has_id_card: true } })).toBe(true);
        expect(detectDocsStatus({ customerMeta: { has_full_photo: true } })).toBe(true);
    });

    it('handles explicit negative signals & order #1011 priority', () => {
        expect(detectDocsStatus({ documentsUploaded: false })).toBe(false);
        expect(detectDocsStatus({ documentStatus: 'not_uploaded' })).toBe(false);

        const order1011 = {
            "documentStatus": "not_uploaded",
            "documentsUploaded": false,
            "orderDocumentFilter": [
                { "field": "has_id_card", "uploaded": false },
                { "field": "has_full_photo", "uploaded": true }
            ]
        };
        expect(detectDocsStatus(order1011)).toBe(false);
    });

    it('detects from tags', () => {
        expect(detectDocsStatus({ tags: ['prescription_uploaded'] })).toBe(true);
        expect(detectDocsStatus({ tags: ['other_tag'] })).toBe(false);
    });
});

describe('getDocumentItemsStatus', () => {
    it('reads explicit backend booleans for id/full photo/video', () => {
        const status = getDocumentItemsStatus({
            has_id_card: true,
            has_full_photo: false,
            has_video_recording: true,
        });
        expect(status).toEqual({ id: true, fullPhoto: false, video: true });
    });

    it('falls back to orderDocumentFilter entries when booleans are missing', () => {
        const status = getDocumentItemsStatus({
            orderDocumentFilter: [
                { field: 'has_id_card', uploaded: false },
                { field: 'has_full_photo', uploaded: true },
                { field: 'has_video_recording', status: 'uploaded' },
            ],
        });
        expect(status).toEqual({ id: false, fullPhoto: true, video: true });
    });

    it('Scenario 1: No documents uploaded returns false for all three', () => {
        const status = getDocumentItemsStatus({
            orderNumber: 'MP-95478',
            customerDocuments: { id_card: null, full_photo: null, video_recordings: [] },
        });
        expect(status).toEqual({ id: false, fullPhoto: false, video: false });
    });

    it('Scenario 2: Only ID document uploaded returns id: true, photo: false, video: false', () => {
        const status = getDocumentItemsStatus({
            customerDocuments: {
                id_card: 'https://example.com/id.jpg',
                full_photo: null,
                video_recordings: [],
            },
        });
        expect(status).toEqual({ id: true, fullPhoto: false, video: false });
    });

    it('Scenario 3: ID and photo uploaded, video missing', () => {
        const status = getDocumentItemsStatus({
            customerDocuments: {
                id_card: 'https://example.com/id.jpg',
                full_photo: 'https://example.com/photo.jpg',
                video_recordings: [],
            },
        });
        expect(status).toEqual({ id: true, fullPhoto: true, video: false });
    });

    it('Scenario 4: All three documents uploaded', () => {
        const status = getDocumentItemsStatus({
            customerDocuments: {
                id_card: 'https://example.com/id.jpg',
                full_photo: 'https://example.com/photo.jpg',
                video_recordings: [{ url: 'https://example.com/video.mp4', duration: 120 }],
            },
        });
        expect(status).toEqual({ id: true, fullPhoto: true, video: true });
    });

    it('Scenario 5: Record exists but file is missing or placeholder — not represented as available', () => {
        const status = getDocumentItemsStatus({
            hasIdCard: true,
            customerDocuments: {
                id_card: '',
                full_photo: 'placeholder',
                video_recordings: [],
            },
        });
        expect(status).toEqual({ id: false, fullPhoto: false, video: false });
    });
});
