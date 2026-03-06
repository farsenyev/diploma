export type CheckStatus = 'ok' | 'warning' | 'error';
export type WcagLevel = 'A' | 'AA' | 'AAA';

export interface ModuleCheckResult {
    moduleName: string;
    item: string;
    issue: string;
    status: CheckStatus;
    wcagLvl?: WcagLevel;
}

export type RuntimeElementData = {
    tag: string;
    id: string;
    className: string;
    text: string;
    textColor: string;
    bgColor: string;
    fontSize: string;
    fontWeight: string;
};

export type KeyboardElementData = {
    tag: string;
    id: string;
    ariaLabel: string;
    tabIndexAttr: string | null;
    isNaturallyFocusable: boolean;
    display: string;
    visibility: string;
    opacity: string;
    outlineStyle: string;
    outlineWidth: string;
};

export type MediaElementData =
    | {
    type: 'video';
    id: string;
    hasCaptionsOrSubtitles: boolean;
}
    | {
    type: 'audio';
    id: string;
    hasAriaDescribedBy: boolean;
    hasAdjacentDescription: boolean;
};

export type ScalabilityIssueData = {
    tag: string;
    id: string;
    scale: number;
    exceedsWidth: boolean;
    exceedsHeight: boolean;
};

export type PageSnapshot = {
    html: string;
    elements: RuntimeElementData[];
    keyboardElements: KeyboardElementData[];
    mediaElements: MediaElementData[];
    scalabilityIssues: ScalabilityIssueData[];
};

