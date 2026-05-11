// Mock data for ABS Case Platform
const DISCIPLINES = [
  ["Accounting", 12], ["Business & Government Relations", 7], ["Business Ethics", 9],
  ["Economics", 14], ["Entrepreneurship", 22], ["Finance", 28], ["General Management", 31],
  ["HR Management", 11], ["Information Technology", 16], ["International Business", 19],
  ["Marketing", 24], ["Negotiation", 6], ["Operations Management", 13],
  ["Organizational Behavior", 10], ["Sales", 8], ["Service Management", 7],
  ["Social Enterprise", 15], ["Strategy", 34]
];

const INDUSTRIES = [
  ["Agriculture & Food", 18], ["Energy & Transition", 21], ["Financial Services", 26],
  ["Goods & Consumer Services", 17], ["Healthcare", 12], ["Industrial", 14],
  ["IT & Telecom", 19], ["Mining & Natural Resources", 11], ["Public Administration & Nonprofits", 9]
];

const LANGS = [["English", 124], ["French", 89]];

// Program levels — replaces Difficulty. Admin-configurable via Editor Dashboard.
const PROGRAM_LEVELS = [
  ["Bachelor", 18],
  ["Pre-experience Masters", 42],
  ["Post-experience Masters", 54],
  ["Advanced Executive Education", 43]
];

// Admin-configurable programs list — manage via Editor Dashboard → Registry tab
const PROGRAMS = [
  "MBA",
  "EMBA",
  "MSc Finance",
  "MSc Sustainability",
  "Executive Certificate · Pan-African Leadership",
  "Doctoral Program"
];

// African country filter sidebar counts
const AFRICAN_COUNTRY_COUNTS = [
  ["Morocco", 42], ["Algeria", 8], ["Tunisia", 11], ["Egypt", 16], ["South Africa", 19],
  ["Nigeria", 24], ["Kenya", 18], ["Ghana", 14], ["Ethiopia", 9], ["Senegal", 12],
  ["Côte d'Ivoire", 10], ["Rwanda", 8], ["Tanzania", 7], ["Uganda", 6],
  ["Cameroon", 5], ["Angola", 4], ["Mozambique", 3], ["Zimbabwe", 4], ["Zambia", 3],
  ["Mali", 5], ["Burkina Faso", 4], ["Mauritius", 7], ["Botswana", 3],
  ["Namibia", 4], ["Other", 11]
];

const AFRICAN_COUNTRIES = AFRICAN_COUNTRY_COUNTS.map(([c]) => c);

const CASE_TYPES_LIST = [
  "Field Case",
  "Library Case",
  "Fictitious Case",
  "Compact · 1–5p",
  "Compact · 6–10p",
  "Compact · 10+p",
  "Video Case"
];

const KEYWORD_SUGGESTIONS = [
  "vertical integration", "capital allocation", "Africa", "pan-Africa", "strategy",
  "family business", "succession", "governance", "banking", "financial inclusion",
  "fintech", "solar energy", "asset financing", "off-grid", "credit risk",
  "cement", "pricing", "AfCFTA", "retail", "hypermarket", "digital disruption",
  "telecom", "market entry", "regulation", "pharmaceuticals", "biosimilars",
  "supply chain", "make-or-buy", "e-commerce", "tech startup", "profitability",
  "phosphate", "agribusiness", "last mile", "competitive strategy", "consumer behavior",
  "investor relations", "conglomerate", "duopoly", "business model", "sustainability"
];

const CASES = [
  {
    id: "c-01",
    title: "OCP Group: Phosphate, Power and the Pan-African Pivot",
    company: "OCP Group",
    country: "Morocco",
    countries: ["Morocco"],
    discipline: "Strategy",
    industry: "Mining & Natural Resources",
    type: "Field Case",
    abstract: "Faced with volatile fertilizer markets and growing pressure to anchor value creation on African soil, OCP's leadership weighs a generational bet: vertical integration into downstream agri-services across twelve African countries while defending its global phosphate franchise.",
    authors: ["Dr. Salma Bennani"],
    institution: "Africa Business School, UM6P",
    year: 2025,
    programLevel: "Post-experience Masters",
    language: "English",
    readingMin: 38,
    keywords: ["phosphate", "vertical integration", "Africa", "capital allocation", "agribusiness"],
    flags: { bestseller: true, isNew: true, hasTN: true, hasVideo: true },
    usage: { times: 47, programs: 12 },
  },
  {
    id: "c-02",
    title: "Attijariwafa Bank: Banking the Unbanked from Casablanca to Kigali",
    company: "Attijariwafa Bank",
    country: "Morocco / 14 markets",
    countries: ["Morocco", "Senegal", "Côte d'Ivoire", "Rwanda", "Other"],
    discipline: "Finance",
    industry: "Financial Services",
    type: "Field Case",
    abstract: "A regional banking champion confronts a fork in the road: scale a low-margin retail network across francophone Africa, or pivot toward a digital-first wholesale model. The CFO must defend a five-year capital plan to a skeptical board.",
    authors: ["Prof. Youssef El Amrani"],
    institution: "Africa Business School, UM6P",
    year: 2024,
    programLevel: "Post-experience Masters",
    language: "English",
    readingMin: 32,
    keywords: ["banking", "financial inclusion", "pan-Africa", "capital planning", "fintech"],
    flags: { bestseller: true, isNew: false, hasTN: true, hasVideo: false },
    usage: { times: 63, programs: 18 },
  },
  {
    id: "c-03",
    title: "M-KOPA: Pay-as-you-Go Solar at the Edge of the Grid",
    company: "M-KOPA",
    country: "Kenya",
    countries: ["Kenya", "Tanzania", "Uganda", "Nigeria"],
    discipline: "Entrepreneurship",
    industry: "Energy & Transition",
    type: "Field Case",
    abstract: "From a 2011 pilot in rural Kenya to four million households a decade later, M-KOPA's asset-financing model rewrote the rules of off-grid energy. The case examines the unit economics, credit risk innovations, and the next frontier: smartphones.",
    authors: ["Dr. Aïsha Diop"],
    institution: "Africa Business School, UM6P",
    year: 2025,
    programLevel: "Pre-experience Masters",
    language: "English",
    readingMin: 26,
    keywords: ["solar energy", "asset financing", "off-grid", "credit risk", "last mile"],
    flags: { bestseller: false, isNew: true, hasTN: true, hasVideo: true },
    usage: { times: 89, programs: 22 },
  },
  {
    id: "c-04",
    title: "Dangote Cement: Pricing Power in a Continental Duopoly",
    company: "Dangote Industries",
    country: "Nigeria",
    countries: ["Nigeria", "Ghana"],
    discipline: "Strategy",
    industry: "Industrial",
    type: "Field Case",
    abstract: "Aliko Dangote's cement empire commands forty percent of Sub-Saharan capacity. As the AfCFTA opens cross-border flows and Chinese entrants eye West Africa, the executive committee debates whether to compete on price, quality, or carbon.",
    authors: ["Prof. Karim Tazi"],
    institution: "Africa Business School, UM6P",
    year: 2024,
    programLevel: "Post-experience Masters",
    language: "English",
    readingMin: 41,
    keywords: ["cement", "pricing", "duopoly", "AfCFTA", "competitive strategy"],
    flags: { bestseller: true, isNew: false, hasTN: true, hasVideo: false },
    usage: { times: 71, programs: 16 },
  },
  {
    id: "c-05",
    title: "Marjane: Reinventing Modern Trade in a Souk Economy",
    company: "Marjane Holding",
    country: "Morocco",
    countries: ["Morocco"],
    discipline: "Marketing",
    industry: "Goods & Consumer Services",
    type: "Field Case",
    abstract: "Two decades after Morocco's first hypermarket opened on the outskirts of Rabat, Marjane faces a quiet crisis: digital-native rivals, shifting demographics, and the persistent gravitational pull of the traditional souk.",
    authors: ["Dr. Nadia Berrada"],
    institution: "Africa Business School, UM6P",
    year: 2025,
    programLevel: "Pre-experience Masters",
    language: "French",
    readingMin: 22,
    keywords: ["retail", "hypermarket", "Morocco", "digital disruption", "consumer behavior"],
    flags: { bestseller: false, isNew: true, hasTN: true, hasVideo: false },
    usage: { times: 28, programs: 9 },
  },
  {
    id: "c-06",
    title: "Safaricom Ethiopia: A License, a Country, a Bet",
    company: "Safaricom Group",
    country: "Ethiopia",
    countries: ["Ethiopia", "Kenya"],
    discipline: "International Business",
    industry: "IT & Telecom",
    type: "Field Case",
    abstract: "When Ethiopia opened its telecoms sector in 2021, Safaricom paid US$850 million for the right to compete with a state monopoly serving 120 million people. Three years in, the CEO must defend the burn rate to investors.",
    authors: ["Prof. Mehdi Ouali"],
    institution: "Africa Business School, UM6P",
    year: 2024,
    programLevel: "Advanced Executive Education",
    language: "English",
    readingMin: 36,
    keywords: ["telecom", "market entry", "regulation", "investor relations", "Ethiopia"],
    flags: { bestseller: false, isNew: false, hasTN: true, hasVideo: true },
    usage: { times: 34, programs: 11 },
  },
  {
    id: "c-07",
    title: "Sothema: Compounding Sovereignty in African Pharmaceuticals",
    company: "Sothema Laboratories",
    country: "Morocco",
    countries: ["Morocco", "Senegal"],
    discipline: "Operations Management",
    industry: "Healthcare",
    type: "Field Case",
    abstract: "After COVID-19 exposed the continent's pharmaceutical fragility, Sothema launched a continental supply strategy. The case follows the COO through a make-or-buy decision on biosimilar capacity in Casablanca and Dakar.",
    authors: ["Dr. Hicham Filali"],
    institution: "Africa Business School, UM6P",
    year: 2025,
    programLevel: "Post-experience Masters",
    language: "English",
    readingMin: 29,
    keywords: ["pharmaceuticals", "biosimilars", "supply chain", "Africa", "make-or-buy"],
    flags: { bestseller: false, isNew: true, hasTN: true, hasVideo: false },
    usage: { times: 19, programs: 7 },
  },
  {
    id: "c-08",
    title: "Jumia: The Long Walk to Profitability",
    company: "Jumia Technologies",
    country: "Pan-African (14 markets)",
    countries: ["Nigeria", "Kenya", "Egypt", "Morocco", "Ghana", "Other"],
    discipline: "Entrepreneurship",
    industry: "IT & Telecom",
    type: "Library Case",
    abstract: "Africa's first NYSE-listed tech company has burned through nine figures in pursuit of a continental e-commerce thesis. As the new CEO trims geographies and headcount, students debate whether the model was wrong or simply early.",
    authors: ["Prof. Leila Benkirane"],
    institution: "Africa Business School, UM6P",
    year: 2024,
    programLevel: "Pre-experience Masters",
    language: "English",
    readingMin: 24,
    keywords: ["e-commerce", "tech startup", "Africa", "profitability", "business model"],
    flags: { bestseller: true, isNew: false, hasTN: true, hasVideo: true },
    usage: { times: 102, programs: 27 },
  },
  {
    id: "c-09",
    title: "Akwa Group: Family, Foundation, and the Family Office",
    company: "Akwa Group",
    country: "Morocco",
    countries: ["Morocco"],
    discipline: "General Management",
    industry: "Energy & Transition",
    type: "Field Case",
    abstract: "A second-generation succession at one of Morocco's largest privately held conglomerates raises a familiar question with continental implications: how do African family firms institutionalize without losing their soul?",
    authors: ["Dr. Amina Sefrioui", "Prof. Karim Tazi"],
    institution: "Africa Business School, UM6P",
    year: 2025,
    programLevel: "Advanced Executive Education",
    language: "French",
    readingMin: 33,
    keywords: ["family business", "succession", "governance", "Morocco", "conglomerate"],
    flags: { bestseller: false, isNew: true, hasTN: true, hasVideo: false },
    usage: { times: 22, programs: 8 },
  },
];

const READER_SECTIONS = [
  { id: "s1", label: "Opening Vignette", title: "A Phosphate Decision in Khouribga", status: "done" },
  { id: "s2", label: "Section I", title: "The OCP Story: From Mine to Multinational", status: "done" },
  { id: "s3", label: "Section II", title: "The Pan-African Thesis", status: "current" },
  { id: "s4", label: "Section III", title: "Capital, Carbon, and the Cost Curve", status: "locked" },
  { id: "s5", label: "Section IV", title: "Three Scenarios for the Board", status: "locked" },
  { id: "s6", label: "Closing Note", title: "Strategy as Continental Imagination", status: "locked" },
];

const READER_BODY = {
  eyebrow: "STRATEGY · MINING & NATURAL RESOURCES",
  title: "OCP Group: Phosphate, Power and the Pan-African Pivot",
  byline: "Dr. Salma Bennani · 2025 · Africa Business School, UM6P",
  current: {
    label: "Section II",
    heading: "The Pan-African Thesis",
    paragraphs: [
      "By the time the executive committee gathered in Jorf Lasfar in early 2024, the question on the table had a particular weight to it. OCP had spent two decades transforming itself from a Moroccan state mining company into a vertically integrated global fertilizer player. The next decade, the chairman insisted, would be defined not by tonnes mined or shipped, but by hectares served on African soil.",
      "The strategic logic was straightforward enough to fit on a single slide. Africa accounts for sixty percent of the world's uncultivated arable land, yet consumes only three percent of global fertilizer. The yield gap, as agronomists in the room described it, was not a market — it was a moral and commercial imperative wrapped together. If OCP could close half that gap by 2035, the continent would feed itself, and OCP would have built the largest agronomic services business in the Global South.",
      "But the operational logic was less tidy. Reaching the smallholder farmer in Tete or Kaduna required a distribution backbone that did not yet exist, financial products that did not yet exist, and trust that took years rather than quarters to compound. The downstream commitment would consume capital that the parent company's global trading arm could otherwise deploy in higher-margin markets.",
      "Three constituencies inside the room held different views. The Industrial Director argued that capacity expansion in Morocco — already the world's largest — should remain the priority; African distribution would follow demand naturally. The Chief Strategy Officer countered that waiting for demand was the very definition of a commodity trap. The CFO, characteristically, asked a more uncomfortable question: at what level of return on invested capital does a sovereign mission stop looking like a strategy and start looking like a subsidy?",
    ],
  },
};

const TEACHING_NOTE = {
  title: "OCP Group — Teaching Note",
  sections: [
    {
      heading: "Learning Objectives",
      kind: "list",
      items: [
        "Evaluate vertical integration decisions in commodity industries with sovereign-strategic dimensions.",
        "Apply real options thinking to multi-decade infrastructure investments under demand uncertainty.",
        "Diagnose the tension between shareholder logic and developmental mandates in African champions.",
        "Build a defensible continental distribution strategy across markets with very different infrastructure maturity.",
      ],
    },
    {
      heading: "Discussion Questions",
      kind: "list",
      items: [
        "What is the right unit of analysis for OCP's African pivot — country, basin, crop, or smallholder?",
        "If you were the CFO, what hurdle rate would you defend in front of the board, and why?",
        "How should OCP think about the trade-off between speed of build-out and depth of agronomic service?",
        "Where does the strategic logic break down if AfCFTA implementation stalls beyond 2030?",
      ],
    },
    {
      heading: "Suggested Teaching Plan (90 minutes)",
      kind: "plan",
      items: [
        { t: "00:00 — 00:10", b: "Cold call. Ask three students for the single sentence that best captures OCP's strategic problem. Write the three on the board." },
        { t: "00:10 — 00:35", b: "Map the Pan-African opportunity. Use the case exhibits to size the addressable market by basin. Push on assumptions." },
        { t: "00:35 — 01:00", b: "Capital allocation tournament. Three small groups defend the Industrial Director, CSO, and CFO positions respectively." },
        { t: "01:00 — 01:20", b: "Synthesize. Lead a discussion on what the right governance structure would look like for the African build-out." },
        { t: "01:20 — 01:30", b: "Epilogue and takeaways. Reveal what OCP actually announced in Q3 2024 and probe disconnects with student conclusions." },
      ],
    },
    {
      heading: "Epilogue",
      kind: "paragraph",
      body: "In September 2024, OCP committed US$13 billion over ten years to a downstream Pan-African build-out anchored by twelve regional fertilizer hubs. The commitment was paired, notably, with a separately governed agronomic services subsidiary — a structural answer to the CFO's question that the case deliberately leaves open.",
    },
  ],
};

const PENDING_REQUESTS = [
  { id: "r1", caseTitle: "OCP Group: Phosphate, Power and the Pan-African Pivot", prof: "Prof. Mounia Cherkaoui", email: "m.cherkaoui@um6p.ma", module: "Strategy in Emerging Markets", program: "EMBA", students: 42, date: "May 4, 2026" },
  { id: "r2", caseTitle: "M-KOPA: Pay-as-you-Go Solar at the Edge of the Grid", prof: "Prof. Daniel Otieno", email: "d.otieno@um6p.ma", module: "Inclusive Innovation", program: "MSc Sustainability", students: 28, date: "May 3, 2026" },
  { id: "r3", caseTitle: "Attijariwafa Bank: Banking the Unbanked", prof: "Prof. Réda Lahlou", email: "r.lahlou@um6p.ma", module: "Financial Institutions in Africa", program: "MBA", students: 56, date: "May 2, 2026" },
  { id: "r4", caseTitle: "Marjane: Reinventing Modern Trade", prof: "Prof. Houda Idrissi", email: "h.idrissi@um6p.ma", module: "Retail Strategy", program: "Executive Certificate", students: 19, date: "Apr 30, 2026" },
  { id: "r5", caseTitle: "Safaricom Ethiopia: A License, a Country, a Bet", prof: "Prof. Wanjiru Kamau", email: "w.kamau@um6p.ma", module: "Cross-Border Strategy", program: "EMBA", students: 38, date: "Apr 29, 2026" },
];

const PUBLISHED = [
  { id: "p1", title: "OCP Group: Phosphate, Power and the Pan-African Pivot", author: "Dr. Salma Bennani", status: "Published", year: 2025, uses: 47 },
  { id: "p2", title: "Attijariwafa Bank: Banking the Unbanked", author: "Prof. Y. El Amrani", status: "Published", year: 2024, uses: 63 },
  { id: "p3", title: "Royal Air Maroc: Restructuring at 30,000 Feet", author: "Prof. K. Tazi", status: "Under Review", year: 2026, uses: 0 },
  { id: "p4", title: "Sothema: Compounding Sovereignty in African Pharma", author: "Dr. H. Filali", status: "Published", year: 2025, uses: 19 },
  { id: "p5", title: "Cosumar: Sweetening the Sub-Saharan Sugar Trade", author: "Dr. N. Berrada", status: "Draft", year: 2026, uses: 0 },
  { id: "p6", title: "Akwa Group: Family, Foundation, and the Family Office", author: "Dr. A. Sefrioui", status: "Published", year: 2025, uses: 22 },
];

const ACTIVITY = [
  { who: "Editorial Board", what: "approved", obj: "Sothema · MBA cohort access", when: "12 min ago" },
  { who: "Dr. Salma Bennani", what: "submitted revision", obj: "OCP Group v2.1", when: "1 hr ago" },
  { who: "You", what: "rejected", obj: "Duplicate request from Prof. Lahlou", when: "3 hr ago" },
  { who: "System", what: "published", obj: "M-KOPA teaching note", when: "Yesterday" },
  { who: "Prof. Mounia Cherkaoui", what: "requested", obj: "OCP Group · EMBA spring", when: "Yesterday" },
  { who: "Editorial Board", what: "flagged", obj: "Cosumar draft for ethics review", when: "2 days ago" },
];

window.ABS_DATA = {
  DISCIPLINES, INDUSTRIES, LANGS,
  PROGRAM_LEVELS, AFRICAN_COUNTRY_COUNTS, AFRICAN_COUNTRIES, CASE_TYPES_LIST, PROGRAMS,
  KEYWORD_SUGGESTIONS,
  CASES, READER_SECTIONS, READER_BODY, TEACHING_NOTE,
  PENDING_REQUESTS, PUBLISHED, ACTIVITY
};
