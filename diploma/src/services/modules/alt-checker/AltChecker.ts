import type {CheckStatus, ModuleCheckResult} from "../../../types";

export const AltChecker = (doc: Document): ModuleCheckResult[] => {
    const images = Array.from(doc.querySelectorAll('img'));

    return images.map((img) => {
        const alt = img.getAttribute('alt');
        const src = img.getAttribute('src');

        if (alt === null) {
            return {
                moduleName: 'Альтернативный текст',
                item: src ?? 'Не указан src',
                issue: 'Отсутствует атрибут alt',
                status: 'error' as CheckStatus,
            };
        }

        if (alt.trim() === '') {
            return {
                moduleName: 'Альтернативный текст',
                item: src ?? 'Не указан src',
                issue: 'Пустой alt',
                status: 'error' as CheckStatus,
            };
        }

        return {
            moduleName: 'Альтернативный текст',
            item: src ?? 'Не указан src',
            issue: 'OK',
            status: 'ok' as CheckStatus,
        };
    });
};