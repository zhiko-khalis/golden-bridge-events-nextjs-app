'use client';

import { useState } from 'react';
import { Concert } from '../types/concert';
import { concerts } from '../data/concerts';
import { ConcertCard } from './ConcertCard';
import { Input } from './ui/input';
import { Search, Music } from 'lucide-react';
import { Badge } from './ui/badge';

interface ConcertBrowserProps {
  onSelectConcert: (concert: Concert) => void;
}

export function ConcertBrowser({ onSelectConcert }: ConcertBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', ...Array.from(new Set(concerts.map(c => c.genre)))];

  const filteredConcerts = concerts.filter(concert => {
    const matchesSearch = 
      concert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concert.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === 'All' || concert.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative py-8 md:py-4 px-4 bg-black text-white">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-12">
            {/* Text Content */}
            <div className="flex-1 w-full md:w-auto order-2 md:order-1">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-8 h-8 md:w-10 md:h-10 text-white" />
                <h1 className="text-2xl md:text-4xl lg:text-5xl">Golden Bridge Events</h1>
              </div>
              <p className="text-base md:text-xl text-white/70 mb-6 md:mb-8">
                Discover and book tickets for the best live music events
              </p>
              
              {/* Search Bar */}
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                <Input
                  placeholder="Search concerts, artists, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-black"
                />
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 w-full md:w-auto flex items-center justify-center md:justify-end md:items-center order-1 md:order-2">
              <img 
                src="/GOLDEN BRIDGE OFFICIAL LOGO.svg" 
                alt="Golden Bridge Events Logo"
                className="w-full max-w-[200px] md:max-w-[250px] lg:max-w-[300px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Genre Filters */}
        <div className="mb-8">
          <h3 className="mb-4">Filter by Genre</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <Badge
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 hover:bg-primary/20 transition-colors"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Concert Grid */}
        {filteredConcerts.length > 0 ? (
          <>
            <h2 className="mb-6">
              {searchTerm || selectedGenre !== 'All' 
                ? `${filteredConcerts.length} Concert${filteredConcerts.length !== 1 ? 's' : ''} Found`
                : 'Upcoming Concerts'
              }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConcerts.map(concert => (
                <ConcertCard 
                  key={concert.id} 
                  concert={concert}
                  onSelect={onSelectConcert}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No concerts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
