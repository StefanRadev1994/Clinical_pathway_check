/**
 * @typedef {Object} Chunk
 * @property {string} chunkId
 * @property {string} heading
 * @property {number} startPage
 * @property {number} endPage
 * @property {string[]} paragraphs
 * @property {string} text
 */

/**
 * @typedef {Object} ChunkSummary
 * @property {string} chunkId
 * @property {string} heading
 * @property {string[]} keyDefinitions
 * @property {string[]} mechanisms
 * @property {string[]} steps
 * @property {string[]} evidence
 * @property {string[]} conclusions
 * @property {string[]} keyTerms
 * @property {{startPage:number,endPage:number}} sourceRange
 */

/**
 * @typedef {Object} SectionOutline
 * @property {string} title
 * @property {string[]} keyTerms
 * @property {Array<{title:string,bullets:string[],notePoints:string[],sourceRange:{startPage:number,endPage:number},figureCaption?:string}>} slideCandidates
 */

/**
 * @typedef {Object} SlideSpec
 * @property {string} title
 * @property {string[]} bullets
 * @property {string} speakerNotes
 * @property {{startPage:number,endPage:number}} sourceRange
 * @property {{placeholder:string,caption:string}|null} figure
 */

export {};
