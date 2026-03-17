import { VisualElement } from "../../model/types";
import { ModuleCheckResult, CheckStatus } from "../../model/checkTypes";

function getHeadingLevel(tag: string): number | null {
    const match = tag.match(/^h([1-6])$/);
    return match ? parseInt(match[1], 10) : null;
}

export function HeadingHierarchyChecker(
    elements: VisualElement[]
): ModuleCheckResult[] {
    const headings = elements
        .filter((el) => /^h[1-6]$/.test(el.tagName))
        .sort((a, b) => (a.readingOrder ?? 0) - (b.readingOrder ?? 0));

    const results: ModuleCheckResult[] = [];

    if (headings.length === 0) {
        return [
            {
                moduleName: "Иерархия заголовков",
                item: "Страница",
                issue: "На странице отсутствуют заголовки",
                status: "warning"
            }
        ];
    }

    // Проверка наличия h1
    const hasH1 = headings.some((h) => h.tagName === "h1");

    if (!hasH1) {
        results.push({
            moduleName: "Иерархия заголовков",
            item: "Страница",
            issue: "Отсутствует заголовок h1",
            status: "error"
        });
    }

    // Проверка иерархии
    let prevLevel: number | null = null;

    for (const h of headings) {
        const currentLevel = getHeadingLevel(h.tagName);

        if (!currentLevel) continue;

        if (prevLevel !== null) {
            if (currentLevel - prevLevel > 1) {
                results.push({
                    moduleName: "Иерархия заголовков",
                    item: h.text || h.tagName,
                    issue: `Нарушение иерархии: переход с h${prevLevel} на h${currentLevel}`,
                    status: "error"
                });
            }
        }

        prevLevel = currentLevel;
    }

    // Если всё ок
    if (results.length === 0) {
        results.push({
            moduleName: "Иерархия заголовков",
            item: "Страница",
            issue: "OK",
            status: "ok"
        });
    }

    return results;
}