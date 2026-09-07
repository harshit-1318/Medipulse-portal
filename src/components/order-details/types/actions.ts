export interface OrderAction {
    enabled: boolean;
    actionUrl: string;
    method: string;
    payload: Record<string, unknown>;
    sentAt?: string | null;
}

export interface SendMessageAction extends Omit<OrderAction, 'payload'> {
    payload: {
        id: string;
        message: string;
    };
}

export interface SendGpEmailAction extends Omit<OrderAction, 'payload'> {
    payload: {
        gp_email: string;
        message?: string;
    };
}

export interface VideoConsultationAction extends OrderAction {
    roomUrl: string;
}
