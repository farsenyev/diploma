import type {CheckStatus, ModuleCheckResult, RuntimeElementData} from "../../../types";
import {getContrastRatio, rgbToHex} from "../../../utils/contrast/contrast.ts";

const MIN_CONTRAST_RATIO_NORMAL_TEXT = 4.5;
const MIN_CONTRAST_RATIO_LARGE_TEXT = 3;

export const ContrastChecker = (
    elements: RuntimeElementData[]
): ModuleCheckResult[] => {
  return elements.map((el) => {
    const ratio = getContrastRatio(
        rgbToHex(el.textColor),
        rgbToHex(el.bgColor)
    );

    const fontSize = parseFloat(el.fontSize);
    const fontWeight = el.fontWeight.trim();

    const isBold =
        fontWeight === 'bold' || Number(fontWeight) >= 700;

    const isLargeText =
        fontSize >= 18 || (fontSize >= 14 && isBold);

    const required = isLargeText
        ? MIN_CONTRAST_RATIO_LARGE_TEXT
        : MIN_CONTRAST_RATIO_NORMAL_TEXT;

    const passed = ratio >= required;

    return {
      moduleName: 'Цветовая контрастность',
      item:
          el.tag.toLowerCase() +
          (el.id ? `#${el.id}` : '') +
          (el.className ? `.${el.className}` : ''),
      issue: `Контраст ${ratio.toFixed(2)} (норма ≥ ${required})`,
      status: (passed ? 'ok' : 'warning') as CheckStatus,
    };
  });
};