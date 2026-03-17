import { ModuleCheckResult, RecommendationItem } from "../model/checkTypes";

function hasError(results: ModuleCheckResult[], moduleName: string): boolean {
    return results.some(
        (r) => r.moduleName === moduleName && r.status === "error"
    );
}

function hasWarning(results: ModuleCheckResult[], moduleName: string): boolean {
    return results.some(
        (r) => r.moduleName === moduleName && r.status === "warning"
    );
}

export function buildRecommendations(
    results: ModuleCheckResult[]
): RecommendationItem[] {
    const recommendations: RecommendationItem[] = [];

    if (hasError(results, "Альтернативный текст") || hasWarning(results, "Альтернативный текст")) {
        recommendations.push({
            moduleName: "Альтернативный текст",
            recommendation:
                "Проверьте все изображения и добавьте содержательные alt-описания для значимых изображений, а декоративные изображения пометьте пустым alt или ролью presentation.",
            priority: hasError(results, "Альтернативный текст") ? "high" : "medium"
        });
    }

    if (hasError(results, "Иерархия заголовков") || hasWarning(results, "Иерархия заголовков")) {
        recommendations.push({
            moduleName: "Иерархия заголовков",
            recommendation:
                "Проверьте логическую последовательность заголовков, убедитесь в наличии h1 и избегайте пропуска уровней иерархии.",
            priority: hasError(results, "Иерархия заголовков") ? "high" : "medium"
        });
    }

    if (hasError(results, "Клавиатурная навигация") || hasWarning(results, "Клавиатурная навигация")) {
        recommendations.push({
            moduleName: "Клавиатурная навигация",
            recommendation:
                "Проверьте доступность интерактивных элементов с клавиатуры, корректность tabindex и соответствие порядка табуляции визуальной структуре страницы.",
            priority: hasError(results, "Клавиатурная навигация") ? "high" : "medium"
        });
    }

    if (hasError(results, "Контраст текста") || hasWarning(results, "Контраст текста")) {
        recommendations.push({
            moduleName: "Контраст текста",
            recommendation:
                "Увеличьте контраст между текстом и фоном для элементов с недостаточной читаемостью, особенно в ключевых областях интерфейса.",
            priority: hasError(results, "Контраст текста") ? "high" : "medium"
        });
    }

    if (hasError(results, "Структурная сложность") || hasWarning(results, "Структурная сложность")) {
        recommendations.push({
            moduleName: "Структурная сложность",
            recommendation:
                "Сократите перегруженность страницы, уменьшите число визуальных блоков и интерактивных элементов в зоне первичного восприятия, упростите иерархию интерфейса.",
            priority: hasError(results, "Структурная сложность") ? "high" : "medium"
        });
    }

    if (recommendations.length === 0) {
        recommendations.push({
            moduleName: "Общая рекомендация",
            recommendation:
                "Существенных проблем доступности не обнаружено. Рекомендуется использовать страницу как эталонную основу для дальнейшего развития интерфейса.",
            priority: "low"
        });
    }

    return recommendations;
}