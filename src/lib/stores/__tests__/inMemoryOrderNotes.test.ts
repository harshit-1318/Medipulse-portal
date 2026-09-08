import { describe, it, expect } from 'vitest';
import { orderNotesStore, type StoredOrderNote } from '../inMemoryOrderNotes';

describe('In-Memory Order Notes Store (src/lib/stores/inMemoryOrderNotes.ts)', () => {
  it('exports an array with initial mock order notes', () => {
    expect(Array.isArray(orderNotesStore)).toBe(true);
    expect(orderNotesStore.length).toBeGreaterThan(0);
  });

  it('validates shape and required properties of stored notes', () => {
    const note = orderNotesStore[0];
    expect(note).toHaveProperty('_id');
    expect(note).toHaveProperty('order_id');
    expect(note).toHaveProperty('note');
    expect(note).toHaveProperty('user_id');
    expect(note.user_id).toHaveProperty('_id');
    expect(note.user_id).toHaveProperty('name');
    expect(note).toHaveProperty('createdAt');
  });

  it('allows adding and retrieving notes in memory', () => {
    const initialLen = orderNotesStore.length;
    const newNote: StoredOrderNote = {
      _id: 'note_test_new',
      order_id: 'MP-TEST',
      note: 'Test note addition',
      user_id: { _id: 'u_test', name: 'Dr. Test' },
      createdAt: new Date().toISOString(),
    };
    orderNotesStore.push(newNote);
    expect(orderNotesStore.length).toBe(initialLen + 1);
    expect(orderNotesStore).toContain(newNote);

    // Clean up
    orderNotesStore.pop();
    expect(orderNotesStore.length).toBe(initialLen);
  });
});
