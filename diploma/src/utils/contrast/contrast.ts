// Коэффициенты яркости цветовых каналов
const RED_LUMINANCE_COEFFICIENT = 0.2126;
const GREEN_LUMINANCE_COEFFICIENT = 0.7152;
const BLUE_LUMINANCE_COEFFICIENT = 0.0722;

// Параметры гамма-коррекции sRGB
const SRGB_THRESHOLD = 0.03928;
const SRGB_DIVISOR = 12.92;
const SRGB_OFFSET = 0.055;
const SRGB_SCALE = 1.055;
const SRGB_EXPONENT = 2.4;

// Константа WCAG для вычисления контрастного соотношения
const CONTRAST_OFFSET = 0.05;

// Преобразование HEX в RGB
const hexToRgb = (hex: string) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

export const rgbToHex = (rgb: string): string => {
  const match = rgb.match(/\d+/g);
  if (!match) return '#000000';
  const [r, g, b] = match.map(Number);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

//  Преобразование sRGB канала в линейное значение
const normalizeChannel = (value: number): number => {
  const normalized = value / 255;
  return normalized <= SRGB_THRESHOLD
    ? normalized / SRGB_DIVISOR
    : Math.pow((normalized + SRGB_OFFSET) / SRGB_SCALE, SRGB_EXPONENT);
};

// Относительная яркость цвета
const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return (
    RED_LUMINANCE_COEFFICIENT * normalizeChannel(r) +
    GREEN_LUMINANCE_COEFFICIENT * normalizeChannel(g) +
    BLUE_LUMINANCE_COEFFICIENT * normalizeChannel(b)
  );
};

// Соотношение контраста между двумя цветами
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = luminance(hexToRgb(color1));
  const lum2 = luminance(hexToRgb(color2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + CONTRAST_OFFSET) / (darkest + CONTRAST_OFFSET);
};