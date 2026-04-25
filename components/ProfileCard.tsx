"use client";

import React from "react";

interface ProfileCardProps {
  person: any;
  variant?: "chat" | "directory";
}

/* ── Icons ─────────────────────────────────────────── */
function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  );
}
function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}
function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── Helpers ─────────────────────────────────────────── */

/** Pretty-print a section slug: "project_readme" → "Projects" */
function formatSection(sections: string[]): string {
  const priority = ["experience", "education", "skills", "project", "project_readme"];
  const found = priority.find(s => sections.includes(s)) || sections[0] || "profile";
  const map: Record<string, string> = {
    experience:     "Experience",
    education:      "Education",
    skills:         "Skills",
    project:        "Projects",
    project_readme: "Projects",
    profile:        "Profile",
  };
  return map[found] || found.charAt(0).toUpperCase() + found.slice(1);
}

/** Pick the most useful chunk for a "summary" snippet.
 *  Prefers experience/education chunks; strips the leading label. */
function pickSummaryText(texts: string[]): string {
  const priority = ["Experience:", "Education:", "Skills:", "Project:"];
  const best = priority
    .map(p => texts.find(t => t.startsWith(p)))
    .find(Boolean) || texts[0] || "";
  // Remove the "Experience: X at Y. Details: " prefix, keep the detail
  return best.replace(/^[^:]+:\s*/, "").trim().slice(0, 200) + (best.length > 200 ? "…" : "");
}

/** Detect data sources from section list */
function detectSources(sections: string[], source: string) {
  const hasLinkedIn = source === "linkedin" || sections.some(s => ["education", "experience", "skills"].includes(s));
  const hasGithub   = sections.some(s => ["project", "project_readme"].includes(s));
  const hasResume   = source === "resume_json" || source === "unified_json";
  return { hasLinkedIn, hasGithub, hasResume };
}

/* ── Copy-to-clipboard hook ────────────────────────── */
function useCopy(text: string): [boolean, () => void] {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return [copied, copy];
}

/* ── Components ─────────────────────────────────────── */

export default function ProfileCard({ person, variant = "chat" }: ProfileCardProps) {
  const name      = person.name || "Unknown";
  const firstName = name.split(" ")[0];
  const sections: string[] = person.sections || [];
  const texts: string[]    = person.texts || (person.text ? [person.text] : []);
  const source: string     = person.source || "";
  const { hasLinkedIn, hasGithub, hasResume } = detectSources(sections, source);

  const sectionLabel = formatSection(sections);
  const summaryText  = pickSummaryText(texts);

  // Warm intro template — uses real name and real section label
  const introText = `Hey ${firstName}, I came across your background in ${sectionLabel.toLowerCase()} and thought there could be a great connection here — would love to reach out and learn more about your work.`;

  const [copied, copy] = useCopy(introText);

  /* ── Directory card ──────────────────────────────── */
  if (variant === "directory") {
    const desc = texts[0]?.replace(/^[^:]+:\s*/, "").trim().slice(0, 180) || "";
    return (
      <div className="dir-card fade-in">
        <img src="/user_icon.png" alt={name} className="dir-card-img" />
        <div className="dir-card-body">
          <h3 className="dir-card-name">{name}</h3>
          <div className="dir-card-tags">
            <span className="dir-tag-role">{sectionLabel}</span>
          </div>
          {desc && <p className="dir-card-desc">{desc}</p>}
          <div className="dir-card-footer">
            <div className="dir-card-icons">
              {hasLinkedIn && <a href="#" onClick={e => e.preventDefault()} title="LinkedIn"><LinkedInIcon /></a>}
              {hasGithub   && <a href="#" onClick={e => e.preventDefault()} title="GitHub"><GithubIcon /></a>}
              {hasResume   && <a href="#" onClick={e => e.preventDefault()} title="Resume"><FileIcon /></a>}
            </div>
            <a href="#" className="dir-open-profile" onClick={e => e.preventDefault()}>
              Open Profile <ArrowRightIcon />
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ── Chat card ───────────────────────────────────── */
  return (
    <div className="result-card fade-in">
      <div className="result-card-header">
        <img src="/user_icon.png" alt={name} className="result-card-avatar" />
        <div className="result-card-meta">
          <div className="result-card-name-row">
            <span className="result-card-name">{name}</span>
            <div className="result-card-icons">
              {hasLinkedIn && <a href="#" onClick={e => e.preventDefault()} title="LinkedIn"><LinkedInIcon /></a>}
              {hasGithub   && <a href="#" onClick={e => e.preventDefault()} title="GitHub"><GithubIcon /></a>}
              {hasResume   && <a href="#" onClick={e => e.preventDefault()} title="Resume"><FileIcon /></a>}
            </div>
          </div>
          <p className="result-card-role">{sectionLabel}</p>
        </div>
      </div>

      {/* Profile summary — real data from Pinecone chunks */}
      {summaryText && (
        <div style={{ margin: "12px 0", padding: "0 2px" }}>
          <p className="result-card-section-label">Relevant Background</p>
          <p className="result-card-section-text">{summaryText}</p>
        </div>
      )}

      {/* Warm Intro — personalized from real data */}
      <div className="result-card-intro">
        <p className="result-card-section-label">Warm Intro</p>
        <p className="result-card-intro-text">&ldquo;{introText}&rdquo;</p>
        <button className="result-card-copy-btn" title={copied ? "Copied!" : "Copy intro"} onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
}
