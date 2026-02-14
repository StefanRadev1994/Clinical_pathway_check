import { generateLectureDeck } from "./pipeline.js";

async function main() {
  const [, , pdfPath = "", outputPath = "lecture-output.pptx"] = process.argv;
  if (!pdfPath) {
    console.error("Usage: node src/cli.js <input.pdf> [output.pptx]");
    process.exit(1);
  }

  const result = await generateLectureDeck({
    pdfPath,
    outputPath,
    controls: {
      targetAudience: "medical students",
      verbosity: "standard",
      includeFigures: false,
      slidesPer10Pages: 4,
    },
  });

  console.log(`Generated ${result.slides.length} slides to ${outputPath}`);
  if (result.qa.warnings.length) {
    console.log("QA warnings:");
    for (const warning of result.qa.warnings) console.log(`- ${warning}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
