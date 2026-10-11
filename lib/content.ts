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
  {
    "slug": "building-construction",
    "title": "Building Construction",
    "description": "Thoughtfully planned spaces. Built to last.",
    "image": "/images/hero.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Building construction",
      "Blockwork and plastering",
      "Waterproofing and insulation",
      "Flooring, tiling, and painting",
      "Roofing and false ceiling works"
    ]
  },
  {
    "slug": "civil-engineering",
    "title": "Civil Engineering",
    "description": "Strong foundations for better infrastructure.",
    "image": "/images/construction.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Civil works and site preparation",
      "Concrete and foundation works",
      "Roadworks and paving",
      "Landscaping"
    ]
  },
  {
    "slug": "general-contracting",
    "title": "General Contracting",
    "description": "A coordinated approach from start to finish.",
    "image": "/images/engineers.jpg",
    "category": "Construction Support & Maintenance",
    "scope": [
      "General contracting and trade coordination",
      "Material supply and procurement",
      "Equipment rental",
      "Site installation coordination"
    ]
  },
  {
    "slug": "project-management",
    "title": "Project Management",
    "description": "Clarity, coordination and control at every stage.",
    "image": "/images/architecture.jpg",
    "category": "Construction Support & Maintenance",
    "scope": [
      "Project management and planning",
      "Project coordination and supervision",
      "Programme and resource planning",
      "Progress reporting and handover coordination"
    ]
  },
  {
    "slug": "residential-construction",
    "title": "Residential Construction",
    "description": "Considered spaces for everyday living.",
    "image": "/images/residential.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Residential building construction",
      "Concrete and foundation works",
      "Blockwork and plastering",
      "Flooring, tiling, and painting",
      "Roofing and waterproofing"
    ]
  },
  {
    "slug": "commercial-construction",
    "title": "Commercial Construction",
    "description": "Places that help businesses move forward.",
    "image": "/images/hero.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Commercial building construction",
      "Structural and civil works",
      "Interior fit-out coordination",
      "Flooring, ceilings, and finishes"
    ]
  },
  {
    "slug": "industrial-construction",
    "title": "Industrial Construction",
    "description": "Purpose-built environments for industry.",
    "image": "/images/industrial.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Industrial building construction",
      "Concrete and structural works",
      "Equipment installation coordination",
      "Building services coordination"
    ]
  },
  {
    "slug": "renovation-and-remodeling",
    "title": "Renovation & Remodeling",
    "description": "New possibilities for existing spaces.",
    "image": "/images/interior.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Demolition and renovation",
      "Fit-out and interior works",
      "Repair and refurbishment",
      "Flooring, tiling, and painting",
      "Roofing and false ceiling works"
    ]
  },
  {
    "slug": "infrastructure-development",
    "title": "Infrastructure Development",
    "description": "Connecting communities through essential works.",
    "image": "/images/construction.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Roadworks and paving",
      "Landscaping",
      "Civil infrastructure works",
      "Site preparation and foundation works"
    ]
  },
  {
    "slug": "structural-works",
    "title": "Structural Works",
    "description": "Precision in concrete, steel and structural systems.",
    "image": "/images/architecture.jpg",
    "category": "Civil & Structural Works",
    "scope": [
      "Concrete and foundation works",
      "Structural steel fabrication and installation",
      "Blockwork and structural coordination",
      "Waterproofing and insulation"
    ]
  },
  {
    "slug": "engineering-consultancy",
    "title": "Engineering Consultancy",
    "description": "Practical thinking for complex challenges.",
    "image": "/images/engineers.jpg",
    "category": "Construction Support & Maintenance",
    "scope": [
      "Technical consultancy",
      "Scope and constructability reviews",
      "Engineering coordination",
      "Project planning support"
    ]
  },
  {
    "slug": "maintenance-and-repair",
    "title": "Maintenance & Repair",
    "description": "Protecting the performance of your buildings.",
    "image": "/images/industrial.jpg",
    "category": "Construction Support & Maintenance",
    "scope": [
      "General maintenance",
      "Preventive and corrective maintenance",
      "Facility management",
      "Repair and refurbishment"
    ]
  },
  {
    "slug": "electrical-works",
    "title": "Electrical Works",
    "description": "Electrical installation, distribution, testing and maintenance across LV, MV and HV systems.",
    "image": "/images/industrial.jpg",
    "category": "Electrical, Mechanical & MEP",
    "body": "Electrical installation, distribution, testing and maintenance across LV, MV and HV systems. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "Electrical installation and maintenance",
      "LV, MV, and HV electrical systems",
      "Cable pulling, dressing, and termination",
      "Cable tray and trunking installation",
      "Lighting and power distribution",
      "DB, MDB, and SMDB installation",
      "Earthing and lightning protection",
      "Electrical testing and commissioning",
      "Transformer and switchgear installation",
      "VLF and insulation resistance testing"
    ]
  },
  {
    "slug": "mechanical-services",
    "title": "Mechanical Services",
    "description": "HVAC, plumbing, firefighting, piping and equipment services for building performance.",
    "image": "/images/industrial.jpg",
    "category": "Electrical, Mechanical & MEP",
    "body": "HVAC, plumbing, firefighting, piping and equipment services for building performance. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "HVAC installation and maintenance",
      "Chilled water and ventilation systems",
      "Plumbing and drainage",
      "Firefighting systems",
      "Pumps and motors installation",
      "Ducting and piping works",
      "Equipment installation and commissioning"
    ]
  },
  {
    "slug": "mep-services",
    "title": "MEP Services",
    "description": "Integrated mechanical, electrical and plumbing delivery, from coordination to handover.",
    "image": "/images/engineers.jpg",
    "category": "Electrical, Mechanical & MEP",
    "body": "Integrated mechanical, electrical and plumbing delivery, from coordination to handover. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "Complete MEP installation",
      "MEP coordination and supervision",
      "Shop drawings and as-built drawings",
      "Material supply and installation",
      "Testing, commissioning, and handover",
      "Preventive and corrective maintenance"
    ]
  },
  {
    "slug": "fire-alarm-and-safety-systems",
    "title": "Fire Alarm & Safety Systems",
    "description": "Detection, alarms, emergency lighting and fire suppression system installation and testing.",
    "image": "/images/construction.jpg",
    "category": "Safety, ELV & Railway Systems",
    "body": "Detection, alarms, emergency lighting and fire suppression system installation and testing. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "Fire alarm system installation",
      "Smoke and heat detector installation",
      "Fire alarm panel programming",
      "Emergency lighting systems",
      "Fire suppression systems",
      "Testing and commissioning"
    ]
  },
  {
    "slug": "elv-and-low-current-systems",
    "title": "ELV & Low-Current Systems",
    "description": "Connected security, communications, networking and building management systems.",
    "image": "/images/architecture.jpg",
    "category": "Safety, ELV & Railway Systems",
    "body": "Connected security, communications, networking and building management systems. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "CCTV installation",
      "Access control systems",
      "Structured cabling and networking",
      "Public address systems",
      "Intercom systems",
      "BMS installation and integration",
      "Fiber-optic cable installation and testing"
    ]
  },
  {
    "slug": "metro-and-railway-signaling",
    "title": "Metro & Railway Signaling Services",
    "description": "Signaling, fare collection, trackside equipment and railway systems installation support.",
    "image": "/images/construction.jpg",
    "category": "Safety, ELV & Railway Systems",
    "body": "Signaling, fare collection, trackside equipment and railway systems installation support. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "Railway signaling installation",
      "Automatic Fare Collection (AFC) systems",
      "Track circuit installation and testing",
      "Point machine installation and testing",
      "Eurobalise installation",
      "Relay interface installation",
      "Axle counter and train detection systems",
      "Signaling cable pulling and termination",
      "Third-rail power supply systems",
      "Telecom and trackside equipment installation",
      "Testing, commissioning, and maintenance"
    ]
  },
  {
    "slug": "qa-qc-and-testing",
    "title": "QA/QC & Testing Services",
    "description": "Inspection, testing and quality documentation from material checks through handover.",
    "image": "/images/engineers.jpg",
    "category": "Quality & Site Support",
    "body": "Inspection, testing and quality documentation from material checks through handover. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "Electrical and MEP inspections",
      "Inspection and Test Plans (ITPs)",
      "Method statements and risk assessments",
      "Inspection requests (IRs)",
      "Material inspections",
      "Snagging and de-snagging",
      "Quality documentation and handover",
      "FAT, SAT, and commissioning support",
      "Cable testing and continuity checks"
    ]
  },
  {
    "slug": "manpower-and-site-support",
    "title": "Manpower & Site Support",
    "description": "Trade teams, technical personnel and site coordination support for project delivery.",
    "image": "/images/engineers.jpg",
    "category": "Quality & Site Support",
    "body": "Trade teams, technical personnel and site coordination support for project delivery. Our scope can be coordinated with your project programme, technical requirements and handover plan.",
    "scope": [
      "Skilled and unskilled manpower supply",
      "Electrical technicians and engineers",
      "MEP supervisors",
      "QA/QC inspectors and engineers",
      "Cable pulling teams",
      "Site installation teams",
      "Project coordination and supervision",
      "Preventive and corrective maintenance teams"
    ]
  }
];
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
    "Our services cover civil and structural works, electrical, mechanical and MEP systems, fire safety, ELV, railway signaling, QA/QC, manpower and construction support. Explore the Services page for detailed scopes, then share your project requirements.",
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
