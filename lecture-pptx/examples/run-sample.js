import { fromPageTextArray } from "../src/extract.js";
import { generateLectureDeck } from "../src/pipeline.js";

const samplePages = [
  `1 INTRODUCTION TO SEPSIS. Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. The mechanism leads to endothelial injury and capillary leak. First, identify suspected infection. Second, calculate SOFA score. Then start broad-spectrum antibiotics and fluid resuscitation. A multicenter study reported 18% lower mortality when antibiotics were given within one hour. In conclusion, early recognition improves outcomes.`,
  `2 HEMODYNAMIC MANAGEMENT. Septic shock refers to sepsis with persistent hypotension requiring vasopressors despite fluids. The pathway causes mitochondrial dysfunction and tissue hypoperfusion. First, deliver 30 mL/kg crystalloid. Next, target MAP of at least 65 mmHg using norepinephrine. Trial results showed faster lactate clearance with protocolized reassessment. Therefore, serial reassessment is recommended.`,
  `3 ANTIMICROBIAL STRATEGY. Source control is defined as physical removal of infection focus. Mechanism involves reducing pathogen burden and inflammatory signaling. Step 1: obtain blood cultures before antibiotics if no delay. Step 2: narrow therapy after susceptibility results. Evidence from cohort studies shows reduced resistance when de-escalation is applied. In conclusion, stewardship and source control reduce complications.`
];

const extracted = fromPageTextArray(samplePages);

const result = await generateLectureDeck({
  extracted,
  outputPath: "lecture-pptx/examples/sample-output.pptx",
  controls: {
    targetAudience: "medical students",
    slideCountTarget: 8,
    verbosity: "standard",
    includeFigures: true,
  },
});

console.log(`Slides generated: ${result.slides.length}`);
console.log(`QA passed: ${result.qa.passed}`);
if (result.qa.warnings.length) {
  console.log("Warnings:");
  for (const warning of result.qa.warnings) console.log(`- ${warning}`);
}
