import { PageSnapshot } from "../../model/types";
import { ModuleCheckResult } from "../../model/checkTypes";

type RGB = [number, number, number];

function parseColor(color?: string): RGB | null {
    if (!color) return null;

    const matches = color.match(/[\d.]+/g);
    if (!matches || matches.length < 3) return null;

    const r = Number(matches[0]);
    const g = Number(matches[1]);
    const b = Number(matches[2]);

    if ([r, g, b].some((v) => Number.isNaN(v))) return null;

    return [r, g, b];
}

function luminance([r, g, b]: RGB): number {
    const transform = (v: number): number => {
        const value = v / 255;
        return value <= 0.03928
            ? value / 12.92
            : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const R = transform(r);
    const G = transform(g);
    const B = transform(b);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fg: RGB, bg: RGB): number {
    const l1 = luminance(fg);
    const l2 = luminance(bg);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

function isLargeText(fontSize?: string, fontWeight?: string): boolean {
    if (!fontSize) return false;

    const sizePx = parseFloat(fontSize);
    const weight = parseInt(fontWeight || "400", 10);

    if (Number.isNaN(sizePx)) return false;

    return sizePx >= 24 || (sizePx >= 18.66 && weight >= 700);
}

function normalizeText(text: string): string {
    return text.replace(/\s+/g, " ").trim();
}

export function ContrastChecker(snapshot: PageSnapshot): ModuleCheckResult[] {
    const results: ModuleCheckResult[] = [];

    const textElements = snapshot.elements.filter((el) => {
        return (
            el.isTextCandidate === true &&
            !!el.text &&
            normalizeText(el.text).length > 0
        );
    });

    for (const el of textElements) {
        const text = normalizeText(el.text).slice(0, 60);
        const fg = parseColor(el.resolvedTextColor || el.color);
        const bg = parseColor(el.resolvedBackgroundColor || el.backgroundColor);

        if (!fg || !bg) {
            results.push({
                moduleName: "Контраст текста",
                item: text || el.tagName,
                issue: "Не удалось вычислить цвета текста и фона для анализа контраста",
                status: "warning"
            });
            continue;
        }

        const ratio = contrastRatio(fg, bg);
        const large = isLargeText(el.fontSize, el.fontWeight);
        const threshold = large ? 3 : 4.5;

        if (ratio < threshold) {
            results.push({
                moduleName: "Контраст текста",
                item: text || el.tagName,
                issue: `Недостаточный контраст (${ratio.toFixed(2)}:1, требуется не менее ${threshold}:1)`,
                status: "error"
            });
            continue;
        }

        if (ratio < threshold + 0.5) {
            results.push({
                moduleName: "Контраст текста",
                item: text || el.tagName,
                issue: `Пограничный контраст (${ratio.toFixed(2)}:1)`,
                status: "warning"
            });
        }
    }

    if (results.length === 0) {
        results.push({
            moduleName: "Контраст текста",
            item: "Страница",
            issue: "OK",
            status: "ok"
        });
    }

    return results;
}