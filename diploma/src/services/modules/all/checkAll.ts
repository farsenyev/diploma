import type {ModuleCheckResult, PageSnapshot} from "../../../types";
import {parseHtmlToDocument} from "../../parseHTML.ts";
import {AltChecker} from "../alt-checker/AltChecker.ts";
import {StructureChecker} from "../structure-checker/StructureChecker.ts";
import {ContrastChecker} from "../contrast-checker/ContrastCheker.ts";
import {KeyboardChecker} from "../keyboard-checker/KeyboardChecker.ts";
import {MediaChecker} from "../media-checker/MediaChecker.ts";
import {ScalabilityChecker} from "../scalability-checker/ScalabilityChecker.ts";

export async function checkAll(snapshot: PageSnapshot): Promise<ModuleCheckResult[]> {
    const doc = parseHtmlToDocument(snapshot.html);

    return [
        ...AltChecker(doc),
        ...StructureChecker(doc),
        ...ContrastChecker(snapshot.elements),
        ...KeyboardChecker(snapshot.keyboardElements),
        ...MediaChecker(snapshot.mediaElements),
        ...ScalabilityChecker(snapshot.scalabilityIssues),
    ];
}