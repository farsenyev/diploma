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

    color?: string;
    backgroundColor?: string;

    resolvedTextColor?: string;
    resolvedBackgroundColor?: string;

    fontSize?: string;
    fontWeight?: string;

    isTextCandidate?: boolean;
    depth?: number;
}

export interface PageSnapshot {
    url: string;
    title: string;
    elements: RawDomElement[];
}

export type VisualElementType =
    | "heading"
    | "text"
    | "image"
    | "button"
    | "link"
    | "input"
    | "container"
    | "list"
    | "table"
    | "media"
    | "other";

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
    parentBlockId?: string;
    readingOrder?: number;
}

export type VisualBlockType =
    | "header"
    | "navigation"
    | "main"
    | "sidebar"
    | "footer"
    | "section"
    | "form"
    | "card"
    | "group";

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