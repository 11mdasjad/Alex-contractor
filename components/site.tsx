"use client";
/* eslint-disable @next/next/no-img-element -- Local photography is size-bounded; CSS handles consistent responsive crops. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Building2,
  HardHat,
  ShieldCheck,
  Clock3,
  Handshake,
  Compass,
  Ruler,
  Layers3,
  Check,
  MoveUpRight,
  Plus,
  Minus,
  Search,
} from "lucide-react";
import { nav, services, faqs, type Entry } from "@/lib/content";
export function Logo() {
  return (
    <img
      className="brand-mark"
      src="/images/adex-logo-new.jpeg"
      width={1280}
      height={853}
      alt="ADEX Engineering and Contracting logo"
    />
  );
}
export function Shell({
  children,
  settings,
  serviceEntries = services,
}: {
  children: React.ReactNode;
  settings?: Entry | null;
  serviceEntries?: Entry[];
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link href="/" aria-label="ADEX home" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav
            aria-label="Main navigation"
            className={open ? "navigation expanded" : "navigation"}
          >
            {nav.map(([name, url]) => (
              <div className="nav-item" key={url}>
                <Link
                  className={
                    path === url || (url !== "/" && path.startsWith(url + "/"))
                      ? "active"
                      : ""
                  }
                  href={url}
                  onClick={() => setOpen(false)}
                >
                  {name}
                  {name === "Services" && <ChevronDown size={12} />}
                </Link>
                {name === "Services" && (
                  <div className="dropdown">
                    {serviceEntries.slice(0, 6).map((s) => (
                      <Link
                        href={"/services/" + s.slug}
                        key={s.slug}
                        onClick={() => setOpen(false)}
                      >
                        {s.title}
                        <ArrowUpRight size={13} />
                      </Link>
                    ))}
                    <Link href="/services" onClick={() => setOpen(false)}>
                      Explore all services <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <Link
              className="button mobile-quote"
              href="/quote"
              onClick={() => setOpen(false)}
            >
              Request a Quote <ArrowRight size={15} />
            </Link>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search website"
              onClick={() => setSearch(!search)}
            >
              <Search size={19} />
            </button>
            <Link className="button small desktop-quote" href="/quote">
              Request a Quote <ArrowRight size={15} />
            </Link>
            <button
              className="icon-button menu-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {search && (
          <div className="search-panel container">
            <form action="/search">
              <label htmlFor="site-search">What are you looking for?</label>
              <div className="search-row">
                <input
                  id="site-search"
                  name="q"
                  placeholder="Search services, projects and insights…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="button" type="submit">
                  Search <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setSearch(false)}
                  aria-label="Close search"
                >
                  <X />
                </button>
              </div>
            </form>
          </div>
        )}
      </header>
      <main id="main">{children}</main>
      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <h3>
              ADEX ENGINEERING
              <br />& CONTRACTING
            </h3>
            <p>
              Considered engineering.
              <br />
              Lasting possibilities.
            </p>
          </div>
          <div>
            <h4>Explore ADEX</h4>
            {[
              ["About us", "/about"],
              ["Our team", "/team"],
              ["Our process", "/process"],
              ["Projects", "/projects"],
              ["Insights", "/insights"],
              ["Careers", "/careers"],
            ].map(([a, b]) => (
              <Link key={b} href={b}>
                {a}
              </Link>
            ))}
          </div>
          <div>
            <h4>Our expertise</h4>
            {serviceEntries.slice(0, 4).map((s) => (
              <Link key={s.slug} href={"/services/" + s.slug}>
                {s.title}
              </Link>
            ))}
            <Link href="/services">View all service areas ↗</Link>
          </div>
          <div>
            <h4>Let’s build a conversation</h4>
            <p>
              Have a project in mind?
              <br />
              Tell us what you’re planning.
            </p>
            <Link href="/contact" className="footer-contact">
              Get in touch <ArrowUpRight size={18} />
            </Link>
            {settings?.email && (
              <a href={"mailto:" + settings.email}>{settings.email}</a>
            )}
            {settings?.phone && (
              <a href={"tel:" + settings.phone}>{settings.phone}</a>
            )}
            {settings?.address && <p>{settings.address}</p>}
            <Link href="/quality-safety">Quality & Safety</Link>
            <Link href="/faq">Frequently asked questions</Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} ADEX Engineering & Contracting.
          </span>
          <div>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onError={(e) => {
        if (!e.currentTarget.dataset.fallback) {
          e.currentTarget.dataset.fallback = "true";
          e.currentTarget.src = "/images/architecture.jpg";
        }
      }}
    />
  );
}
export function ServiceIcon({
  index = 0,
  size = 27,
}: {
  index?: number;
  size?: number;
}) {
  const Icon = [
    Building2,
    HardHat,
    Compass,
    Ruler,
    Building2,
    Layers3,
    Building2,
    Handshake,
  ][index % 8];
  return <Icon size={size} strokeWidth={1.5} />;
}
export function ServiceGrid({ items }: { items: Entry[] }) {
  return (
    <div className="service-grid">
      {items.map((s, i) => (
        <Link
          className="service-card"
          href={"/services/" + s.slug}
          key={s.slug}
        >
          <div className="card-image">
            <Photo
              src={s.image}
              alt={s.title + " — illustrative architectural photography"}
            />
          </div>
          <div className="service-card-content">
            <span className="service-icon">
              <ServiceIcon index={i} />
            </span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
            <ArrowUpRight size={16} className="card-arrow" />
          </div>
        </Link>
      ))}
    </div>
  );
}
export function SectionHead({
  eyebrow,
  title,
  description,
  link,
  label = "Explore more",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: string;
  label?: string;
  light?: boolean;
}) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <Link
          className={"button outline " + (light ? "white" : "")}
          href={link}
        >
          {label}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function ProjectsGrid({
  items,
  home = false,
}: {
  items: Entry[];
  home?: boolean;
}) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(items.map((x) => x.category))];
  const filtered = items.filter(
    (x) => filter === "All" || x.category === filter,
  );
  return (
    <>
      <div className="filters" aria-label="Filter projects">
        {categories.map((c) => (
          <button
            type="button"
            aria-pressed={filter === c}
            key={c}
            className={filter === c ? "selected" : ""}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className={"project-grid " + (home ? "home-projects" : "")}>
        {(home ? filtered.slice(0, 4) : filtered).map((p) => (
          <Link
            href={"/projects/" + p.slug}
            className="project-card"
            key={p.slug}
          >
            <div className="project-image">
              <Photo src={p.image} alt={p.title + " architectural study"} />
              <span className="image-tag">{p.category}</span>
            </div>
            <div className="project-info">
              <div>
                <h3>{p.title}</h3>
                <p>
                  {p.verified
                    ? p.location || "Project details"
                    : "Illustrative project · Not ADEX work"}
                </p>
              </div>
              <span className="round-arrow">
                <ArrowUpRight size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-state">No projects in this category yet.</p>
      )}
    </>
  );
}
export function PageHero({
  title,
  eyebrow = "ADEX ENGINEERING & CONTRACTING",
  description,
  image = "/images/construction.jpg",
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="page-hero">
      <Photo
        priority
        src={image}
        alt="Illustrative construction and architecture"
      />
      <div className="container">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          {title}
        </div>
      </div>
    </section>
  );
}
export function CTA() {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <div className="eyebrow">YOUR VISION. OUR NEXT CONVERSATION.</div>
          <h2>
            Let’s build something
            <br />
            that lasts.
          </h2>
          <p>Every great project starts with a clear conversation.</p>
        </div>
        <Link className="button light" href="/quote">
          Tell us about your project <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function Values() {
  return (
    <div className="values-grid">
      {[
        [
          ShieldCheck,
          "Quality & safety",
          "Careful planning. Considered workmanship.",
        ],
        [
          HardHat,
          "People & expertise",
          "A collaborative approach to every challenge.",
        ],
        [
          Clock3,
          "Clear milestones",
          "A structured path from planning to handover.",
        ],
        [
          Handshake,
          "Lasting relationships",
          "Open communication and shared priorities.",
        ],
      ].map(([Icon, title, text]) => {
        const I = Icon as typeof ShieldCheck;
        return (
          <div className="value-card" key={String(title)}>
            <I size={29} strokeWidth={1.5} />
            <h3>{String(title)}</h3>
            <p>{String(text)}</p>
          </div>
        );
      })}
    </div>
  );
}
export function ArticlesGrid({
  items,
  filterable = false,
}: {
  items: Entry[];
  filterable?: boolean;
}) {
  const [filter, setFilter] = useState("All");
  return (
    <>
      {filterable && (
        <div className="filters">
          {["All", ...new Set(items.map((x) => x.category))].map((c) => (
            <button
              key={c}
              className={filter === c ? "selected" : ""}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="articles-grid">
        {items
          .filter((x) => filter === "All" || x.category === filter)
          .map((a) => (
            <Link
              className="article-card"
              href={"/insights/" + a.slug}
              key={a.slug}
            >
              <div className="article-image">
                <Photo src={a.image} alt={a.title} />
                <span className="round-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </div>
              <div className="article-content">
                <span className="eyebrow">{a.category}</span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <span className="read-time">
                  {Math.max(
                    1,
                    Math.ceil((a.body || "").split(/\s+/).length / 200),
                  )}{" "}
                  min read <span>•</span> ADEX Insights
                </span>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
}
export function FAQ() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {faqs.map(([q, a], i) => (
        <section className="faq-item" key={q}>
          <h2>
            <button
              aria-expanded={active === i}
              aria-controls={"faq-" + i}
              onClick={() => setActive(active === i ? null : i)}
            >
              {q}
              {active === i ? <Minus size={20} /> : <Plus size={20} />}
            </button>
          </h2>
          <div id={"faq-" + i} hidden={active !== i}>
            <p>{a}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
export function Gallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  return (
    <>
      <div className="gallery">
        {images.map((src, i) => (
          <button
            key={src}
            aria-label={"Enlarge " + title + " photograph " + (i + 1)}
            onClick={() => {
              setIndex(i);
              dialog.current?.showModal();
            }}
          >
            <Photo
              src={src}
              alt={title + " illustrative photograph " + (i + 1)}
            />
            <MoveUpRight />
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="lightbox-close"
          aria-label="Close image"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <Photo src={images[index]} alt={title + " enlarged photograph"} />
        <div className="lightbox-controls">
          <button
            onClick={() =>
              setIndex((index + images.length - 1) % images.length)
            }
          >
            Previous
          </button>
          <span>
            {index + 1} / {images.length} · Illustrative photography
          </span>
          <button onClick={() => setIndex((index + 1) % images.length)}>
            Next
          </button>
        </div>
      </dialog>
    </>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((x) => (
        <li key={x}>
          <Check size={17} />
          {x}
        </li>
      ))}
    </ul>
  );
}
