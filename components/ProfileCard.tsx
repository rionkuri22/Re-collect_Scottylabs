"use client";

import React from 'react';
import { Linkedin, FileText, ExternalLink, Github, Globe, Youtube, Instagram } from 'lucide-react';

interface ProfileCardProps {
  person: any;
}

export default function ProfileCard({ person }: ProfileCardProps) {
  // Extract source icons based on metadata or person data
  const source = person.metadata?.source || person.source;
  const name = person.name || person.metadata?.owner;
  
  // Dummy data for sources since I don't have the full JSON in the card metadata usually
  // In a real app, you'd fetch the person's full profile or have it in metadata.
  // For this MVP, I'll show some icons based on what was seen in Rion's JSON.
  
  const renderSourceIcons = () => {
    const icons = [];
    if (source === 'linkedin' || name === 'Rion Kurihara') {
        icons.push(<Linkedin key="li" size={18} className="text-blue-400 cursor-pointer hover:scale-110 transition-transform" />);
    }
    if (source === 'github' || name === 'Rion Kurihara') {
        icons.push(<Github key="gh" size={18} className="text-gray-300 cursor-pointer hover:scale-110 transition-transform" />);
    }
    if (source === 'resume_json' || name === 'Rion Kurihara') {
        icons.push(<FileText key="res" size={18} className="text-scotty-red cursor-pointer hover:scale-110 transition-transform" />);
    }
    return icons;
  };

  return (
    <div className="card profile-card fade-in">
      <div className="profile-header">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
          {name?.[0]}
        </div>
        <div className="profile-info">
          <h3 className="font-bold">{name}</h3>
          <p className="text-xs text-text-secondary">{person.metadata?.section || 'Member'}</p>
        </div>
      </div>

      <p className="text-sm text-gray-300 line-clamp-3">
        {person.metadata?.text || person.text || "No details available."}
      </p>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-800">
        <div className="source-icons">
          {renderSourceIcons()}
        </div>
        
        <button className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
          Open Profile <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}
