import {
    ModuleCheckResult,
    AnalysisReport,
    ModuleSummary
} from "../model/checkTypes";
import { buildRecommendations } from "./recommendationsEngine";

function calculateSummary(results: ModuleCheckResult[]) {
    const summary = {
        total: results.length,
        ok: 0,
        warnings: 0,
        errors: 0
    };

    for (const r of results) {
        if (r.status === "ok") summary.ok++;
        if (r.status === "warning") summary.warnings++;
        if (r.status === "error") summary.errors++;
    }

    return summary;
}

function groupByModule(results: ModuleCheckResult[]): ModuleSummary[] {
    const map = new Map<string, ModuleSummary>();

    for (const r of results) {
        if (!map.has(r.moduleName)) {
            map.set(r.moduleName, {
                moduleName: r.moduleName,
                total: 0,
                ok: 0,
                warnings: 0,
                errors: 0
            });
        }

        const m = map.get(r.moduleName)!;
        m.total++;

        if (r.status === "ok") m.ok++;
        if (r.status === "warning") m.warnings++;
        if (r.status === "error") m.errors++;
    }

    return Array.from(map.values());
}

function calculateScore(results: ModuleCheckResult[]): number {
    if (results.length === 0) return 100;

    let score = 100;

    for (const r of results) {
        if (r.status === "error") score -= 5;
        if (r.status === "warning") score -= 2;
    }

    return Math.max(0, Math.round(score));
}

function calculateGrade(score: number): string {
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 50) return "C";
    return "D";
}

export function buildAnalysisReport(
    results: ModuleCheckResult[]
): AnalysisReport {
    const summary = calculateSummary(results);
    const modules = groupByModule(results);
    const score = calculateScore(results);
    const grade = calculateGrade(score);
    const recommendations = buildRecommendations(results);

    return {
        results,
        summary,
        modules,
        score,
        grade,
        recommendations
    };
}