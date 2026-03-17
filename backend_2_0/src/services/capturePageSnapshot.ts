import { chromium } from "playwright";
import { PageSnapshot, RawDomElement } from "../model/types";

export async function capturePageSnapshot(url: string): Promise<PageSnapshot> {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    await page.goto(url, { waitUntil: "networkidle" });

    const title = await page.title();

    const elements = await page.evaluate(() => {

        function getAttributes(el: Element): Record<string, string> {
            const attrs: Record<string, string> = {};
            for (const attr of Array.from(el.attributes)) {
                attrs[attr.name] = attr.value;
            }
            return attrs;
        }

        function isTransparent(color: string | null | undefined): boolean {
            if (!color) return true;
            const normalized = color.replace(/\s+/g, "").toLowerCase();
            return (
                normalized === "transparent" ||
                normalized === "rgba(0,0,0,0)" ||
                normalized.endsWith(",0)")
            );
        }

        function resolveBackgroundColor(el: Element): string {
            let current: Element | null = el;

            while (current) {
                const styles = window.getComputedStyle(current);
                const bg = styles.backgroundColor;

                if (!isTransparent(bg)) {
                    return bg;
                }

                current = current.parentElement;
            }

            return "rgb(255, 255, 255)";
        }

        function resolveTextColor(el: Element): string {
            const styles = window.getComputedStyle(el);
            return styles.color || "rgb(0, 0, 0)";
        }

        function isTextCandidate(el: Element, text: string): boolean {
            const tag = el.tagName.toLowerCase();
            if (!text.trim()) return false;
            if (["script", "style", "noscript"].includes(tag)) return false;

            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;

            const styles = window.getComputedStyle(el);
            return !(styles.display === "none" || styles.visibility === "hidden");
        }

        function getDepth(el: Element): number {
            let depth = 0;
            let current: Element | null = el.parentElement;

            while (current) {
                depth++;
                current = current.parentElement;
            }

            return depth;
        }

        return Array.from(document.querySelectorAll("*")).map((el, i) => {
            const rect = el.getBoundingClientRect();
            const styles = window.getComputedStyle(el);
            const htmlEl = el as HTMLElement;
            const text = (el.textContent || "").trim();

            const attrs: Record<string, string> = {};
            for (const attr of Array.from(el.attributes)) {
                attrs[attr.name] = attr.value;
            }

            return {
                id: `el-${i}`,
                tagName: el.tagName.toLowerCase(),
                text,
                rect: {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height
                },
                display: styles.display,
                visibility: styles.visibility,
                attributes: getAttributes(el),
                tabIndex: htmlEl.tabIndex,
                disabled: (htmlEl as HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement).disabled ?? false,
                color: styles.color,
                backgroundColor: styles.backgroundColor,
                resolvedTextColor: resolveTextColor(el),
                resolvedBackgroundColor: resolveBackgroundColor(el),
                fontSize: styles.fontSize,
                fontWeight: styles.fontWeight,
                isTextCandidate: isTextCandidate(el, text),
                depth: getDepth(el),
            };
        });
    });

    await browser.close();

    return {
        url,
        title,
        elements: elements as RawDomElement[]
    };
}