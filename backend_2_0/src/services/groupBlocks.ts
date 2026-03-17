import { VisualBlock, VisualBlockType, VisualElement } from "../model/types";

function getBlockType(el: VisualElement): VisualBlockType {
    if (el.tagName === "header") return "header";
    if (el.tagName === "nav") return "navigation";
    if (el.tagName === "main") return "main";
    if (el.tagName === "aside") return "sidebar";
    if (el.tagName === "footer") return "footer";
    if (el.tagName === "form") return "form";
    if (el.type === "container") return "section";
    return "group";
}

function mergeRects(
    elements: VisualElement[]
): { x: number; y: number; width: number; height: number } {
    const minX = Math.min(...elements.map((e) => e.rect.x));
    const minY = Math.min(...elements.map((e) => e.rect.y));
    const maxX = Math.max(...elements.map((e) => e.rect.x + e.rect.width));
    const maxY = Math.max(...elements.map((e) => e.rect.y + e.rect.height));

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}

export function groupBlocks(elements: VisualElement[]): VisualBlock[] {
    const grouped = new Map<string, VisualElement[]>();

    for (const el of elements) {
        const key =
            el.type === "container"
                ? `${el.tagName}-${Math.round(el.rect.y / 100)}`
                : `content-${Math.round(el.rect.y / 200)}`;

        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key)!.push(el);
    }

    const blocks: VisualBlock[] = Array.from(grouped.entries()).map(([key, els], index) => ({
        id: `block-${index}`,
        type: getBlockType(els[0]),
        elementIds: els.map((e) => e.id),
        rect: mergeRects(els),
        readingOrder: index
    }));

    return blocks.sort((a, b) => a.rect.y - b.rect.y).map((block, index) => ({
        ...block,
        readingOrder: index
    }));
}