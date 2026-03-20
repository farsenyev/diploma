import { db } from './db';
import type { AnalyzeResponse, StoredAnalysis } from '../types';

export const saveAnalysisToHistory = async (
    url: string,
    data: AnalyzeResponse
): Promise<string> => {
    const id = crypto.randomUUID();

    const item: StoredAnalysis = {
        id,
        url,
        createdAt: new Date().toISOString(),
        report: data.report,
        snapshot: data.snapshot,
        visualModel: data.visualModel,
    };

    await db.analyses.put(item);
    return id;
};

export const getHistoryList = async (): Promise<StoredAnalysis[]> => {
    return db.analyses.orderBy('createdAt').reverse().toArray();
};

export const getAnalysisById = async (id: string): Promise<StoredAnalysis | undefined> => {
    return db.analyses.get(id);
};

export const deleteAnalysisById = async (id: string): Promise<void> => {
    await db.analyses.delete(id);
};

export const clearHistory = async (): Promise<void> => {
    await db.analyses.clear();
};
