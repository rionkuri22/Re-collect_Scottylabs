"use client";

import React, { useState, useEffect } from "react";
import ProfileCard from "@/components/ProfileCard";

function SpinnerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c41230" strokeWidth="2" className="spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export default function SearchPage() {
  const [people, setPeople] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchPeople(q = "") {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPeople(Array.isArray(data) ? data : []);
    } catch {
      console.error("Failed to perform search.");
      setPeople([]);
    }
    setLoading(false);
  }

  useEffect(() => { fetchPeople(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchPeople(query);
  }

  return (
    <div className="search-page">
      {/* Hero */}
      <div className="search-hero">
        <h1 className="search-hero-title">Semantic Directory</h1>
        <p className="search-hero-sub">Discover collaborators across the TartanHacks community</p>
      </div>

      {/* Search box */}
      <div className="search-box-wrap">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            className="search-box-input"
            placeholder="Search by name, expertise (e.g., 'ML'), or affiliation (e.g., 'Robotics Institute')..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="search-box-btn">Search</button>
        </form>
      </div>

      {/* Popular filters */}
      <div className="search-filters">
        <span className="search-filters-label">Popular Filters:</span>
        <button className="search-filter-pill" onClick={() => { setQuery("School of Computer Science"); fetchPeople("School of Computer Science"); }}>School of Computer Science</button>
        <button className="search-filter-pill" onClick={() => { setQuery("Tepper School of Business"); fetchPeople("Tepper School of Business"); }}>Tepper School of Business</button>
        <button className="search-filter-pill" onClick={() => { setQuery("Engineering"); fetchPeople("Engineering"); }}>Engineering</button>
      </div>

      {/* Results */}
      <div className="search-results">
        {loading ? (
          <div className="search-loading"><SpinnerIcon /></div>
        ) : people.length > 0 ? (
          people.map((p, i) => <ProfileCard key={i} person={p} variant="directory" />)
        ) : (
          <div className="search-empty">No one found matching your query.</div>
        )}
      </div>
    </div>
  );
}
