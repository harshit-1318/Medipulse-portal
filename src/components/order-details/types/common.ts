export interface KVPair {
    name: string;
    value: string;
}

export interface ActivityLog {
    id: string;
    view: string;
    actionType: string;
    objectGuid: string;
    subjectGuid: string;
    targetGuid: string;
    accessId: string | number;
    userEmail: string;
    userName?: string | null;
    details: string;
    createdAt: string;
    count?: number;
}
