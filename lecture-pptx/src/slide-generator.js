/** @typedef {import('./types.js').SectionOutline} SectionOutline */
/** @typedef {import('./types.js').SlideSpec} SlideSpec */

function ensureBulletCount(bullets, min = 4, max = 6) {
  const clean = bullets.map((b) => b.trim()).filter(Boolean);
  if (clean.length >= min) return clean.slice(0, max);

  const filler = [
    "Clinical relevance for medical students",
    "Decision points for diagnosis and treatment",
    "Common pitfalls and interpretation caveats",
    "How this informs bedside reasoning",
  ];

  return [...clean, ...filler].slice(0, min);
}

function buildSpeakerNotes({ title, bullets, sourceRange, audience }) {
  const body = `In this slide, we focus on ${title}. For ${audience}, pay attention to how each point connects mechanism to clinical decisions. ${bullets
    .map((b, i) => `Point ${i + 1}: ${b}.`)
    .join(" ")} As you review, prioritize definitions, sequence of events, and what evidence changes practice. Tie these facts to exam-style reasoning: identify the trigger, mechanism, expected findings, and the next action. Keep this mental model for ward discussions and objective structured assessments.`;

  const words = body.split(/\s+/).length;
  let adjusted = body;
  if (words < 80) {
    adjusted += " Rehearse the narrative once out loud to ensure each bullet can be explained from first principles.";
  }
  if (adjusted.split(/\s+/).length > 140) {
    adjusted = adjusted.split(/\s+/).slice(0, 136).join(" ") + " ...";
  }

  return `${adjusted}\n\nSources: p.${sourceRange.startPage}–p.${sourceRange.endPage}`;
}

/**
 * @param {SectionOutline[]} sections
 * @param {{targetAudience:string,slideCountTarget?:number,slidesPer10Pages?:number,verbosity?:'concise'|'standard'|'detailed',includeFigures?:boolean,totalPages?:number}} controls
 * @returns {SlideSpec[]}
 */
export function buildSlideSpecs(sections, controls) {
  const audience = controls.targetAudience || "learners";
  const includeFigures = controls.includeFigures ?? false;
  const specs = [];

  for (const section of sections) {
    for (const candidate of section.slideCandidates) {
      const bullets = ensureBulletCount(candidate.bullets);
      specs.push({
        title: candidate.title,
        bullets,
        speakerNotes: buildSpeakerNotes({
          title: candidate.title,
          bullets,
          sourceRange: candidate.sourceRange,
          audience,
        }),
        sourceRange: candidate.sourceRange,
        figure: includeFigures
          ? { placeholder: "[Figure Placeholder]", caption: candidate.figureCaption || "Figure" }
          : null,
      });
    }

    specs.push({
      title: `${section.title} — Key Terms`,
      bullets: ensureBulletCount(section.keyTerms.map((t) => `${t}: concise definition from source context`)),
      speakerNotes: buildSpeakerNotes({
        title: `${section.title} key terms`,
        bullets: section.keyTerms,
        sourceRange: section.slideCandidates[0]?.sourceRange || { startPage: 1, endPage: 1 },
        audience,
      }),
      sourceRange: section.slideCandidates[0]?.sourceRange || { startPage: 1, endPage: 1 },
      figure: null,
    });
  }

  const allBullets = specs.flatMap((s) => s.bullets).slice(0, 6);
  const finalRange = specs[specs.length - 1]?.sourceRange || { startPage: 1, endPage: 1 };
  specs.push({
    title: "Takeaways + Exam Questions",
    bullets: ensureBulletCount([
      ...allBullets.slice(0, 3).map((x) => `Takeaway: ${x}`),
      "Exam Q1: Explain mechanism and first-line management.",
      "Exam Q2: Interpret evidence and apply to a patient scenario.",
      "Exam Q3: Compare two differential diagnoses using key findings.",
    ]),
    speakerNotes: buildSpeakerNotes({
      title: "course wrap-up and exam questions",
      bullets: allBullets,
      sourceRange: finalRange,
      audience,
    }),
    sourceRange: finalRange,
    figure: null,
  });

  const inferredTarget = controls.slideCountTarget
    ?? (controls.slidesPer10Pages && controls.totalPages
      ? Math.max(6, Math.round((controls.totalPages / 10) * controls.slidesPer10Pages))
      : specs.length);

  if (specs.length > inferredTarget) {
    return specs.slice(0, inferredTarget - 1).concat(specs[specs.length - 1]);
  }
  return specs;
}
