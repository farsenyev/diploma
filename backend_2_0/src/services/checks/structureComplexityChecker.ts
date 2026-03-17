import { PageSnapshot, VisualStructureModel } from "../../model/types";
import { ModuleCheckResult } from "../../model/checkTypes";

function isInteractive(tagName: string, attrs: Record<string, string>): boolean {
    const role = attrs.role?.toLowerCase();

    if (tagName === "a" && !!attrs.href) return true;
    if (["button", "input", "select", "textarea"].includes(tagName)) return true;

    if (
        role &&
        ["button", "link", "checkbox", "radio", "switch", "tab", "textbox", "menuitem"].includes(role)
    ) {
        return true;
    }

    if (attrs.onclick !== undefined) return true;

    return false;
}

function round(value: number): number {
    return Math.round(value * 10) / 10;
}

export function StructureComplexityChecker(
    snapshot: PageSnapshot,
    visualModel: VisualStructureModel
): ModuleCheckResult[] {
    const results: ModuleCheckResult[] = [];

    const visibleElements = snapshot.elements.filter((el) => {
        return (
            el.display !== "none" &&
            el.visibility !== "hidden" &&
            el.rect.width > 0 &&
            el.rect.height > 0
        );
    });

    const meaningfulElements = visibleElements.filter((el) => {
        return (
            (el.text && el.text.trim().length > 0) ||
            ["img", "button", "a", "input", "select", "textarea", "video", "audio"].includes(el.tagName)
        );
    });

    const interactiveElements = visibleElements.filter((el) =>
        isInteractive(el.tagName, el.attributes || {})
    );

    const depths = visibleElements
        .map((el) => el.depth ?? 0)
        .filter((d) => typeof d === "number");

    const avgDepth =
        depths.length > 0 ? depths.reduce((sum, d) => sum + d, 0) / depths.length : 0;

    const maxDepth = depths.length > 0 ? Math.max(...depths) : 0;

    const viewportHeight = 900;
    const aboveTheFoldElements = meaningfulElements.filter((el) => el.rect.y < viewportHeight);
    const aboveTheFoldBlocks = visualModel.visualBlocks.filter((block) => block.rect.y < viewportHeight);

    const headings = visualModel.visualElements.filter((el) => el.type === "heading");

    // Плотность значимых элементов в верхней области
    const foldDensity = aboveTheFoldElements.length / Math.max(1, aboveTheFoldBlocks.length || 1);

    // Отношение интерактивных элементов ко всем значимым
    const interactivityRatio =
        meaningfulElements.length > 0
            ? interactiveElements.length / meaningfulElements.length
            : 0;

    // Интегральный score
    let complexityScore = 0;

    if (meaningfulElements.length > 80) complexityScore += 2;
    if (meaningfulElements.length > 150) complexityScore += 2;

    if (avgDepth > 10) complexityScore += 1;
    if (avgDepth > 14) complexityScore += 2;

    if (maxDepth > 18) complexityScore += 1;
    if (maxDepth > 25) complexityScore += 2;

    if (interactiveElements.length > 30) complexityScore += 1;
    if (interactiveElements.length > 50) complexityScore += 2;

    if (aboveTheFoldBlocks.length > 8) complexityScore += 1;
    if (aboveTheFoldBlocks.length > 12) complexityScore += 2;

    if (foldDensity > 8) complexityScore += 1;
    if (foldDensity > 12) complexityScore += 2;

    if (headings.length > 12) complexityScore += 1;
    if (headings.length > 20) complexityScore += 2;

    // 1. Общее количество значимых элементов
    if (meaningfulElements.length > 150) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Страница",
            issue: `Высокая насыщенность страницы значимыми элементами (${meaningfulElements.length})`,
            status: "error"
        });
    } else if (meaningfulElements.length > 80) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Страница",
            issue: `Повышенная насыщенность страницы значимыми элементами (${meaningfulElements.length})`,
            status: "warning"
        });
    }

    // 2. Средняя глубина DOM
    if (avgDepth > 14) {
        results.push({
            moduleName: "Структурная сложность",
            item: "DOM-структура",
            issue: `Высокая средняя глубина вложенности (${round(avgDepth)})`,
            status: "error"
        });
    } else if (avgDepth > 10) {
        results.push({
            moduleName: "Структурная сложность",
            item: "DOM-структура",
            issue: `Повышенная средняя глубина вложенности (${round(avgDepth)})`,
            status: "warning"
        });
    }

    // 3. Максимальная глубина DOM
    if (maxDepth > 25) {
        results.push({
            moduleName: "Структурная сложность",
            item: "DOM-структура",
            issue: `Критически высокая глубина вложенности отдельных элементов (${maxDepth})`,
            status: "error"
        });
    } else if (maxDepth > 18) {
        results.push({
            moduleName: "Структурная сложность",
            item: "DOM-структура",
            issue: `Повышенная глубина вложенности отдельных элементов (${maxDepth})`,
            status: "warning"
        });
    }

    // 4. Количество интерактивных элементов
    if (interactiveElements.length > 50) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Интерактивные элементы",
            issue: `Высокое количество интерактивных элементов (${interactiveElements.length}) может затруднять навигацию`,
            status: "warning"
        });
    }

    // 5. Доля интерактивных элементов
    if (interactivityRatio > 0.45) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Интерактивные элементы",
            issue: `Высокая доля интерактивных элементов (${round(interactivityRatio * 100)}%)`,
            status: "warning"
        });
    }

    // 6. Перегруженность верхней области страницы
    if (aboveTheFoldBlocks.length > 12) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Верхняя часть страницы",
            issue: `Перегруженность верхней области страницы визуальными блоками (${aboveTheFoldBlocks.length})`,
            status: "warning"
        });
    }

    // 7. Плотность элементов above the fold
    if (foldDensity > 12) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Верхняя часть страницы",
            issue: `Высокая плотность значимых элементов в зоне первичного восприятия (${round(foldDensity)})`,
            status: "warning"
        });
    }

    // 8. Избыточное число заголовков
    if (headings.length > 20) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Заголовки",
            issue: `Слишком большое количество заголовков (${headings.length}) может усложнять восприятие структуры`,
            status: "warning"
        });
    }

    // 9. Интегральная оценка сложности
    if (complexityScore >= 9) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Итоговая оценка",
            issue: `Высокая структурная сложность страницы (score = ${complexityScore})`,
            status: "error"
        });
    } else if (complexityScore >= 5) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Итоговая оценка",
            issue: `Повышенная структурная сложность страницы (score = ${complexityScore})`,
            status: "warning"
        });
    }

    if (results.length === 0) {
        results.push({
            moduleName: "Структурная сложность",
            item: "Страница",
            issue: "OK",
            status: "ok"
        });
    }

    return results;
}