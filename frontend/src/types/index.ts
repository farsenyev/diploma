export type CheckStatus = 'ok' | 'warning' | 'error';
export type WcagLevel = 'A' | 'AA' | 'AAA';

export interface ModuleCheckResult {
    moduleName: string;
    item: string;
    issue: string;
    status: CheckStatus;
    wcagLvl?: WcagLevel;
}

export interface RawDomElement {
    id: string;
    tagName: string;
    text: string;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    display: string;
    visibility: string;
    attributes?: Record<string, string>;
    tabIndex?: number;
    disabled?: boolean;
    depth?: number;
    color?: string;
    backgroundColor?: string;
    resolvedTextColor?: string;
    resolvedBackgroundColor?: string;
    fontSize?: string;
    fontWeight?: string;
    isTextCandidate?: boolean;
}

export interface PageSnapshot {
    url: string;
    title: string;
    elements: RawDomElement[];
}

export type VisualElementType =
    | 'heading'
    | 'text'
    | 'image'
    | 'button'
    | 'link'
    | 'input'
    | 'container'
    | 'list'
    | 'table'
    | 'media'
    | 'other';

export interface VisualElement {
    id: string;
    sourceId: string;
    tagName: string;
    type: VisualElementType;
    text: string;
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    isVisible: boolean;
    importanceScore: number;
    readingOrder?: number;
    parentBlockId?: string;
}

export type VisualBlockType =
    | 'header'
    | 'navigation'
    | 'main'
    | 'sidebar'
    | 'footer'
    | 'section'
    | 'form'
    | 'card'
    | 'group';

export interface VisualBlock {
    id: string;
    type: VisualBlockType;
    elementIds: string[];
    rect: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    readingOrder: number;
}

export interface VisualStructureModel {
    url: string;
    title: string;
    visualElements: VisualElement[];
    visualBlocks: VisualBlock[];
    readingSequence: string[];
}

export interface RecommendationItem {
    moduleName: string;
    recommendation: string;
    priority: 'low' | 'medium' | 'high';
}

export interface AnalysisReport {
    results: ModuleCheckResult[];
    summary: {
        total: number;
        ok: number;
        warnings: number;
        errors: number;
    };
    modules: {
        moduleName: string;
        total: number;
        ok: number;
        warnings: number;
        errors: number;
    }[];
    score: number;
    grade: string;
    recommendations: RecommendationItem[];
}

export interface AnalyzeResponse {
    snapshot: PageSnapshot;
    visualModel: VisualStructureModel;
    report: AnalysisReport;
}