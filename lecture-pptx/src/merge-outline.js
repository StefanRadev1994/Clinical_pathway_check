/** @typedef {import('./types.js').ChunkSummary} ChunkSummary */
/** @typedef {import('./types.js').SectionOutline} SectionOutline */

/**
 * Merge chunk summaries into section outlines while preserving structure.
 * @param {ChunkSummary[]} summaries
 * @returns {SectionOutline[]}
 */
export function buildGlobalOutline(summaries) {
  /** @type {Map<string, SectionOutline>} */
  const sectionMap = new Map();

  for (const summary of summaries) {
    const sectionTitle = summary.heading || "Untitled Section";
    if (!sectionMap.has(sectionTitle)) {
      sectionMap.set(sectionTitle, {
        title: sectionTitle,
        keyTerms: [],
        slideCandidates: [],
      });
    }

    const section = sectionMap.get(sectionTitle);
    section.keyTerms = [...new Set([...section.keyTerms, ...summary.keyTerms])].slice(0, 12);

    const bullets = [
      ...summary.keyDefinitions,
      ...summary.mechanisms,
      ...summary.steps,
      ...summary.evidence,
      ...summary.conclusions,
    ].slice(0, 8);

    const notePoints = bullets.length ? bullets : ["Core section content extracted from source text."];

    section.slideCandidates.push({
      title: sectionTitle,
      bullets,
      notePoints,
      sourceRange: summary.sourceRange,
      figureCaption: `Figure placeholder for ${sectionTitle}`,
    });
  }

  return [...sectionMap.values()];
}
