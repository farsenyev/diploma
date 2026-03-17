import { PageSnapshot, VisualStructureModel } from "../../model/types";
import { ModuleCheckResult } from "../../model/checkTypes";

function isNaturallyFocusable(tagName: string, attrs: Record<string, string>): boolean {
    if (tagName === "a" && !!attrs.href) return true;
    if (["button", "input", "select", "textarea"].includes(tagName)) return true;
    if (tagName === "iframe") return true;
    return false;
}

function isInteractive(tagName: string, attrs: Record<string, string>): boolean {
    const role = attrs.role?.toLowerCase();

    if (isNaturallyFocusable(tagName, attrs)) return true;

    if (
        role &&
        [
            "button",
            "link",
            "checkbox",
            "radio",
            "switch",
            "tab",
            "textbox",
            "menuitem"
        ].includes(role)
    ) {
        return true;
    }

    if (attrs.onclick !== undefined) return true;

    return false;
}

function isVisibleForKeyboard(el: PageSnapshot["elements"][number]): boolean {
    const attrs = el.attributes || {};
    const ariaHidden = attrs["aria-hidden"]?.toLowerCase();

    return (
        el.display !== "none" &&
        el.visibility !== "hidden" &&
        el.rect.width > 0 &&
        el.rect.height > 0 &&
        ariaHidden !== "true"
    );
}

function isKeyboardFocusable(el: PageSnapshot["elements"][number]): boolean {
    const attrs = el.attributes || {};
    const tabIndex = el.tabIndex ?? -1;
    const disabled = el.disabled === true;

    if (disabled) return false;
    if (!isVisibleForKeyboard(el)) return false;

    if (tabIndex >= 0) return true;
    if (isNaturallyFocusable(el.tagName, attrs)) return true;

    return false;
}

function getKeyboardOrder(elements: PageSnapshot["elements"]): PageSnapshot["elements"] {
    const focusable = elements.filter((el) => isKeyboardFocusable(el));

    const positiveTabIndex = focusable
        .filter((el) => (el.tabIndex ?? -1) > 0)
        .sort((a, b) => (a.tabIndex ?? 0) - (b.tabIndex ?? 0));

    const normalTabIndex = focusable.filter((el) => (el.tabIndex ?? 0) <= 0);

    return [...positiveTabIndex, ...normalTabIndex];
}

function getReadableName(el: PageSnapshot["elements"][number]): string {
    const attrs = el.attributes || {};
    return (
        el.text?.trim() ||
        attrs["aria-label"] ||
        attrs["name"] ||
        attrs["id"] ||
        attrs["src"] ||
        el.tagName
    );
}

export function KeyboardNavigationChecker(
    snapshot: PageSnapshot,
    visualModel: VisualStructureModel
): ModuleCheckResult[] {
    const results: ModuleCheckResult[] = [];
    const elements = snapshot.elements;

    const visibleInteractive = elements.filter((el) => {
        const attrs = el.attributes || {};
        return isVisibleForKeyboard(el) && isInteractive(el.tagName, attrs);
    });

    const keyboardOrder = getKeyboardOrder(elements);

    if (visibleInteractive.length === 0) {
        return [
            {
                moduleName: "Клавиатурная навигация",
                item: "Страница",
                issue: "На странице не обнаружены интерактивные элементы",
                status: "ok"
            }
        ];
    }

    if (keyboardOrder.length === 0) {
        return [
            {
                moduleName: "Клавиатурная навигация",
                item: "Страница",
                issue: "На странице отсутствуют элементы, доступные с клавиатуры",
                status: "error"
            }
        ];
    }

    // 1. Интерактивные элементы недоступны с клавиатуры
    for (const el of visibleInteractive) {
        if (!isKeyboardFocusable(el)) {
            results.push({
                moduleName: "Клавиатурная навигация",
                item: getReadableName(el),
                issue: "Интерактивный элемент недоступен с клавиатуры",
                status: "error"
            });
        }
    }

    // 2. Подозрительный tabindex > 0
    for (const el of keyboardOrder) {
        if ((el.tabIndex ?? -1) > 0) {
            results.push({
                moduleName: "Клавиатурная навигация",
                item: getReadableName(el),
                issue: `Используется tabindex=${el.tabIndex}, что может нарушать естественный порядок табуляции`,
                status: "warning"
            });
        }
    }

    // 3. Сравнение keyboard order и reading order
    const readingIndexMap = new Map<string, number>();
    visualModel.visualElements.forEach((ve) => {
        if (typeof ve.readingOrder === "number") {
            readingIndexMap.set(ve.sourceId, ve.readingOrder);
        }
    });

    const keyboardWithReading = keyboardOrder
        .map((el, index) => ({
            el,
            keyboardIndex: index,
            readingIndex: readingIndexMap.get(el.id)
        }))
        .filter((item) => item.readingIndex !== undefined);

    for (let i = 1; i < keyboardWithReading.length; i++) {
        const prev = keyboardWithReading[i - 1];
        const curr = keyboardWithReading[i];

        if ((curr.readingIndex as number) < (prev.readingIndex as number)) {
            results.push({
                moduleName: "Клавиатурная навигация",
                item: getReadableName(curr.el),
                issue:
                    "Порядок клавиатурной навигации расходится с предполагаемым порядком восприятия страницы",
                status: "warning"
            });
        }
    }

    if (results.length === 0) {
        results.push({
            moduleName: "Клавиатурная навигация",
            item: "Страница",
            issue: "OK",
            status: "ok"
        });
    }

    return results;
}