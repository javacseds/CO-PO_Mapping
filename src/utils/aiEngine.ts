import type { CourseOutcome, Outcome } from './templates';

export type MappingValue = 1 | 2 | 3 | '';

export interface MappingResult {
  matrix: Record<string, Record<string, MappingValue>>;
  justifications: Record<string, Record<string, string>>;
}

// Bloom's Taxonomy classification helper
interface VerbInfo {
  level: number; // 1 to 6
  levelName: string;
  category: string;
}

const BLOOM_VERBS: Record<string, VerbInfo> = {
  // L1: Remember
  define: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  list: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  state: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  recall: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  identify: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  name: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  label: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  locate: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  match: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  outline: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  reproduce: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  retrieve: { level: 1, levelName: "L1: Remember", category: "Knowledge Recall" },
  
  // L2: Understand
  describe: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  explain: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  discuss: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  classify: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  summarize: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  interpret: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  contrast: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  predict: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  translate: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  paraphrase: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  differentiate: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  distinguish: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  illustrate: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  compare: { level: 2, levelName: "L2: Understand", category: "Comprehension" },
  indicate: { level: 2, levelName: "L2: Understand", category: "Comprehension" },

  // L3: Apply
  apply: { level: 3, levelName: "L3: Apply", category: "Application" },
  solve: { level: 3, levelName: "L3: Apply", category: "Application" },
  calculate: { level: 3, levelName: "L3: Apply", category: "Application" },
  compute: { level: 3, levelName: "L3: Apply", category: "Application" },
  implement: { level: 3, levelName: "L3: Apply", category: "Application" },
  execute: { level: 3, levelName: "L3: Apply", category: "Application" },
  demonstrate: { level: 3, levelName: "L3: Apply", category: "Application" },
  show: { level: 3, levelName: "L3: Apply", category: "Application" },
  use: { level: 3, levelName: "L3: Apply", category: "Application" },
  operate: { level: 3, levelName: "L3: Apply", category: "Application" },
  construct: { level: 3, levelName: "L3: Apply", category: "Application" },
  sketch: { level: 3, levelName: "L3: Apply", category: "Application" },
  manipulate: { level: 3, levelName: "L3: Apply", category: "Application" },
  model: { level: 3, levelName: "L3: Apply", category: "Application" },
  schedule: { level: 3, levelName: "L3: Apply", category: "Application" },

  // L4: Analyze
  analyze: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  examine: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  experiment: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  test: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  simplify: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  diagram: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  deconstruct: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  inspect: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  criticize: { level: 4, levelName: "L4: Analyze", category: "Analysis" },
  debate: { level: 4, levelName: "L4: Analyze", category: "Analysis" },

  // L5: Evaluate
  evaluate: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  assess: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  judge: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  critique: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  recommend: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  rate: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  justify: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  defend: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  verify: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },
  measure: { level: 5, levelName: "L5: Evaluate", category: "Evaluation" },

  // L6: Create
  design: { level: 6, levelName: "L6: Create", category: "Creation" },
  create: { level: 6, levelName: "L6: Create", category: "Creation" },
  develop: { level: 6, levelName: "L6: Create", category: "Creation" },
  formulate: { level: 6, levelName: "L6: Create", category: "Creation" },
  compose: { level: 6, levelName: "L6: Create", category: "Creation" },
  program: { level: 6, levelName: "L6: Create", category: "Creation" },
  build: { level: 6, levelName: "L6: Create", category: "Creation" },
  compile: { level: 6, levelName: "L6: Create", category: "Creation" },
  invent: { level: 6, levelName: "L6: Create", category: "Creation" },
  devise: { level: 6, levelName: "L6: Create", category: "Creation" },
  synthesize: { level: 6, levelName: "L6: Create", category: "Creation" },
  plan: { level: 6, levelName: "L6: Create", category: "Creation" },
  setup: { level: 6, levelName: "L6: Create", category: "Creation" },
  write: { level: 3, levelName: "L3: Apply", category: "Application" } // Default write is application, context dependent
};

// Standard PO keyword clusters
const PO_KEYWORDS: Record<string, string[]> = {
  PO1: ["mathematics", "math", "science", "physics", "chemistry", "fundamentals", "engineering fundamentals", "theory", "concept", "principle", "equations", "formula", "derivation", "calculation", "compute", "electrical", "mechanical", "circuits", "materials", "forces", "laws", "foundations"],
  PO2: ["problem", "analyze", "analysis", "identify", "formulate", "substantiate", "literature", "review", "requirements", "diagnose", "troubleshoot", "debugging", "complexity", "assess", "investigate", "evaluate", "limitations", "constraints"],
  PO3: ["design", "develop", "development", "solution", "system", "component", "process", "specification", "architecture", "prototype", "algorithm", "layout", "drawings", "interface", "coding", "manufacturing", "construction", "safety", "societal", "environmental"],
  PO4: ["investigate", "investigation", "experiment", "data", "interpretation", "synthesis", "research", "methods", "test", "measure", "validate", "testing", "metrics", "laboratory", "simulation data", "conclusions"],
  PO5: ["tool", "modern tool", "software", "simulator", "simulation", "ide", "compiler", "cad", "matlab", "python", "java", "c++", "c#", "hardware", "oscilloscope", "profiler", "multisim", "solidworks", "ansys", "git", "github", "library", "framework", "modeling"],
  PO6: ["society", "societal", "safety", "health", "legal", "cultural", "public", "responsibility", "regulations", "standards", "civic", "professional practice", "public health", "compliance"],
  PO7: ["environment", "environmental", "sustainability", "sustainable", "green", "carbon", "ecological", "impact", "waste", "recycle", "lifecycle", "renewable", "energy efficiency", "pollution"],
  PO8: ["ethics", "ethical", "professional ethics", "plagiarism", "academic integrity", "norms", "responsibility", "copyright", "intellectual property", "license", "patents", "confidentiality", "bias", "safety norms"],
  PO9: ["team", "group", "member", "leader", "leadership", "collaborate", "collaboration", "cooperation", "multidisciplinary", "peer review", "role", "coordination", "joint project"],
  PO10: ["communicate", "communication", "write", "report", "presentation", "slides", "documentation", "manual", "explain", "comprehend", "instructions", "oral", "technical writing", "deliverable"],
  PO11: ["project", "management", "finance", "budget", "cost", "economic", "planning", "schedule", "milestone", "resources", "allocation", "timeline", "feasibility", "roi", "lifecycle cost"],
  PO12: ["learning", "life-long", "lifelong", "independent", "self-learning", "trends", "future", "state-of-the-art", "latest technology", "technological change", "career development", "adaptability", "journal", "research papers"]
};

// Standard PO detailed aspects for explanations
const PO_ASPECTS: Record<string, string> = {
  PO1: "engineering mathematical and scientific principles",
  PO2: "detailed formulation and analytical complexity of engineering problems",
  PO3: "designing concrete blueprints, software components, or physical processes to meet user constraints",
  PO4: "design of experiments, analytical measurements, or interpretation of empirical data",
  PO5: "industry-standard software IDEs, CAD tools, physical test hardware, or numeric simulator suites",
  PO6: "societal protection, public safety codes, health regulations, or municipal standards",
  PO7: "ecological sustainability, green design methods, or reducing environmental footprints",
  PO8: "preventing plagiarism, respecting licenses, protecting data privacy, or applying safety codes",
  PO9: "teamwork, peer feedback, role coordination, or joint group deliverables",
  PO10: "technical writing, oral presentations, preparing documentation manuals, or explaining system behaviors",
  PO11: "cost estimations, resource scheduling, project templates, or product lifecycle timelines",
  PO12: "independent self-study, tracking future tech trends, or searching state-of-the-art literature"
};

// Stop words for clean semantic token comparison
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "if", "in", "into", "is", "it", 
  "no", "not", "of", "on", "or", "such", "that", "the", "their", "then", "there", "these", 
  "they", "this", "to", "was", "will", "with", "various", "using", "each", "every", "write", "read"
]);

// Clean text to search keywords
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

// Find primary Bloom verb in Course Outcome
function extractBloomVerb(coDescription: string): { verb: string; info: VerbInfo } {
  const words = coDescription.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ").split(/\s+/);
  
  // Find first word or second word that maps to a Bloom's verb
  for (let i = 0; i < Math.min(words.length, 3); i++) {
    const word = words[i];
    if (BLOOM_VERBS[word]) {
      return { verb: word, info: BLOOM_VERBS[word] };
    }
  }

  // Fallback scan of the entire text
  for (const word of words) {
    if (BLOOM_VERBS[word]) {
      return { verb: word, info: BLOOM_VERBS[word] };
    }
  }

  // Absolute fallback: default to Understand (L2)
  return { 
    verb: words[0] || "understand", 
    info: { level: 2, levelName: "L2: Understand", category: "Comprehension" } 
  };
}

export function generateAIMapping(
  subjectName: string,
  _subjectCode: string,
  courseOutcomes: CourseOutcome[],
  programOutcomes: Outcome[],
  psos: Outcome[],
  psoEnabled: boolean,
  syllabus: string
): MappingResult {
  const matrix: Record<string, Record<string, MappingValue>> = {};
  const justifications: Record<string, Record<string, string>> = {};

  const syllabusTokens = syllabus ? tokenize(syllabus) : [];
  const subjectTokens = tokenize(subjectName);

  courseOutcomes.forEach((co) => {
    matrix[co.id] = {};
    justifications[co.id] = {};

    const coTokens = tokenize(co.description);
    const { verb, info: bloomInfo } = extractBloomVerb(co.description);

    // Context summary helper for justification sentences
    // Extracts up to 4 key nouns from CO for context
    const coContextWords = coTokens
      .filter(t => t !== verb && t.length > 3)
      .slice(0, 4)
      .join(" ");

    // Standard PO Mapping Logic
    programOutcomes.forEach((po) => {
      const poId = po.id;
      const poKeywords = PO_KEYWORDS[poId] || tokenize(po.description || "");
      
      // Calculate keyword match overlaps
      let keywordMatches = 0;
      const matchedWords: string[] = [];

      coTokens.forEach((tok) => {
        if (poKeywords.includes(tok)) {
          keywordMatches += 1.5; // High weight for CO match
          if (!matchedWords.includes(tok)) matchedWords.push(tok);
        }
      });

      // Match syllabus contents to verify modern tools or advanced contexts
      syllabusTokens.forEach((tok) => {
        if (poKeywords.includes(tok)) {
          keywordMatches += 0.2; // Low weight but builds reinforcement
        }
      });

      // Match subject title terms
      subjectTokens.forEach((tok) => {
        if (poKeywords.includes(tok)) {
          keywordMatches += 0.3;
        }
      });

      // Evaluate cognitive level weights based on standard NBA behaviors
      let cognitiveWeight = 0;

      if (poId === "PO1") {
        // Engineering knowledge applies to L1-L6
        cognitiveWeight = bloomInfo.level >= 3 ? 2.5 : 1.5;
      } else if (poId === "PO2") {
        // Problem analysis requires high cognitive levels
        if (bloomInfo.level >= 4) cognitiveWeight = 2.5;
        else if (bloomInfo.level === 3) cognitiveWeight = 1.5;
        else cognitiveWeight = 0.5; // L1/L2 barely map to problem analysis
      } else if (poId === "PO3") {
        // Design requires L3, L4, or L6
        if (bloomInfo.level === 6) cognitiveWeight = 3.0; // Design / Create
        else if (bloomInfo.level === 3 || bloomInfo.level === 4) cognitiveWeight = 1.5;
        else cognitiveWeight = 0.2;
      } else if (poId === "PO4") {
        // Investigations require L4, L5
        if (bloomInfo.level === 4 || bloomInfo.level === 5) cognitiveWeight = 2.0;
        else if (bloomInfo.level === 3) cognitiveWeight = 1.0;
        else cognitiveWeight = 0.1;
      } else if (poId === "PO5") {
        // Modern tool usage requires application/creation
        if (bloomInfo.level >= 3) cognitiveWeight = 1.5;
        else cognitiveWeight = 0.3;
      } else if (poId === "PO9" || poId === "PO10" || poId === "PO11") {
        // Management/Teamwork/Communication map if keywords exist
        cognitiveWeight = 0.5;
      } else {
        // PO6, PO7, PO8, PO12
        cognitiveWeight = bloomInfo.level >= 2 ? 1.0 : 0.5;
      }

      // Calculate aggregated score
      const finalScore = keywordMatches + cognitiveWeight;

      // Realistic Pruning for accreditation guidelines (avoiding overmapping)
      let finalValue: MappingValue = "";
      
      // PO6 (Society), PO7 (Environment), PO8 (Ethics), PO11 (Finance/PM) 
      // should ONLY map if explicit matches occur in CO text (preventing "fake" mappings)
      const specialPOs = ["PO6", "PO7", "PO8", "PO9", "PO10", "PO11"];
      const hasDirectKeywordMatch = matchedWords.length > 0;

      if (specialPOs.includes(poId) && !hasDirectKeywordMatch) {
        finalValue = "";
      } else {
        if (finalScore >= 4.0) {
          finalValue = 3; // Strong correlation
        } else if (finalScore >= 2.5) {
          finalValue = 2; // Moderate correlation
        } else if (finalScore >= 1.2) {
          finalValue = 1; // Low correlation
        } else {
          finalValue = ""; // No correlation
        }
      }

      // Safeguard: L1/L2 actions can never have a 3 mapping for PO2 or PO3 (NBA rules)
      if ((poId === "PO2" || poId === "PO3" || poId === "PO4") && bloomInfo.level <= 2 && finalValue === 3) {
        finalValue = 2;
      }

      // Output mapping value
      matrix[co.id][poId] = finalValue;

      // Justification Generator text block
      const verbGerund = verb.endsWith("e") ? verb.slice(0, -1) + "ing" : verb + "ing";
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const matchedWordsStr = matchedWords.length > 0 ? ` [related to: ${matchedWords.join(", ")}]` : "";

      if (finalValue === 3) {
        justifications[co.id][poId] = `${capitalize(verbGerund)} matches the highest cognitive level (${bloomInfo.levelName}) for "${coContextWords}". This maps strongly (3) to ${po.name} (${poId}) because the outcome directly requires critical formulation, engineering models, or comprehensive solutions ${poKeywords[0] ? `involving ${poKeywords.slice(0,2).join(" and ")}` : ""}.`;
      } else if (finalValue === 2) {
        justifications[co.id][poId] = `The outcome requires ${verbGerund} (${bloomInfo.levelName}) of concepts in "${coContextWords}". It holds a moderate (2) correlation with ${po.name} (${poId}), as the cognitive scope supports problem analysis or design implementations${matchedWordsStr}.`;
      } else if (finalValue === 1) {
        justifications[co.id][poId] = `The outcome presents basic introductory aspects of ${verbGerund} (${bloomInfo.levelName}) for "${coContextWords}". It shares a low (1) correlation with ${po.name} (${poId}), representing fundamental exposure rather than deep autonomous design or critical analysis.`;
      } else {
        justifications[co.id][poId] = `The Course Outcome focusing on ${verbGerund} is domain-specific to "${coContextWords}" and does not contain requirements matching ${PO_ASPECTS[poId] || po.name}. Hence, no correlation is mapped.`;
      }
    });

    // PSO Mapping Logic (If enabled)
    if (psoEnabled && psos) {
      psos.forEach((pso) => {
        const psoId = pso.id;
        const psoTokens = tokenize(pso.description || pso.name);

        let psoMatches = 0;
        const matchedPsoWords: string[] = [];

        coTokens.forEach((tok) => {
          if (psoTokens.includes(tok)) {
            psoMatches += 2.0;
            if (!matchedPsoWords.includes(tok)) matchedPsoWords.push(tok);
          }
        });

        // Add context matches from syllabus
        syllabusTokens.forEach((tok) => {
          if (psoTokens.includes(tok)) {
            psoMatches += 0.3;
          }
        });

        const finalPsoScore = psoMatches + (bloomInfo.level >= 3 ? 1.0 : 0.5);
        let psoValue: MappingValue = "";

        if (finalPsoScore >= 4.0) psoValue = 3;
        else if (finalPsoScore >= 2.2) psoValue = 2;
        else if (finalPsoScore >= 1.0) psoValue = 1;
        else psoValue = "";

        matrix[co.id][psoId] = psoValue;

        const psoName = pso.name || pso.id;
        const verbGerund = verb.endsWith("e") ? verb.slice(0, -1) + "ing" : verb + "ing";
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

        if (psoValue === 3) {
          justifications[co.id][psoId] = `${capitalize(verbGerund)} demands high competency in ${psoName} (${psoId}) through the implementation of "${coContextWords}". The cognitive weight (${bloomInfo.levelName}) aligns perfectly with this specialization.`;
        } else if (psoValue === 2) {
          justifications[co.id][psoId] = `The outcome requires ${verbGerund} (${bloomInfo.levelName}) of principles directly supporting the program criteria of ${psoName} (${psoId}) with moderate correlation.`;
        } else if (psoValue === 1) {
          justifications[co.id][psoId] = `The outcome provides basic introductory experience relating to ${psoName} (${psoId}), offering low correlation mapping (1).`;
        } else {
          justifications[co.id][psoId] = `The Course Outcome does not explicitly focus on the specialization requirements defined in ${psoName} (${psoId}) [${pso.description.slice(0,40)}...], leaving the cell unmapped.`;
        }
      });
    }
  });

  return { matrix, justifications };
}
