import { VisualElement } from "../model/types";

function getTypePriority(type: VisualElement["type"]): number {
    switch (type) {
        case "heading":
            return 1;
        case "text":
            return 2;
        case "image":
            return 3;
        case "button":
        case "link":
        case "input":
            return 4;
        case "list":
        case "table":
        case "media":
            return 5;
        case "container":
            return 6;
        default:
            return 10;
    }
}

export function assignReadingOrder(elements: VisualElement[]): {
    orderedElements: VisualElement[];
    readingSequence: string[];
} {
    const significantElements = elements.filter((el) => {
        const hasSize = el.rect.width > 0 && el.rect.height > 0;
        const hasMeaningfulContent =
            el.text.trim().length > 0 ||
            ["heading", "image", "button", "link", "input", "list", "table", "media"].includes(el.type);

        return el.isVisible && hasSize && hasMeaningfulContent;
    });

    const orderedElements = [...significantElements]
        .sort((a, b) => {
            const rowThreshold = 20;

            const sameRow = Math.abs(a.rect.y - b.rect.y) < rowThreshold;
            if (sameRow) {
                if (a.rect.x !== b.rect.x) return a.rect.x - b.rect.x;

                const typePriorityDiff = getTypePriority(a.type) - getTypePriority(b.type);
                if (typePriorityDiff !== 0) return typePriorityDiff;

                return b.importanceScore - a.importanceScore;
            }

            if (a.rect.y !== b.rect.y) return a.rect.y - b.rect.y;

            if (a.rect.x !== b.rect.x) return a.rect.x - b.rect.x;

            const typePriorityDiff = getTypePriority(a.type) - getTypePriority(b.type);
            if (typePriorityDiff !== 0) return typePriorityDiff;

            return b.importanceScore - a.importanceScore;
        })
        .map((el, index) => ({
            ...el,
            readingOrder: index
        }));

    const readingSequence = orderedElements.map((el) => el.id);

    return {
        orderedElements,
        readingSequence
    };
}