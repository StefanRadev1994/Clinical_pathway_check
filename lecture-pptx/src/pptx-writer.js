import PptxGenJS from "pptxgenjs";

/**
 * @param {Array<{title:string,bullets:string[],speakerNotes:string,figure:{placeholder:string,caption:string}|null}>} slides
 * @param {string} outputPath
 */
export async function writePptx(slides, outputPath) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Clinical Pathway Lecture Builder";
  pptx.subject = "Auto-generated lecture deck";
  pptx.title = "Document to Lecture Slides";

  for (const spec of slides) {
    const slide = pptx.addSlide();
    slide.addText(spec.title, { x: 0.5, y: 0.3, w: 12, h: 0.6, fontSize: 28, bold: true, color: "1F2937" });

    slide.addText(spec.bullets.map((b) => ({ text: b, options: { bullet: { indent: 18 } } })), {
      x: 0.8,
      y: 1.2,
      w: 7.8,
      h: 4.6,
      fontSize: 20,
      color: "111827",
      breakLine: true,
      paraSpaceAfterPt: 12,
    });

    if (spec.figure) {
      slide.addShape(pptx.ShapeType.rect, { x: 8.8, y: 1.5, w: 4.0, h: 2.8, line: { color: "9CA3AF" }, fill: { color: "F9FAFB" } });
      slide.addText(spec.figure.placeholder, { x: 9.1, y: 2.65, w: 3.4, h: 0.3, fontSize: 12, align: "center", color: "6B7280" });
      slide.addText(spec.figure.caption, { x: 8.8, y: 4.4, w: 4.1, h: 0.5, fontSize: 11, color: "374151" });
    }

    slide.addNotes(spec.speakerNotes);
  }

  await pptx.writeFile({ fileName: outputPath });
}
