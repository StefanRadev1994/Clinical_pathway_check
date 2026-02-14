# Long-Document to Lecture PPTX Pipeline

## File/Folder Structure

```text
lecture-pptx/
  package.json
  README.md
  src/
    types.js
    extract.js
    chunk.js
    summarize.js
    merge-outline.js
    slide-generator.js
    qa.js
    pptx-writer.js
    pipeline.js
    cli.js
  examples/
    run-sample.js
    sample-output.pptx (generated)
```

## Implementation Plan

1. **PDF extraction with page mapping**
   - Parse each page with `pdfjs-dist`.
   - Keep `[{ pageNumber, text }]` to preserve citation integrity.
2. **Chunking strategy**
   - Primary split by heading-like sentences.
   - Secondary split by max chunk size to support 400-page documents.
3. **Chunk summarization into structured JSON**
   - For each chunk, extract definitions, mechanisms, steps, evidence, conclusions, key terms.
   - Store source range (`startPage`, `endPage`) for traceability.
4. **Cross-chunk merging**
   - Group chunk summaries into section outlines.
   - Deduplicate key terms and combine slide candidates.
5. **SlideSpec generation**
   - Enforce 4–6 bullets by default.
   - Auto-generate speaker notes (80–140 words target) and append `Sources: p.X–p.Y`.
   - Add one **Key Terms** slide per section.
   - Add final **Takeaways + Exam Questions** slide.
6. **PPTX writing**
   - Use `pptxgenjs` to render title, bullets, optional figure placeholder/caption, and notes.
7. **QA module**
   - Check heading coverage, target slide count, duplication, and missing definition/evidence warnings.
8. **CLI + sample demo**
   - `src/cli.js` for real PDFs.
   - `examples/run-sample.js` for an end-to-end local demo without external inputs.

## Data Structures

The core data structures are defined in `src/types.js`:
- `Chunk`
- `ChunkSummary`
- `SectionOutline`
- `SlideSpec`

## Usage

```bash
npm install
npm run example
node src/cli.js /path/to/input.pdf output.pptx
```

## Notes on Citation Safety

- Only page ranges from extracted text are used.
- All speaker notes include `Sources: p.X–p.Y`.
- No synthetic page references are created.
