/**
 * @param {{sections:Array<{title:string,keyTerms:string[],slideCandidates:any[]}>, slides:Array<{title:string,bullets:string[]}> , controls:{slideCountTarget?:number,slidesPer10Pages?:number,totalPages?:number}}} input
 */
export function runQaChecks(input) {
  const warnings = [];
  const sectionTitles = input.sections.map((s) => s.title);
  const slideTitles = input.slides.map((s) => s.title);

  const missingSections = sectionTitles.filter((title) => !slideTitles.some((st) => st.includes(title)));
  if (missingSections.length) {
    warnings.push(`Coverage warning: missing section slides for ${missingSections.join(", ")}`);
  }

  const target = input.controls.slideCountTarget
    ?? (input.controls.slidesPer10Pages && input.controls.totalPages
      ? Math.max(6, Math.round((input.controls.totalPages / 10) * input.controls.slidesPer10Pages))
      : null);

  if (target !== null && input.slides.length > target + 1) {
    warnings.push(`Slide count warning: generated ${input.slides.length}, target is ${target}.`);
  }

  const seen = new Set();
  let duplicateCount = 0;
  for (const slide of input.slides) {
    for (const bullet of slide.bullets) {
      const key = bullet.toLowerCase();
      if (seen.has(key)) duplicateCount += 1;
      seen.add(key);
    }
  }
  if (duplicateCount > 6) {
    warnings.push(`Duplication warning: ${duplicateCount} repeated bullet ideas detected.`);
  }

  const hasDefinition = input.slides.some((s) => s.bullets.some((b) => /\bdefined|refers to|is\b/i.test(b)));
  if (!hasDefinition) {
    warnings.push("Content warning: missing definition-oriented bullets.");
  }

  const hasEvidence = input.slides.some((s) => s.bullets.some((b) => /\bstudy|trial|result|evidence|%\b/i.test(b)));
  if (!hasEvidence) {
    warnings.push("Content warning: missing evidence/results bullets.");
  }

  return {
    passed: warnings.length === 0,
    warnings,
  };
}
