export type Entry = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  body?: string;
  scope?: string[];
  location?: string;
  status?: string;
  date?: string;
  verified?: boolean;
  quote?: string;
  author?: string;
  email?: string;
  phone?: string;
  address?: string;
  whatsapp?: string;
  stats?: { value: string; label: string }[];
  seoTitle?: string;
  seoDescription?: string;
};
export const services: Entry[] = [
  [
    "building-construction",
    "Building Construction",
    "Thoughtfully planned spaces. Built to last.",
    "hero",
  ],
  [
    "civil-engineering",
    "Civil Engineering",
    "Strong foundations for better infrastructure.",
    "construction",
  ],
  [
    "general-contracting",
    "General Contracting",
    "A coordinated approach from start to finish.",
    "engineers",
  ],
  [
    "project-management",
    "Project Management",
    "Clarity, coordination and control at every stage.",
    "architecture",
  ],
  [
    "residential-construction",
    "Residential Construction",
    "Considered spaces for everyday living.",
    "residential",
  ],
  [
    "commercial-construction",
    "Commercial Construction",
    "Places that help businesses move forward.",
    "hero",
  ],
  [
    "industrial-construction",
    "Industrial Construction",
    "Purpose-built environments for industry.",
    "industrial",
  ],
  [
    "renovation-and-remodeling",
    "Renovation & Remodeling",
    "New possibilities for existing spaces.",
    "interior",
  ],
  [
    "infrastructure-development",
    "Infrastructure Development",
    "Connecting communities through essential works.",
    "construction",
  ],
  [
    "structural-works",
    "Structural Works",
    "Precision in concrete, steel and structural systems.",
    "architecture",
  ],
  [
    "engineering-consultancy",
    "Engineering Consultancy",
    "Practical thinking for complex challenges.",
    "engineers",
  ],
  [
    "maintenance-and-repair",
    "Maintenance & Repair",
    "Protecting the performance of your buildings.",
    "industrial",
  ],
].map(([slug, title, description, image]) => ({
  slug,
  title,
  description,
  image: "/images/" + image + ".jpg",
  category: "Proposed service",
  scope: [
    "Requirement review and site coordination",
    "Planning, scope definition and cost estimation",
    "Workmanship and material checks",
    "Progress documentation and handover",
  ],
}));
export const projects: Entry[] = [
  {
    slug: "business-complex",
    title: "Business Complex",
    description:
      "A study in flexible commercial architecture, combining a clear structural grid with generous natural light.",
    category: "Commercial",
    image: "/images/hero.jpg",
  },
  {
    slug: "courtyard-residence",
    title: "Courtyard Residence",
    description:
      "A residential concept that connects private living spaces with greenery and daylight.",
    category: "Residential",
    image: "/images/residential.jpg",
  },
  {
    slug: "industrial-facility",
    title: "Industrial Facility",
    description:
      "An illustrative industrial environment organized around efficient circulation and adaptable working areas.",
    category: "Industrial",
    image: "/images/industrial.jpg",
  },
  {
    slug: "urban-infrastructure",
    title: "Urban Infrastructure",
    description:
      "An infrastructure study exploring the coordination, planning and execution of essential civil works.",
    category: "Infrastructure",
    image: "/images/construction.jpg",
  },
  {
    slug: "workplace-interiors",
    title: "Workplace Interiors",
    description:
      "An adaptable workplace concept designed around people, collaboration and everyday comfort.",
    category: "Commercial",
    image: "/images/interior.jpg",
  },
  {
    slug: "contemporary-building",
    title: "Contemporary Building",
    description:
      "A built-form study balancing structural expression, environmental context and timeless detailing.",
    category: "Commercial",
    image: "/images/architecture.jpg",
  },
];
export const articles: Entry[] = [
  {
    slug: "planning-before-building",
    title: "A better build begins with a better brief",
    description:
      "The questions worth answering before your project moves from an idea to a construction site.",
    category: "Project Planning",
    image: "/images/architecture.jpg",
    body: "A well-defined brief gives a project a shared starting point. Begin with the intended use of the building, who it serves and which outcomes matter most. Separate essential requirements from preferences so that future trade-offs are easier to discuss.\n\nRecord site constraints, access requirements, available information and the decisions still to be made. A professional site assessment can identify issues that drawings alone may not reveal. Local approvals and design requirements should be checked with qualified professionals for the specific project.\n\nBuild an initial schedule around decisions, design coordination, approvals and procurement as well as construction. An estimate is most useful when its assumptions, exclusions and allowances are visible.\n\nBefore work begins, agree how changes will be reviewed, documented and approved. A clear brief is a living reference that helps everyone understand the purpose behind each decision.",
  },
  {
    slug: "quality-through-documentation",
    title: "Why good documentation matters on site",
    description:
      "From material records to handover checklists, a considered paper trail supports better decisions.",
    category: "Quality & Safety",
    image: "/images/engineers.jpg",
    body: "Project documentation connects intentions with what happens on site. Drawings, approved specifications and inspection records give the project team a common reference.\n\nA useful document system makes the current revision easy to find. Superseded information should be clearly identified, and changes should reach the people responsible for carrying them out.\n\nMaterial records and inspection notes help track issues while they can still be addressed. Record observations, actions, responsibilities and close-out evidence in a consistent format.\n\nHandover planning should begin early. Collect the relevant operation and maintenance information as work progresses, with the exact requirements agreed for the project.",
  },
  {
    slug: "designing-for-long-term-value",
    title: "Thinking beyond the day of handover",
    description:
      "A practical introduction to durability, maintainability and the life of a building.",
    category: "Building Knowledge",
    image: "/images/interior.jpg",
    body: "The value of a building continues to develop long after construction is complete. Early decisions about access, materials and flexibility can shape how easily it is maintained and adapted.\n\nConsider how the building will be used, cleaned, inspected and repaired. Discuss expected exposure conditions and maintenance requirements with the design team when assessing material options.\n\nFlexible layouts can make future changes easier, but every project has its own constraints. Compare initial cost with the implications for operation and replacement.\n\nA thoughtful handover helps the people who will manage the building understand its systems. Keep agreed maintenance guidance and project records accessible.",
  },
];
export const steps = [
  [
    "Initial consultation",
    "Start with a conversation about your vision, priorities and expectations.",
  ],
  [
    "Requirement analysis",
    "Turn the brief into a clear set of requirements and deliverables.",
  ],
  [
    "Site assessment",
    "Understand site conditions, access and project-specific constraints.",
  ],
  [
    "Planning & estimation",
    "Establish the scope, assumptions and an informed cost framework.",
  ],
  [
    "Design coordination",
    "Bring design disciplines and engineering requirements together.",
  ],
  [
    "Project scheduling",
    "Sequence activities, procurement and key decision milestones.",
  ],
  [
    "Construction execution",
    "Coordinate the people, materials and work on site.",
  ],
  [
    "Quality & safety checks",
    "Review workmanship, document inspections and address risks.",
  ],
  [
    "Handover & support",
    "Close out agreed deliverables and prepare for the life of the building.",
  ],
];
export const faqs = [
  [
    "What services can I enquire about?",
    "You can enquire about construction, civil engineering, contracting, project management and the other categories on our Services page. These are proposed service areas; availability and scope must be confirmed directly for your project.",
  ],
  [
    "How do I start a project conversation?",
    "Use the contact form for an initial enquiry, or the six-step quote form to share a more detailed brief. Include the project type, location and any important constraints.",
  ],
  [
    "Is a quotation a construction contract?",
    "No. An enquiry or preliminary estimate does not create a construction contract. Scope, commercial terms, responsibilities and approvals must be agreed separately.",
  ],
  [
    "How is a project timeline determined?",
    "A project schedule depends on scope, site conditions, design readiness, procurement, approvals and other project-specific factors. A timeline can be discussed after the requirements are reviewed.",
  ],
  [
    "What does project management involve?",
    "It can include planning, coordination, progress tracking, cost monitoring and documentation. The exact role and deliverables should be agreed in writing.",
  ],
  [
    "How should quality be managed?",
    "A project-specific quality plan typically identifies the applicable specifications, material checks, inspections, responsibilities and documentation required.",
  ],
  [
    "How are safety requirements addressed?",
    "Site-specific risks, responsibilities and applicable requirements should be reviewed by qualified people before work begins and throughout execution. The Quality & Safety page describes general principles.",
  ],
  [
    "Can I attach drawings to my enquiry?",
    "The quote form accepts up to three PDF, JPEG or PNG files, each up to 5 MB. Files are kept in private storage and are accessible only to authorized administrators.",
  ],
];
export const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Team", "/team"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Our Process", "/process"],
  ["Insights", "/insights"],
  ["Contact", "/contact"],
];
export const origin =
  "https://adex-engineering-contracting.dwellmartuae.chatgpt.site";
