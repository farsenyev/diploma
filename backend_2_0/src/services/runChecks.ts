import { PageSnapshot, VisualStructureModel } from "../model/types";
import { ModuleCheckResult } from "../model/checkTypes";

import { AltTextChecker } from "./checks/altTextChecker";
import { HeadingHierarchyChecker } from "./checks/headingHierarchyChecker";
import { KeyboardNavigationChecker } from "./checks/keyboardNavigationChecker";
import { ContrastChecker } from "./checks/contrastChecker";
import { StructureComplexityChecker } from "./checks/structureComplexityChecker";

export function runAllChecks(
    snapshot: PageSnapshot,
    model: VisualStructureModel
): ModuleCheckResult[] {
    const results: ModuleCheckResult[] = [];

    results.push(...AltTextChecker(snapshot));
    results.push(...HeadingHierarchyChecker(model.visualElements));
    results.push(...KeyboardNavigationChecker(snapshot, model));
    results.push(...ContrastChecker(snapshot));
    results.push(...StructureComplexityChecker(snapshot, model));

    return results;
}