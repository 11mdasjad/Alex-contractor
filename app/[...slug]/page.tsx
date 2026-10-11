import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  MessageSquare,
  MapPin,
  BriefcaseBusiness,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import {
  PageHero,
  ServiceGrid,
  ProjectsGrid,
  SectionHead,
  Values,
  Photo,
  CTA,
  CheckList,
  Gallery,
  ArticlesGrid,
  FAQ,
} from "@/components/site";
import { EnquiryForm } from "@/components/enquiry-form";
import { catalogue, siteSettings } from "@/lib/server";
import { steps, origin } from "@/lib/content";
const titles: Record<string, string> = {
  about: "About Us",
  services: "Our Services",
  projects: "Our Projects",
  process: "Our Process",
  "quality-safety": "Quality & Safety",
  careers: "Careers",
  insights: "Insights & Updates",
  contact: "Contact Us",
  quote: "Request a Quote",
  faq: "Frequently Asked Questions",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  search: "Search",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  let title = titles[slug[0]] || "Page Not Found";
  let description =
    title +
    " at ADEX Engineering & Contracting. Explore our considered approach to construction, engineering and your next project.";
  if (slug.length === 2) {
    const kind =
      slug[0] === "insights"
        ? "articles"
        : slug[0] === "careers"
          ? "jobs"
          : slug[0];
    const item = (await catalogue(kind)).find((x) => x.slug === slug[1]);
    if (item) {
      title = item.seoTitle || item.title;
      description = item.seoDescription || item.description;
    }
  }
  return {
    title,
    description,
    alternates: { canonical: origin + "/" + slug.join("/") },
    ...(slug[0] === "search" ? { robots: { index: false, follow: true } } : {}),
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const name = slug[0];
  const settings = name === "contact" ? await siteSettings() : null;
  if (slug.length > 2 || (!titles[name] && name !== "careers")) notFound();
  if (slug.length === 2) {
    const kind =
      name === "insights" ? "articles" : name === "careers" ? "jobs" : name;
    if (!["services", "projects", "articles", "jobs"].includes(kind))
      notFound();
    const entries = await catalogue(kind);
    const item = entries.find((x) => x.slug === slug[1]);
    if (!item) notFound();
    if (kind === "jobs")
      return (
        <>
          <PageHero title={item.title} description={item.description} />
          <section className="section container two-col">
            <div className="prose">
              <h2>About the opportunity</h2>
              {(item.body || item.description).split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>{item.location}</p>
            </div>
            <EnquiryForm kind="application" job={item.slug} />
          </section>
        </>
      );
    if (kind === "articles")
      return (
        <>
          <article className="container section article-main">
            <div className="prose">
              <Link href="/insights" className="text-link">
                ← All insights
              </Link>
              <div className="eyebrow">{item.category}</div>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
              <span className="read-time">
                {Math.max(
                  1,
                  Math.ceil((item.body || "").split(/\s+/).length / 200),
                )}{" "}
                min read · ADEX Insights
              </span>
              <Photo
                src={item.image}
                alt={item.title}
                className="detail-cover"
              />
              {(item.body || item.description).split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="notice">
                General educational information. Project-specific decisions
                require advice from the relevant qualified professionals.
              </div>
            </div>
          </article>
          <section className="section container">
            <SectionHead title="Keep exploring" />
            <ArticlesGrid
              items={entries.filter((x) => x.slug !== item.slug).slice(0, 3)}
            />
          </section>
          <CTA />
        </>
      );
    return (
      <>
        <PageHero
          title={item.title}
          description={item.description}
          image={item.image}
        />
        <section className="section container">
          <div className="notice">
            {kind === "services"
              ? "Proposed service area. Availability, qualifications and scope must be confirmed by ADEX before engagement."
              : item.verified
                ? "Project information supplied by ADEX."
                : "Demonstration project. This architectural study and its photographs do not represent ADEX work."}
          </div>
          <div className="detail-layout">
            <div>
              <Photo
                src={item.image}
                alt={item.title + " illustrative photograph"}
                className="detail-cover"
              />
              <h2>
                {kind === "services"
                  ? "A considered approach to " + item.title.toLowerCase()
                  : "Project overview"}
              </h2>
              <p>{item.body || item.description}</p>
              {kind === "services" ? (
                <>
                  <h2>Scope of work</h2>
                  <CheckList
                    items={
                      item.scope || [
                        "Requirement review",
                        "Planning and coordination",
                        "Workmanship review",
                        "Documentation and handover",
                      ]
                    }
                  />
                  <h2>From planning to execution</h2>
                  <p>
                    Begin with a clear brief and a review of the site and
                    requirements. Agree responsibilities, deliverables and
                    decision milestones before coordinating the work. Progress
                    and changes should be documented throughout the project.
                  </p>
                  <h2>Quality & safety</h2>
                  <p>
                    Material checks, workmanship reviews and site-specific risk
                    assessments should be defined for the agreed scope.
                    Applicable standards and professional responsibilities must
                    be confirmed before work begins.
                  </p>
                  <Link className="text-link" href="/quality-safety">
                    Explore our quality principles <ArrowUpRight size={15} />
                  </Link>
                </>
              ) : (
                <dl className="detail-facts">
                  <div>
                    <dt>Category</dt>
                    <dd>{item.category}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{item.status || "Illustrative concept"}</dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{item.location || "Not applicable — demonstration"}</dd>
                  </div>
                  {item.date && (
                    <div>
                      <dt>Completion</dt>
                      <dd>{item.date}</dd>
                    </div>
                  )}
                </dl>
              )}
              <h2>In perspective</h2>
              <Gallery
                images={[
                  item.image,
                  "/images/engineers.jpg",
                  "/images/construction.jpg",
                ].filter((v, i, a) => a.indexOf(v) === i)}
                title={item.title}
              />
              <p className="fine-print">
                Illustrative stock photography. Select an image to enlarge.
              </p>
            </div>
            <aside className="panel">
              <div className="eyebrow">YOUR NEXT CHAPTER</div>
              <h3>
                Have something
                <br />
                in mind?
              </h3>
              <p>Share your project brief and let’s start a conversation.</p>
              <Link className="button" href="/quote">
                Request a Quote <ArrowRight size={16} />
              </Link>
              <Link className="text-link" href="/contact">
                Contact us <ArrowUpRight size={16} />
              </Link>
            </aside>
          </div>
        </section>
        <section className="section container">
          <SectionHead
            title={
              kind === "services" ? "Related services" : "More possibilities"
            }
          />
          {kind === "services" ? (
            <ServiceGrid
              items={entries.filter((x) => x.slug !== item.slug).slice(0, 4)}
            />
          ) : (
            <ProjectsGrid
              items={entries.filter((x) => x.slug !== item.slug).slice(0, 3)}
            />
          )}
        </section>
        <CTA />
      </>
    );
  }
  if (name === "services")
    return (
      <>
        <PageHero
          title="Our Services"
          description="Coordinated thinking. Purposeful spaces. Explore our proposed areas of expertise."
        />
        <section className="section container">
          <SectionHead
            eyebrow="FROM FOUNDATION TO FINISH"
            title="Expertise across every stage."
            description="Explore the right starting point for your project."
          />
          <ServiceGrid items={await catalogue("services")} />
          <p className="fine-print">
            All service areas are proposed and require company confirmation.
            Photographs are illustrative.
          </p>
        </section>
        <CTA />
      </>
    );
  if (name === "projects")
    return (
      <>
        <PageHero
          title="Our Projects"
          description="An exploration of the spaces, structures and possibilities that inspire us."
          image="/images/architecture.jpg"
        />
        <section className="section container">
          <SectionHead
            eyebrow="A CONCEPT PORTFOLIO"
            title="Explore the possibilities."
          />
          <div className="notice">
            These clearly labeled demonstration projects illustrate
            architectural directions. They are not completed or ongoing ADEX
            projects. Verified projects will be added when supplied.
          </div>
          <ProjectsGrid items={await catalogue("projects")} />
        </section>
        <CTA />
      </>
    );
  if (name === "about")
    return (
      <>
        <PageHero
          title="About Us"
          description="A clear purpose. A considered approach. A commitment to the details."
          image="/images/architecture.jpg"
        />
        <section className="section container">
          <div className="two-col">
            <div>
              <div className="eyebrow">INTRODUCING ADEX</div>
              <h2>
                Building with purpose.
                <br />
                Thinking for tomorrow.
              </h2>
              <p className="section-copy">
                ADEX Engineering & Contracting brings a focus on careful
                planning, professional execution and quality to the conversation
                around construction.
              </p>
              <p className="section-copy">
                Our proposed approach is simple: understand the brief, bring
                clarity to the scope and keep communication at the heart of the
                project. Every structure begins with people working towards a
                shared vision.
              </p>
              <Link className="button" href="/contact">
                Start a conversation <ArrowUpRight size={17} />
              </Link>
            </div>
            <Photo
              src="/images/architecture.jpg"
              alt="Architectural form and structural detailing"
            />
          </div>
          <div className="split-panels">
            <div className="panel">
              <div className="eyebrow">OUR MISSION</div>
              <h3>Make every decision count.</h3>
              <p>
                To support dependable construction through careful planning,
                clear coordination and attention to workmanship.
              </p>
            </div>
            <div className="panel">
              <div className="eyebrow">OUR VISION</div>
              <h3>Build lasting value.</h3>
              <p>
                To help shape spaces and infrastructure that serve people well,
                today and into the future.
              </p>
            </div>
          </div>
        </section>
        <section className="section process-preview">
          <div className="container">
            <SectionHead
              eyebrow="WHAT GUIDES US"
              title="Our values, in practice."
            />
            <Values />
          </div>
        </section>
        <section className="section container two-col">
          <Photo
            src="/images/engineers.jpg"
            alt="Teamwork on a construction site"
          />
          <div>
            <div className="eyebrow">PEOPLE & PRINCIPLES</div>
            <h2>
              Good work starts
              <br />
              with a shared standard.
            </h2>
            <p className="section-copy">
              Clear roles, considered decisions and respect for the people doing
              the work are the foundations of a coordinated project.
            </p>
            <CheckList
              items={[
                "Communicate openly and document decisions",
                "Consider quality and safety from the outset",
                "Define responsibilities before work begins",
                "Review, learn and improve throughout delivery",
              ]}
            />
            <p className="fine-print">
              Leadership profiles and company credentials will be published
              after verification. The registration identifier supplied for
              review is U45201UP2024PTC188745; independent verification is
              pending.
            </p>
            <Link className="text-link" href="/quality-safety">
              Quality & Safety <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <CTA />
      </>
    );
  if (name === "process")
    return (
      <>
        <PageHero
          title="Our Process"
          description="A clear path from the first conversation to the final handover."
        />
        <section className="section container">
          <div className="notice">
            This is a general construction workflow. ADEX’s role, services and
            project-specific responsibilities are confirmed in the agreed scope.
          </div>
          <div className="timeline">
            {steps.map(([t, d], i) => (
              <div className="timeline-item" key={t}>
                <span className="step-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2>{t}</h2>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <CTA />
      </>
    );
  if (name === "quality-safety")
    return (
      <>
        <PageHero
          title="Quality & Safety"
          description="Care in the details. Responsibility in the decisions."
          image="/images/engineers.jpg"
        />
        <section className="section container">
          <div className="two-col">
            <div>
              <div className="eyebrow">A FRAMEWORK FOR RESPONSIBLE WORK</div>
              <h2>
                Built on care,
                <br />
                at every stage.
              </h2>
              <p className="section-copy">
                Quality and safety belong in the planning conversation, the
                daily site routine and the handover record. The principles below
                describe a general framework to be adapted to each project.
              </p>
              <div className="notice">
                These are proposed principles, not claims of certification or
                verified operating procedures. Project-specific requirements
                must be defined by qualified professionals.
              </div>
            </div>
            <Photo
              src="/images/construction.jpg"
              alt="Construction site with structural work in progress"
            />
          </div>
          <div className="split-panels">
            {[
              [
                "Quality planning",
                "Define acceptance criteria, responsibilities and inspection points against the agreed project specifications.",
              ],
              [
                "Site supervision",
                "Coordinate responsibilities and ensure that current drawings and approved instructions are available to the people performing the work.",
              ],
              [
                "Materials & workmanship",
                "Review agreed material specifications, inspect relevant work stages and record observations before covering up completed work.",
              ],
              [
                "Safety & risk management",
                "Identify site-specific hazards, agree controls and review changing conditions. Training and supervision should fit the work being undertaken.",
              ],
              [
                "Inspection & documentation",
                "Keep a clear record of checks, corrective actions and close-out evidence. Make handover requirements part of the plan from the outset.",
              ],
              [
                "Environmental responsibility",
                "Consider waste, resource use and the effect of construction activities on the surrounding community within the applicable project requirements.",
              ],
            ].map(([t, d]) => (
              <div className="panel" key={t}>
                <ShieldCheck size={25} color="#102a8c" />
                <h3 style={{ marginTop: 16 }}>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>
        <CTA />
      </>
    );
  if (name === "insights")
    return (
      <>
        <PageHero
          title="Insights & Updates"
          description="Ideas and practical perspectives for a more considered built environment."
        />
        <section className="section container">
          <ArticlesGrid items={await catalogue("articles")} filterable />
        </section>
        <CTA />
      </>
    );
  if (name === "contact")
    return (
      <>
        <PageHero
          title="Contact Us"
          description="Every worthwhile project begins with a conversation."
        />
        <section className="section container two-col">
          <div className="contact-intro">
            <div className="eyebrow">LET’S TALK ABOUT WHAT’S NEXT</div>
            <h2>
              Your vision.
              <br />
              Our starting point.
            </h2>
            <p>
              Tell us what you’re planning. Share your project’s location,
              intended use and the priorities that matter most to you.
            </p>
            <div className="contact-item">
              <MessageSquare size={22} />
              <div>
                <h3>Project enquiries</h3>
                <p>
                  Use this form to send your brief securely.
                  <br />
                  For a detailed request, use our{" "}
                  <Link
                    className="text-link"
                    style={{ marginTop: 0 }}
                    href="/quote"
                  >
                    quote form ↗
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="contact-item">
              <MapPin size={22} />
              <div>
                <h3>Company contact details</h3>
                {settings ? (
                  <div>
                    {settings.email && (
                      <a href={"mailto:" + settings.email}>{settings.email}</a>
                    )}
                    {settings.phone && (
                      <p>
                        <a href={"tel:" + settings.phone}>{settings.phone}</a>
                      </p>
                    )}
                    {settings.address && <p>{settings.address}</p>}
                    {settings.whatsapp && (
                      <a
                        className="text-link"
                        href={"https://wa.me/" + settings.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Enquire on WhatsApp ↗
                      </a>
                    )}
                  </div>
                ) : (
                  <p>
                    Official office address, telephone and email
                    <br />
                    will be added after company verification.
                  </p>
                )}
              </div>
            </div>
            <div className="contact-item">
              <FileCheck2 size={22} />
              <div>
                <h3>A clear next step</h3>
                <p>
                  Submitting an enquiry starts a discussion.
                  <br />
                  Scope, availability and terms are agreed separately.
                </p>
              </div>
            </div>
          </div>
          <EnquiryForm />
        </section>
      </>
    );
  if (name === "quote")
    return (
      <>
        <PageHero
          title="Request a Quote"
          description="Tell us about your plans. We’ll start with the details that matter."
        />
        <section className="section container">
          <EnquiryForm kind="quote" />
        </section>
      </>
    );
  if (name === "faq")
    return (
      <>
        <PageHero
          title="Frequently Asked Questions"
          description="A little clarity before your next step."
        />
        <section className="section container">
          <FAQ />
        </section>
        <CTA />
      </>
    );
  if (name === "careers") {
    const jobs = await catalogue("jobs");
    return (
      <>
        <PageHero
          title="Build your next chapter."
          eyebrow="CAREERS AT ADEX"
          description="Thoughtful people. Shared standards. Work with purpose."
          image="/images/engineers.jpg"
        />
        <section className="section container">
          <SectionHead
            eyebrow="GROW WITH PURPOSE"
            title="Careers at ADEX"
            description="We value curiosity, responsibility and collaboration across engineering and construction."
          />
          {jobs.length ? (
            <div className="admin-list">
              {jobs.map((j) => (
                <Link
                  className="panel"
                  href={"/careers/" + j.slug}
                  key={j.slug}
                >
                  <h3>{j.title} ↗</h3>
                  <p>{j.description}</p>
                  <span>{j.location}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BriefcaseBusiness size={40} />
              <h2>No Current Openings</h2>
              <p>
                There are no verified vacancies listed at the moment. Check back
                for future opportunities or get in touch with a general enquiry.
              </p>
              <Link href="/contact" className="button">
                Get in touch <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
      </>
    );
  }
  if (name === "search") {
    const { q = "" } = await searchParams;
    const term = q.slice(0, 200).trim();
    const results = (
      await Promise.all(
        ["services", "projects", "articles"].map(async (kind) =>
          (await catalogue(kind)).map((x) => ({ ...x, kind })),
        ),
      )
    )
      .flat()
      .filter(
        (x) =>
          term &&
          (x.title + " " + x.description)
            .toLowerCase()
            .includes(term.toLowerCase()),
      );
    return (
      <>
        <PageHero
          title="Search"
          description="Find a service, project concept or perspective."
        />
        <section className="section container">
          <form action="/search" className="search-row">
            <input
              aria-label="Search website"
              name="q"
              defaultValue={term}
              placeholder="Search ADEX…"
            />
            <button className="button">
              Search <ArrowRight size={16} />
            </button>
          </form>
          <p>
            {results.length} results {term && "for “" + term + "”"}
          </p>
          <div className="search-results">
            {results.map((x) => (
              <Link
                className="search-result"
                key={x.kind + x.slug}
                href={
                  "/" +
                  (x.kind === "articles" ? "insights" : x.kind) +
                  "/" +
                  x.slug
                }
              >
                <span>{x.kind}</span>
                <h2>{x.title} ↗</h2>
                <p>{x.description}</p>
              </Link>
            ))}
          </div>
          {!results.length && (
            <div className="empty-state">
              Try a different term, such as “construction”, “planning” or
              “commercial”.
            </div>
          )}
        </section>
      </>
    );
  }
  if (name === "privacy" || name === "terms") {
    const privacy = name === "privacy";
    const sections = privacy
      ? [
          [
            "Information collected",
            "Enquiry forms collect your name, email, phone number, optional company name and the project details you choose to provide. Quote requests may include drawings or reference files. Job applications may include your resume and experience. Technical request information is used to limit automated abuse.",
          ],
          [
            "Purpose of processing",
            "Information is used to review and respond to enquiries, assess project requirements and consider job applications. Submitting a form does not create a contractual commitment. Do not submit sensitive personal information that is unnecessary for your request.",
          ],
          [
            "Storage and access",
            "Submitted records are stored in the site database. Attachments are stored privately and can be retrieved only through authorized administrative access. Staff access is restricted through an explicit administrator allowlist.",
          ],
          [
            "Third-party services",
            "Hosting, database storage, file storage and site sign-in are provided through OpenAI Sites and Cloudflare infrastructure. Google Fonts supplies the site fonts and may receive technical connection data. Optional email notifications use Resend when configured.",
          ],
          [
            "Retention",
            "A company-approved retention schedule has not yet been configured. Records remain stored until an authorized administrator deletes them. A retention policy and deletion process must be approved before public operation.",
          ],
          [
            "Security",
            "Access controls, validation, file restrictions and request limits are used to reduce risk. No system can guarantee absolute security. Avoid sending passwords, identity documents or other unnecessary sensitive information.",
          ],
          [
            "Your choices and requests",
            "You may ask about, correct or request deletion of information submitted through this site using the contact form. Include your submission reference where possible. Applicable rights and response obligations depend on the relevant law and must be reviewed for the company’s operations.",
          ],
          [
            "Privacy contact and updates",
            "Use the Contact page for privacy questions while the official privacy contact is awaiting verification. This draft must be reviewed and approved, including contact details, lawful bases, retention periods and applicable rights, before public launch.",
          ],
        ]
      : [
          [
            "Website use",
            "Use this website for lawful information and enquiries. Do not attempt unauthorized access, disrupt its operation or submit malicious content. Information is provided as general introductory material.",
          ],
          [
            "Proposed services and illustrative content",
            "Service categories are proposed until confirmed by the company. Demonstration projects and stock photographs are clearly labeled and do not represent completed ADEX work. Unverified company credentials and client claims are not presented as established facts.",
          ],
          [
            "Enquiry submissions",
            "Provide information you are entitled to share and take care to make it accurate. Receipt of an enquiry is not acceptance of a project, an appointment, an offer of employment or a binding quotation.",
          ],
          [
            "Separate project agreements",
            "Website terms are not a construction contract. Any engagement requires a separate agreement covering scope, responsibilities, pricing, programme, approvals and other applicable terms.",
          ],
          [
            "Intellectual property",
            "Company branding and site materials remain subject to their respective owners’ rights. Stock photography is used under the applicable source licence. Do not imply endorsement or ownership of third-party content.",
          ],
          [
            "Third-party links and services",
            "Third-party services and links operate under their own terms. Their availability and content are outside the company’s direct control.",
          ],
          [
            "Availability and liability",
            "Information may change and the site may be unavailable from time to time. Any limitations of liability must be assessed under applicable law and agreed legal wording; this draft does not exclude rights that cannot lawfully be excluded.",
          ],
          [
            "Contact and review",
            "Questions can be submitted through the Contact page. These terms are a draft for company and legal review. Governing law, company particulars and approved contact details must be confirmed before public launch.",
          ],
        ];
    return (
      <>
        <PageHero title={titles[name]} />
        <section className="section container">
          <div className="prose">
            <div className="notice">
              Draft for review · This policy requires approval for the company’s
              actual operations before public launch.
            </div>
            {sections.map(([t, d], i) => (
              <section key={t}>
                <h2>
                  {i + 1}. {t}
                </h2>
                <p>{d}</p>
              </section>
            ))}
            <Link className="text-link" href="/contact">
              Contact ADEX <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
      </>
    );
  }
  notFound();
}
