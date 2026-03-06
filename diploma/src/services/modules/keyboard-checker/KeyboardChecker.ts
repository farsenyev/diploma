import type {CheckStatus, KeyboardElementData, ModuleCheckResult} from "../../../types";

export const KeyboardChecker = (
    elements: KeyboardElementData[]
): ModuleCheckResult[] => {
  const isHidden = (el: KeyboardElementData): boolean => {
    return (
        el.display === 'none' ||
        el.visibility === 'hidden' ||
        el.opacity === '0'
    );
  };

  const hasFocusableTabIndex = (el: KeyboardElementData): boolean => {
    return el.tabIndexAttr !== null && Number(el.tabIndexAttr) >= 0;
  };

  const hasPositiveTabIndex = (el: KeyboardElementData): boolean => {
    return el.tabIndexAttr !== null && Number(el.tabIndexAttr) > 0;
  };

  const results: ModuleCheckResult[] = [];

  elements.forEach((el) => {
    const identifier =
        el.ariaLabel || el.id || el.tag.toLowerCase();

    if (isHidden(el) && (el.isNaturallyFocusable || hasFocusableTabIndex(el))) {
      results.push({
        moduleName: 'Клавиатурная навигация',
        item: identifier,
        issue: 'Элемент скрыт, но доступен для фокуса',
        status: 'error' as CheckStatus,
      });
    }

    if (el.tabIndexAttr === '-1') {
      results.push({
        moduleName: 'Клавиатурная навигация',
        item: identifier,
        issue: 'tabindex="-1" делает элемент недоступным из клавиатурной навигации',
        status: 'warning' as CheckStatus,
      });
    }

    if (!el.isNaturallyFocusable && !hasFocusableTabIndex(el)) {
      results.push({
        moduleName: 'Клавиатурная навигация',
        item: identifier,
        issue: 'Интерактивный элемент не доступен для клавиатурного фокуса',
        status: 'error' as CheckStatus,
      });
    }

    if (hasPositiveTabIndex(el)) {
      results.push({
        moduleName: 'Клавиатурная навигация',
        item: identifier,
        issue: 'tabindex > 0 нарушает естественный порядок фокуса',
        status: 'warning' as CheckStatus,
      });
    }

    if (el.outlineStyle === 'none' || el.outlineWidth === '0px') {
      results.push({
        moduleName: 'Клавиатурная навигация',
        item: identifier,
        issue: 'Фокус может не иметь видимого индикатора',
        status: 'warning' as CheckStatus,
      });
    }
  });

  return results;
};