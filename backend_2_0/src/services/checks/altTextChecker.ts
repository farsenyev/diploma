import {PageSnapshot} from "../../model/types";
import {ModuleCheckResult} from "../../model/checkTypes";

const BAD_PATTERNS = [
    "image",
    "img",
    "photo",
    "picture",
    "graphic",
    "banner",
    "icon",
    "logo image",
    "decorative image"
];

function isDecorativeImage(attrs: Record<string, string>): boolean {
    const role = attrs.role?.toLowerCase();
    const ariaHidden = attrs["aria-hidden"]?.toLowerCase();

    return role === "presentation" || role === "none" || ariaHidden === "true";
}

function isSuspiciousAlt(alt: string): boolean {
    const normalized = alt.trim().toLowerCase();

    return BAD_PATTERNS.includes(normalized);
}

function extractFileName(src: string): string {
    try {
        const clean = src.split("?")[0].split("#")[0];
        return clean.split("/").pop()?.toLowerCase() || "";
    } catch {
        return "";
    }
}

function altLooksLikeFileName(alt: string, src: string): boolean {
    const normalizedAlt = alt.trim().toLowerCase();
    const fileName = extractFileName(src);

    if (!fileName) return false;

    const fileNameWithoutExt = fileName.replace(/\.[a-z0-9]+$/, "");
    return (
        normalizedAlt === fileName ||
        normalizedAlt === fileNameWithoutExt ||
        normalizedAlt.replace(/\s+/g, "") === fileNameWithoutExt.replace(/[-_]/g, "")
    );
}

export function AltTextChecker(snapshot: PageSnapshot): ModuleCheckResult[] {
    const images = snapshot.elements.filter((el) => el.tagName === "img");

    if (images.length === 0) {
        return [
            {
                moduleName: "Альтернативный текст",
                item: "Страница",
                issue: "На странице отсутствуют изображения",
                status: "ok"
            }
        ];
    }

    return images.map((img) => {
        const attrs = img.attributes || {};
        const alt = attrs.alt;
        const src = attrs.src || "Не указан src";
        const decorative = isDecorativeImage(attrs);

        if (alt === undefined) {
            return {
                moduleName: "Альтернативный текст",
                item: src,
                issue: "Отсутствует атрибут alt",
                status: "error"
            };
        }

        if (alt.trim() === "") {
            if (decorative) {
                return {
                    moduleName: "Альтернативный текст",
                    item: src,
                    issue: "Пустой alt допустим для декоративного изображения",
                    status: "ok"
                };
            }

            return {
                moduleName: "Альтернативный текст",
                item: src,
                issue: "Пустой alt у содержательного изображения",
                status: "error"
            };
        }

        if (isSuspiciousAlt(alt)) {
            return {
                moduleName: "Альтернативный текст",
                item: src,
                issue: `Подозрительное значение alt: "${alt}"`,
                status: "warning"
            };
        }

        if (altLooksLikeFileName(alt, src)) {
            return {
                moduleName: "Альтернативный текст",
                item: src,
                issue: "Значение alt похоже на имя файла изображения",
                status: "warning"
            };
        }

        if (alt.length > 150) {
            return {
                moduleName: "Альтернативный текст",
                item: src,
                issue: "Слишком длинное значение alt",
                status: "warning"
            };
        }

        return {
            moduleName: "Альтернативный текст",
            item: src,
            issue: "OK",
            status: "ok"
        };
    });
}