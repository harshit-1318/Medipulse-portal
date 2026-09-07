import { describe, it, expect } from 'vitest';
import { detectDocsStatus, getDocumentItemsStatus } from './status';

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
});
