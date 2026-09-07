import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import type { ApiResponse } from "../types";
import { isLocalStorageDebugFlagEnabled } from "../../../utils/env";

const isVideoDebugEnabled = (): boolean => {
    return isLocalStorageDebugFlagEnabled('DEBUG_VIDEO_RECORDINGS');
};

export function useVideoRecordings(shopifyOrderId: string | number | undefined, initialRecordings: NonNullable<ApiResponse["customerDocuments"]["video_recordings"]>) {
    const [recordings, setRecordings] = useState(initialRecordings);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!shopifyOrderId) return;
        
        const fetchVideos = async () => {
            setLoading(true);
            if (isVideoDebugEnabled()) {
                console.log('[VIDEO_DEBUG][hook][start]', {
                    shopifyOrderId,
                    initialRecordingsCount: Array.isArray(initialRecordings) ? initialRecordings.length : 0,
                });
            }
            try {
                const response = await apiClient.get<any>({
                    url: `/video/recordings/by-order/${shopifyOrderId}`,
                    params: { _ts: Date.now() },
                });

                // apiClient unwraps { success, data } → response is { ok, recordings, count, ... }
                const rawRecordings = Array.isArray(response?.recordings) ? response.recordings : [];

                if (isVideoDebugEnabled()) {
                    console.log('[VIDEO_DEBUG][hook][response]', {
                        shopifyOrderId,
                        rawRecordingsCount: rawRecordings.length,
                        responseCount: response?.count,
                        roomPrefix: response?.room_prefix,
                        customerId: response?.customer_id,
                    });
                }

                // Map backend field names to UI field names
                // video_url/link → url, created_at/date → recordedAt, duration_seconds → duration
                const mappedRecordings = rawRecordings.map((rec: any) => ({
                    url: rec.url || rec.video_url || rec.link || "",
                    recordedAt: rec.recordedAt || rec.created_at || rec.createdAt || rec.date || "N/A",
                    duration: rec.duration || rec.duration_seconds || 0
                })).filter((rec: any) => rec.url);

                if (isVideoDebugEnabled()) {
                    console.log('[VIDEO_DEBUG][hook][mapped]', {
                        shopifyOrderId,
                        mappedRecordingsCount: mappedRecordings.length,
                    });
                }

                setRecordings(mappedRecordings);
            } catch (err) {
                console.error("[VideoRecordings] Fetch failed:", err);
                if (isVideoDebugEnabled()) {
                    console.error('[VIDEO_DEBUG][hook][fallback-to-initial]', {
                        shopifyOrderId,
                        initialRecordingsCount: Array.isArray(initialRecordings) ? initialRecordings.length : 0,
                    });
                }
                // Fall back to SSR-provided recordings rather than wiping the list
                setRecordings(initialRecordings);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [shopifyOrderId]);

    return { recordings, loading };
}

