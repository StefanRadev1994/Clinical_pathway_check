/** @typedef {import('./types.js').Chunk} Chunk */

const HEADING_REGEX = /^(?:\d+(?:\.\d+)*)?\s*(?:[A-Z][A-Z\s\-]{3,}|[A-Z][^\n:]{2,80}:)$/;

function splitIntoParagraphs(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function detectHeading(sentence) {
  const normalized = sentence.trim();
  if (normalized.length > 100) return false;
  return HEADING_REGEX.test(normalized);
}

/**
 * Chunk pages by heading boundaries first, and by max characters second.
 * @param {{pages:Array<{pageNumber:number,text:string}>}} extracted
 * @param {{maxCharsPerChunk?:number}} [opts]
 * @returns {Chunk[]}
 */
export function chunkDocument(extracted, opts = {}) {
  const maxCharsPerChunk = opts.maxCharsPerChunk ?? 5000;
  /** @type {Chunk[]} */
  const chunks = [];

  let current = null;
  let chunkCounter = 1;

  const flushCurrent = () => {
    if (!current || current.paragraphs.length === 0) return;
    current.text = current.paragraphs.join(" ");
    chunks.push(current);
    current = null;
  };

  for (const page of extracted.pages) {
    const paragraphs = splitIntoParagraphs(page.text);

    for (const paragraph of paragraphs) {
      const isHeading = detectHeading(paragraph);

      if (!current) {
        current = {
          chunkId: `chunk-${chunkCounter++}`,
          heading: isHeading ? paragraph.replace(/:$/, "") : "Untitled Section",
          startPage: page.pageNumber,
          endPage: page.pageNumber,
          paragraphs: [],
          text: "",
        };
      }

      if (isHeading && current.paragraphs.length > 0) {
        flushCurrent();
        current = {
          chunkId: `chunk-${chunkCounter++}`,
          heading: paragraph.replace(/:$/, ""),
          startPage: page.pageNumber,
          endPage: page.pageNumber,
          paragraphs: [],
          text: "",
        };
        continue;
      }

      current.paragraphs.push(paragraph);
      current.endPage = page.pageNumber;

      const charCount = current.paragraphs.join(" ").length;
      if (charCount >= maxCharsPerChunk) {
        flushCurrent();
      }
    }
  }

  flushCurrent();
  return chunks;
}
