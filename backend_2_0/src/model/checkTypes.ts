export type CheckStatus = "ok" | "warning" | "error";

export interface ModuleCheckResult {
    moduleName: string;
    item: string;
    issue: string;
    status: CheckStatus;
}

export interface ChecksSummary {
    total: number;
    ok: number;
    warnings: number;
    errors: number;
}

export interface ModuleSummary {
    moduleName: string;
    total: number;
    ok: number;
    warnings: number;
    errors: number;
}

export interface RecommendationItem {
    moduleName: string;
    recommendation: string;
    priority: "low" | "medium" | "high";
}

export interface AnalysisReport {
    results: ModuleCheckResult[];
    summary: ChecksSummary;
    modules: ModuleSummary[];
    score: number;
    grade: string;
    recommendations: RecommendationItem[];
}