import { RawDomElement, VisualElement, VisualElementType } from "../model/types";

function detectType(el: RawDomElement): VisualElementType {
    const tag = el.tagName;
    const attrs = el.attributes || {};

    if (/^h[1-6]$/.test(tag)) return "heading";
    if (tag === "img") return "image";
    if (tag === "button") return "button";
    if (tag === "a") return "link";
    if (["input", "select", "textarea"].includes(tag)) return "input";
    if (["ul", "ol"].includes(tag)) return "list";
    if (tag === "table") return "table";
    if (["video", "audio"].includes(tag)) return "media";

    if (
        ["header", "nav", "main", "section", "article", "aside", "footer", "form"].includes(tag)
    ) {
        return "container";
    }

    if (tag === "p" || (tag === "span" && el.text.length > 0)) return "text";

    if (tag === "div") {
        if (attrs.role === "button") return "button";
        if (attrs.role === "navigation") return "container";
        return "container";
    }

    return "other";
}

function calcImportance(el: RawDomElement, type: VisualElementType): number {
    let score = 0;

    if (type === "heading") score += 5;
    if (type === "button" || type === "link" || type === "input") score += 4;
    if (type === "image") score += 3;
    if (type === "text") score += 2;
    if (type === "container") score += 1;

    if (el.rect.width * el.rect.height > 50000) score += 2;
    if (el.rect.y < 800) score += 2;
    if (el.text.length > 30) score += 1;

    return score;
}

export function classifyElements(elements: RawDomElement[]): VisualElement[] {
    return elements
        .filter((el) => {
            const isVisible = el.display !== "none" && el.visibility !== "hidden";
            const hasSize = el.rect.width > 0 && el.rect.height > 0;
            return isVisible && hasSize;
        })
        .map((el) => {
            const type = detectType(el);

            return {
                id: `ve-${el.id}`,
                sourceId: el.id,
                tagName: el.tagName,
                type,
                text: el.text,
                rect: el.rect,
                isVisible: true,
                importanceScore: calcImportance(el, type)
            };
        });
}