"use client";

import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';

export default function SearchPage() {
  const [people, setPeople] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPeople = async (searchTerm = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPeople(query);
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-2">Community Directory</h1>
        <p className="text-text-secondary mb-6">Semantic search across the ScottyLabs network.</p>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="input-bar pl-12"
            placeholder="Search by name, major, or keyword (e.g. ML, Design)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-accent" />
          </div>
        ) : people.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person, i) => (
              <ProfileCard key={i} person={person} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card-bg rounded-3xl border border-dashed border-border">
            <p className="text-text-secondary">No one found matching your query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
