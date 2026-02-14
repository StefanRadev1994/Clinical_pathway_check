/** @typedef {import('./types.js').Chunk} Chunk */
/** @typedef {import('./types.js').ChunkSummary} ChunkSummary */

const DEF_HINTS = [/\bdefined as\b/i, /\bis\b/i, /\brefers to\b/i];
const MECH_HINTS = [/\bmechanism\b/i, /\bpathway\b/i, /\bleads to\b/i, /\bcauses\b/i];
const STEP_HINTS = [/\bfirst\b/i, /\bsecond\b/i, /\bthen\b/i, /\bstep\b/i, /\bnext\b/i];
const EVID_HINTS = [/\bstudy\b/i, /\btrial\b/i, /\bresult\b/i, /\b%\b/, /\bp-value\b/i, /\bevidence\b/i];
const CONC_HINTS = [/\bin conclusion\b/i, /\btherefore\b/i, /\brecommend\b/i, /\bsummary\b/i];

function sentenceSplit(text) {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

function collectByHints(sentences, hints, max = 4) {
  return sentences.filter((s) => hints.some((h) => h.test(s))).slice(0, max);
}

function extractKeyTerms(text) {
  const matches = text.match(/\b[A-Z][a-zA-Z\-]{3,}\b/g) || [];
  return [...new Set(matches)].slice(0, 8);
}

/**
 * Local deterministic summarizer. Replaceable with LLM call for higher quality.
 * @param {Chunk} chunk
 * @returns {ChunkSummary}
 */
export function summarizeChunkToJson(chunk) {
  const sentences = sentenceSplit(chunk.text);

  const keyDefinitions = collectByHints(sentences, DEF_HINTS, 4);
  const mechanisms = collectByHints(sentences, MECH_HINTS, 4);
  const steps = collectByHints(sentences, STEP_HINTS, 5);
  const evidence = collectByHints(sentences, EVID_HINTS, 4);
  const conclusions = collectByHints(sentences, CONC_HINTS, 3);

  return {
    chunkId: chunk.chunkId,
    heading: chunk.heading,
    keyDefinitions,
    mechanisms,
    steps,
    evidence,
    conclusions,
    keyTerms: extractKeyTerms(chunk.text),
    sourceRange: { startPage: chunk.startPage, endPage: chunk.endPage },
  };
}
