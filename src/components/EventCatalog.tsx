import React, { useState, useMemo } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { VolunteerEvent, EventCategory, EventNeighborhood, EventShift } from '../types';
import { EventCard } from './EventCard';
import { Search, Filter, SlidersHorizontal, AlertCircle, X, Sparkles, MapPin } from 'lucide-react';

interface EventCatalogProps {
  onSelectEvent: (event: VolunteerEvent) => void;
  onQuickSignUp: (event: VolunteerEvent, shift: EventShift) => void;
  urgentOnlyProp?: boolean;
}

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Environmental',
  'Food Relief',
  'Youth & Education',
  'Senior Care',
  'Animal Welfare',
  'Urban Greening',
];

const NEIGHBORHOODS: ('All' | EventNeighborhood)[] = [
  'All',
  'Downtown Core',
  'Eastside Commons',
  'Riverbank Trail',
  'Pine Hills',
  'Harbor View',
  'Midtown West',
];

export const EventCatalog: React.FC<EventCatalogProps> = ({
  onSelectEvent,
  onQuickSignUp,
  urgentOnlyProp = false,
}) => {
  const { events } = useVolunteer();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<'All' | EventNeighborhood>('All');
  const [urgentOnly, setUrgentOnly] = useState(urgentOnlyProp);
  const [sortBy, setSortBy] = useState<'date' | 'spots' | 'urgency'>('date');

  // Filtered & sorted events
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = evt.title.toLowerCase().includes(q);
          const matchesSummary = evt.summary.toLowerCase().includes(q);
          const matchesVenue = evt.venueName.toLowerCase().includes(q);
          const matchesAddress = evt.address.toLowerCase().includes(q);
          const matchesOrganizer = evt.organizer.name.toLowerCase().includes(q);
          if (!matchesTitle && !matchesSummary && !matchesVenue && !matchesAddress && !matchesOrganizer) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
          return false;
        }

        // Neighborhood filter
        if (selectedNeighborhood !== 'All' && evt.neighborhood !== selectedNeighborhood) {
          return false;
        }

        // Urgent filter
        if (urgentOnly && !evt.isUrgent) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
        }
        if (sortBy === 'spots') {
          const aSpots = a.shifts.reduce((sum, s) => sum + Math.max(0, s.capacity - s.signedUpCount), 0);
          const bSpots = b.shifts.reduce((sum, s) => sum + Math.max(0, s.capacity - s.signedUpCount), 0);
          return bSpots - aSpots;
        }
        // Default sort by date
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [events, searchQuery, selectedCategory, selectedNeighborhood, urgentOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedNeighborhood('All');
    setUrgentOnly(false);
    setSortBy('date');
  };

  return (
    <div id="event-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search & Main Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search initiatives, venues, neighborhoods, or keywords..."
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200 rounded-lg text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Neighborhood select */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value as any)}
                className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Neighborhoods</option>
                {NEIGHBORHOODS.filter((n) => n !== 'All').map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order select */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="date">Date: Soonest First</option>
                <option value="spots">Most Spots Open</option>
                <option value="urgency">Urgent Needs First</option>
              </select>
            </div>

            {/* Urgent toggle button */}
            <button
              onClick={() => setUrgentOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                urgentOnly
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <AlertCircle className={`w-3.5 h-3.5 ${urgentOnly ? 'text-amber-700' : 'text-stone-400'}`} />
              <span>Urgent Needs Only</span>
            </button>
          </div>
        </div>

        {/* Functional Category Filter Segmented Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Header & Count */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-serif font-medium text-stone-900">
            Available Community Gatherings
          </h2>
          <span className="text-xs text-stone-500 font-mono tabular-nums">
            ({filteredEvents.length} {filteredEvents.length === 1 ? 'initiative' : 'initiatives'})
          </span>
        </div>

        {(searchQuery || selectedCategory !== 'All' || selectedNeighborhood !== 'All' || urgentOnly) && (
          <button
            onClick={resetFilters}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Grid of Events */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelectEvent={onSelectEvent}
              onQuickSignUp={onQuickSignUp}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-xl border border-stone-200/90 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-medium text-stone-900">
              No matching volunteer events found
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              We couldn't find any initiatives matching your current search or category criteria.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
