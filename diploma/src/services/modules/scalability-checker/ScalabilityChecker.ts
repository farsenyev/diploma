import type {CheckStatus, ModuleCheckResult, ScalabilityIssueData} from "../../../types";

export const ScalabilityChecker = (
    issues: ScalabilityIssueData[]
): ModuleCheckResult[] => {
  return issues.map((issue) => {
    const sizeIssue =
        issue.exceedsWidth && issue.exceedsHeight
            ? 'по ширине и высоте'
            : issue.exceedsWidth
                ? 'по ширине'
                : 'по высоте';

    return {
      moduleName: 'Масштабируемость',
      item: issue.tag.toLowerCase() + (issue.id ? `#${issue.id}` : ''),
      issue: `Элемент может обрезаться ${sizeIssue} при масштабе ${issue.scale * 100}%`,
      status: 'warning' as CheckStatus,
    };
  });
};