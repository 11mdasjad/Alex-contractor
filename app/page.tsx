import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Clock3,
  HardHat,
  Compass,
} from "lucide-react";
import {
  Photo,
  ServiceGrid,
  SectionHead,
  ProjectsGrid,
  CTA,
  Values,
  ArticlesGrid,
} from "@/components/site";
import { catalogue, siteSettings } from "@/lib/server";
export const metadata = { alternates: { canonical: "/" } };
export default async function Home() {
  const settings = await siteSettings();
  const [services, projects, articles, testimonials] = await Promise.all(
    ["services", "projects", "articles", "testimonials"].map(catalogue),
  );
  return (
    <>
      <section className="hero">
        <Photo
          src="/images/hero.jpg"
          alt="Glass and steel architecture reaching towards the sky"
          priority
          className="hero-photo"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            ADEX ENGINEERING & CONTRACTING
          </div>
          <h1>
            Building Today,
            <br />
            Shaping <span>Tomorrow.</span>
          </h1>
          <p>
            Dependable engineering. Thoughtful construction.
            <br className="desktop-break" /> A considered approach to bringing
            your vision to life.
          </p>
          <div className="hero-buttons">
            <Link href="/services" className="button accent">
              Explore Our Services <ArrowUpRight size={18} />
            </Link>
            <Link href="/quote" className="button outline white">
              Discuss Your Project <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-bottom">
            <div className="hero-trust">
              {[
                [Compass, "Reliable", "Engineering"],
                [HardHat, "Quality", "Construction"],
                [Clock3, "Considered", "Execution"],
                [ShieldCheck, "Client-Focused", "Approach"],
              ].map(([Icon, a, b]) => {
                const I = Icon as typeof Compass;
                return (
                  <div key={String(a)}>
                    <I size={29} strokeWidth={1.3} />
                    <span>
                      {String(a)}
                      <br />
                      {String(b)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="hero-caption">
              <span>BUILT ON PURPOSE</span>
              <span className="caption-line" />
              01
            </div>
          </div>
        </div>
      </section>
      {!!settings?.stats?.length && (
        <section
          className="container company-stats"
          aria-label="Verified company statistics"
        >
          {settings.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>
      )}
      <section className="section container services-section">
        <SectionHead
          eyebrow="EXPERTISE THAT BUILDS POSSIBILITIES"
          title="Our Services"
          description="An integrated approach to the spaces and structures that shape our world."
          link="/services"
          label="View All Services"
        />
        <ServiceGrid items={services.slice(0, 8)} />
        <p className="fine-print">
          Proposed service areas. Availability and scope are confirmed for each
          project.
        </p>
      </section>
      <section className="projects-section">
        <div className="container section">
          <SectionHead
            eyebrow="A VISION OF WHAT’S POSSIBLE"
            title="Spaces with purpose."
            description="Explore architectural directions across a range of project types."
            link="/projects"
            label="Explore Projects"
            light
          />
          <ProjectsGrid items={projects} home />
          <p className="fine-print">
            Concept portfolio · Photography is illustrative and does not
            represent completed ADEX projects.
          </p>
        </div>
      </section>
      <section className="section container why-section">
        <div>
          <div className="eyebrow">THE ADEX APPROACH</div>
          <h2>
            Strong foundations.
            <br />
            Shared ambitions.
          </h2>
          <p className="section-copy">
            A good building starts well before the first brick. We believe in
            clear thinking, open communication and attention to the details that
            matter.
          </p>
          <Values />
          <Link className="text-link" href="/about">
            Get to know ADEX <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="why-image">
          <Photo
            src="/images/engineers.jpg"
            alt="Construction professionals collaborating on site"
          />
          <div className="image-caption">
            <span>FROM THE FIRST CONVERSATION</span>
            <h3>
              Built around
              <br />
              your vision.
            </h3>
            <Link href="/contact">
              Let’s talk <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="process-preview section">
        <div className="container">
          <SectionHead
            eyebrow="CLARITY AT EVERY STEP"
            title="From an idea to a lasting impact."
            description="A structured framework for moving your project forward."
            link="/process"
            label="Our Full Process"
          />
          <div className="process-four">
            {[
              ["01", "Understand", "Listen carefully. Define what matters."],
              ["02", "Plan", "Align the scope, design and schedule."],
              ["03", "Build", "Coordinate with care and precision."],
              ["04", "Deliver", "Review, document and hand over."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <p className="fine-print">
            General construction workflow. Project-specific responsibilities are
            agreed separately.
          </p>
        </div>
      </section>
      {testimonials.filter((t) => t.verified).length > 0 && (
        <section className="section container">
          <SectionHead
            eyebrow="CLIENT PERSPECTIVES"
            title="In their own words."
          />
          <div className="articles-grid">
            {testimonials
              .filter((t) => t.verified)
              .map((t) => (
                <blockquote className="panel" key={t.slug}>
                  <p>{t.quote || t.description}</p>
                  <cite>{t.author}</cite>
                </blockquote>
              ))}
          </div>
        </section>
      )}
      <section className="section container">
        <SectionHead
          eyebrow="IDEAS. KNOWLEDGE. PERSPECTIVE."
          title="Insights & Updates"
          description="Thoughtful reading for the journey from brief to building."
          link="/insights"
          label="All Insights"
        />
        <ArticlesGrid items={articles.slice(0, 3)} />
      </section>
      <CTA />
    </>
  );
}
