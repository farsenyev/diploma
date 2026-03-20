import Dexie, { type Table } from 'dexie';
import type { StoredAnalysis } from '../types';

class AccessibilityDB extends Dexie {
    analyses!: Table<StoredAnalysis, string>;

    constructor() {
        super('AccessibilityCheckerDB');

        this.version(1).stores({
            analyses: 'id, url, createdAt',
        });
    }
}

export const db = new AccessibilityDB();
