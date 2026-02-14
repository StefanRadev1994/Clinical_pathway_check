import { extractPdfTextWithPages } from "./extract.js";
import { chunkDocument } from "./chunk.js";
import { summarizeChunkToJson } from "./summarize.js";
import { buildGlobalOutline } from "./merge-outline.js";
import { buildSlideSpecs } from "./slide-generator.js";
import { runQaChecks } from "./qa.js";
import { writePptx } from "./pptx-writer.js";

/**
 * End-to-end pipeline for PDF => structured lecture PPTX.
 * @param {{pdfPath?:string, extracted?:{pages:Array<{pageNumber:number,text:string}>,totalPages:number}, controls:{targetAudience:string,slideCountTarget?:number,slidesPer10Pages?:number,verbosity?:'standard'|'concise'|'detailed',includeFigures?:boolean}, outputPath:string}} params
 */
export async function generateLectureDeck(params) {
  const extracted = params.extracted ?? await extractPdfTextWithPages(params.pdfPath);
  const chunks = chunkDocument(extracted);
  const summaries = chunks.map(summarizeChunkToJson);
  const sections = buildGlobalOutline(summaries);

  const slides = buildSlideSpecs(sections, {
    ...params.controls,
    totalPages: extracted.totalPages,
  });

  const qa = runQaChecks({
    sections,
    slides,
    controls: {
      ...params.controls,
      totalPages: extracted.totalPages,
    },
  });

  await writePptx(slides, params.outputPath);

  return {
    extracted,
    chunks,
    summaries,
    sections,
    slides,
    qa,
  };
}
