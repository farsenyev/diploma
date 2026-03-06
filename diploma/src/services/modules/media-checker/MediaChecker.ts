import type {CheckStatus, MediaElementData, ModuleCheckResult} from "../../../types";

export const MediaChecker = (
    mediaElements: MediaElementData[]
): ModuleCheckResult[] => {
  const results: ModuleCheckResult[] = [];

  mediaElements.forEach((media) => {
    if (media.type === 'video') {
      if (!media.hasCaptionsOrSubtitles) {
        results.push({
          moduleName: 'Доступность мультимедиа',
          item: media.id ? `video#${media.id}` : 'video',
          issue: 'Нет субтитров/закрытых титров для видео',
          status: 'warning' as CheckStatus,
        });
      }
    }

    if (media.type === 'audio') {
      const hasTranscription =
          media.hasAriaDescribedBy || media.hasAdjacentDescription;

      if (!hasTranscription) {
        results.push({
          moduleName: 'Доступность мультимедиа',
          item: media.id ? `audio#${media.id}` : 'audio',
          issue: 'Нет транскрипта/описания аудио',
          status: 'warning' as CheckStatus,
        });
      }
    }
  });

  return results;
};