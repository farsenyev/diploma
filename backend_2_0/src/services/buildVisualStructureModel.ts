import { PageSnapshot, VisualStructureModel } from "../model/types";
import { classifyElements } from "./classifyElements";
import { groupBlocks } from "./groupBlocks";
import {assignReadingOrder} from "./readingOrder";

export function buildVisualStructureModel(snapshot: PageSnapshot): VisualStructureModel {
    const visualElements = classifyElements(snapshot.elements);
    const visualBlocks = groupBlocks(visualElements);
    const { orderedElements, readingSequence } = assignReadingOrder(visualElements);

    return {
        url: snapshot.url,
        title: snapshot.title,
        visualElements: orderedElements,
        visualBlocks,
        readingSequence,
    };
}