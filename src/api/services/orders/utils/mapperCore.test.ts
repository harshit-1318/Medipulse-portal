import { describe, it, expect } from 'vitest';
import { mapBackendOrderToFrontend } from './mapper';

describe('mapBackendOrderToFrontend - Core Mapping', () => {
    it('maps per-document status object including video from backend fields', () => {
        const result = mapBackendOrderToFrontend({
            has_id_card: true,
            has_full_photo: false,
            has_video_recording: true,
            documentStatus: 'not_uploaded',
        });

        expect(result.documentItemsStatus).toEqual({
            id: true,
            fullPhoto: false,
            video: true,
        });
        expect(result.documentsUploaded).toBe(false);
        expect(result.documents).toBe('Not Uploaded');
    });

    it('maps status as On Hold when status is on_hold but fulfillment is fulfilled', () => {
        const result = mapBackendOrderToFrontend({
            fulfillment_status: 'fulfilled',
            status: 'on_hold',
        });

        expect(result.status).toBe('On Hold');
    });

    it('uses nested orderInfo status when root status is stale', () => {
        const result = mapBackendOrderToFrontend({
            status: 'fulfilled',
            orderInfo: {
                status: 'cancelled',
            },
        });

        expect(result.status).toBe('Cancelled');
    });

    it('uses raw Shopify fulfillment status when top-level status is stale unfulfilled', () => {
        const result = mapBackendOrderToFrontend({
            order_name: '#110794',
            status: 'unfulfilled',
            raw_data: {
                fulfillment_status: 'fulfilled',
            },
        });

        expect(result.status).toBe('Fulfilled');
    });
});
