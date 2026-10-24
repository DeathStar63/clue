// Cases live only on this device, in IndexedDB (photos are too big for localStorage).
import type { CaseState } from '../types';
import type { MindCase } from '../mind/types';

const DB_NAME = 'clue';
const SKIN = 'cases';
const MIND = 'mindCases';
type StoreName = typeof SKIN | typeof MIND;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(SKIN, { keyPath: 'id' });
      req.result.createObjectStore(MIND, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(name: StoreName, mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = run(db.transaction(name, mode).objectStore(name));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function list<T extends { updatedAt: string }>(name: StoreName): Promise<T[]> {
  try {
    const all = await tx<T[]>(name, 'readonly', (s) => s.getAll() as IDBRequest<T[]>);
    return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

async function put(name: StoreName, value: unknown): Promise<void> {
  try {
    await tx(name, 'readwrite', (s) => s.put(value));
  } catch {
    // Private mode or storage blocked: the case still works for this session.
  }
}

async function remove(name: StoreName, id: string): Promise<void> {
  try {
    await tx(name, 'readwrite', (s) => s.delete(id));
  } catch {
    // ignore
  }
}

export const listCases = () => list<CaseState>(SKIN);
export const saveCase = (c: CaseState) => put(SKIN, c);
export const deleteCase = (id: string) => remove(SKIN, id);

export const listMindCases = () => list<MindCase>(MIND);
export const saveMindCase = (c: MindCase) => put(MIND, c);
export const deleteMindCase = (id: string) => remove(MIND, id);

/** One-tap erase: removes every saved case on this device. */
export async function eraseEverything(): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      req.onblocked = () => resolve();
    });
  } catch {
    // ignore
  }
}

export function newCase(): CaseState {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    complaint: '',
    areas: [],
    answers: {},
    asked: [],
    photos: [],
  };
}

export function newMindCase(): MindCase {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    responses: {},
    context: {},
    queue: [],
    completed: [],
  };
}
