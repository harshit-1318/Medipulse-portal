export interface StoredOrderNote {
  _id: string;
  order_id: string;
  note: string;
  user_id: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export const orderNotesStore: StoredOrderNote[] = [
  {
    _id: 'note_1',
    order_id: 'MP-1001',
    note: 'Clinical assessment complete. Verified eligibility for weight management treatment.',
    user_id: {
      _id: 'user_1',
      name: 'Dr. Sarah Jenkins',
    },
    createdAt: new Date('2026-08-15T10:45:00Z').toISOString(),
  },
];
