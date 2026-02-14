import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * @typedef {{pageNumber:number,text:string}} PageText
 */

/**
 * Extracts text from a PDF with explicit page mapping.
 * @param {string} pdfPath
 * @returns {Promise<{pages: PageText[], totalPages:number}>}
 */
export async function extractPdfTextWithPages(pdfPath) {
  const raw = await fs.readFile(pdfPath);
  const loadingTask = pdfjsLib.getDocument({ data: raw });
  const pdf = await loadingTask.promise;

  /** @type {PageText[]} */
  const pages = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push({ pageNumber: i, text });
  }

  return { pages, totalPages: pdf.numPages };
}

/**
 * Utility for tests/examples where text is already available by page.
 * @param {string[]} pageTexts
 */
export function fromPageTextArray(pageTexts) {
  return {
    totalPages: pageTexts.length,
    pages: pageTexts.map((text, idx) => ({ pageNumber: idx + 1, text: text.trim() })),
  };
}
