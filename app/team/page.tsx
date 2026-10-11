/* eslint-disable @next/next/no-img-element -- Local SVG profile illustrations. */
import type { Metadata } from "next";
import { PageHero, CTA } from "@/components/site";
import { origin } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the ADEX team across project leadership and operations.",
  alternates: { canonical: origin + "/team" },
};

const members = [
  {
    name: "Md Saif Ali", slug: "md-saif-ali", role: "Project Lead",
    photo: "/images/team/md-saif-ali.jpeg",
    bio: "A clear direction from the first conversation to the final handover. Saif’s focus is project planning, aligning priorities and keeping clients and delivery teams connected throughout the work.",
    focus: ["Project planning", "Team coordination", "Delivery"],
  },
  {
    name: "Firoz Alam", slug: "firoz-alam", role: "Operation Manager",
    photo: "/images/team/firoz-alam.jpeg",
    bio: "Turning project plans into organised day-to-day action. Firoz’s focus is coordinating resources, following up with suppliers and supporting a steady workflow between the office and the site.",
    focus: ["Operations", "Resource planning", "Procurement"],
  },

];

export default function TeamPage() {
  return (
    <>
      <PageHero title="The people behind ADEX." eyebrow="OUR TEAM" description="Shared purpose. Clear responsibilities. A thoughtful approach to every project." image="/images/engineers.jpg" />
      <section className="section container">
        <div className="team-intro">
          <div className="eyebrow">WORKING TOGETHER</div>
          <h2>One team. Every stage of your project.</h2>
          <p>From understanding your requirements to coordinating work on site, meet the people bringing the different parts of your project together.</p>
        </div>
        <div className="team-grid">
          {members.map((member) => (
            <article className="team-card" key={member.slug} aria-labelledby={member.slug}>
              <div className="team-visual">
                <div className="team-avatar">
                  {member.photo ? (
                    <img className={`team-portrait team-portrait-${member.slug}`} src={member.photo} alt={member.name} width={member.slug === "firoz-alam" ? 990 : 960} height={1280} />
                  ) : (
                    <span className="team-initials" aria-label={`${member.name} — initials illustration`} role="img">
                      {member.name.split(" ").map((part) => part[0]).join("")}
                    </span>
                  )}
                </div>
                <span className="team-visual-label">ADEX · Engineering &amp; Contracting</span>
              </div>
              <div className="team-card-body">
                <h2 id={member.slug}>{member.name}</h2>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
                <div className="team-focus" aria-label="Areas of focus">
                  {member.focus.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
