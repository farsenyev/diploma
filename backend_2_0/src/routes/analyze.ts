import { Router } from "express";
import { z } from "zod";
import { capturePageSnapshot } from "../services/capturePageSnapshot";
import { buildVisualStructureModel } from "../services/buildVisualStructureModel";
import {runAllChecks} from "../services/runChecks";
import {buildAnalysisReport} from "../services/reportAggregator";

export const analyzeRouter = Router();

const bodySchema = z.object({
    url: z.string().url()
});

analyzeRouter.post("/", async (req, res) => {
    const parsed = bodySchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: "Invalid URL" });
    }

    try {
        const snapshot = await capturePageSnapshot(parsed.data.url);
        const visualModel = buildVisualStructureModel(snapshot);

        const results = runAllChecks(snapshot, visualModel);
        const report = buildAnalysisReport(results)

        return res.json({
            snapshot,
            visualModel,
            report,
        });
    } catch (e) {
        console.error("ANALYZE ERROR:", e);
        return res.status(500).json({
            error: e instanceof Error ? e.message : "Failed to analyze page"
        });
    }
});