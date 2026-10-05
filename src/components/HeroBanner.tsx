import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { ArrowRight, Sparkles, MapPin, AlertCircle, HeartHandshake } from 'lucide-react';
import heroGardenImg from '../assets/images/hero_community_garden_1791181707504.jpg';

interface HeroBannerProps {
  onFilterUrgent: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onFilterUrgent }) => {
  const { events, registrations } = useVolunteer();
  const [imageError, setImageError] = useState(false);

  // Compute live statistics
  const totalOpenSlots = events.reduce(
    (total, evt) =>
      total +
      evt.shifts.reduce((sum, shift) => sum + Math.max(0, shift.capacity - shift.signedUpCount), 0),
    0
  );

  const urgentEventsCount = events.filter((e) => e.isUrgent).length;
  const userConfirmedShifts = registrations.filter((r) => r.status === 'confirmed').length;

  return (
    <section className="relative border-b border-stone-200 bg-[#F5F2EB]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Headline Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
              <span>Civic Action</span>
              <span aria-hidden="true">·</span>
              <span>Neighbourhood Co-op</span>
              <span aria-hidden="true">·</span>
              <span>Season 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-stone-900 leading-[1.18] tracking-tight">
              Local hands, shared land, and direct community care.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-sans leading-relaxed max-w-2xl">
              Connect directly with neighborhood food rescues, watershed restorations, and library circles. Sign up for specific shifts, get real-time weather and organizer updates, and track community impact without friction.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#event-catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm"
              >
                <span>Browse Local Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {urgentEventsCount > 0 && (
                <button
                  onClick={onFilterUrgent}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-900 bg-amber-100/70 hover:bg-amber-100 rounded-lg border border-amber-200/60 transition-colors cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>{urgentEventsCount} Shifts Need Immediate Hands</span>
                </button>
              )}
            </div>

            {/* Operational Utility Ribbon - Zero pills */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-stone-800">
              <div>
                <div className="text-2xl font-serif tabular-nums font-medium text-stone-900">
                  {events.length}
                </div>
                <div className="text-xs text-stone-500 font-sans mt-0.5">
                  Active Projects
                </div>
              </div>

              <div>
                <div className="text-2xl font-serif tabular-nums font-medium text-stone-900">
                  {totalOpenSlots}
                </div>
                <div className="text-xs text-stone-500 font-sans mt-0.5">
                  Open Volunteer Spots
                </div>
              </div>

              <div>
                <div className="text-2xl font-serif tabular-nums font-medium text-stone-900">
                  100%
                </div>
                <div className="text-xs text-stone-500 font-sans mt-0.5">
                  Direct Grassroots
                </div>
              </div>
            </div>
          </div>

          {/* Focal Image Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/60 bg-stone-200 aspect-[16/10] sm:aspect-[4/3]">
              {!imageError ? (
                <img
                  src={heroGardenImg}
                  alt="Volunteers tending community urban farm beds"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 text-stone-100 p-6 flex flex-col justify-end">
                  <HeartHandshake className="w-10 h-10 text-amber-400 mb-3" />
                  <div className="font-serif text-xl font-medium">Highland Urban Farm & Allotments</div>
                  <div className="text-xs text-stone-400 mt-1">Eastside Community Garden Shift · Oct 10</div>
                </div>
              )}

              {/* Scrim caption */}
              <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent text-white">
                <p className="text-xs font-serif italic text-stone-200">
                  Fig 1. Community harvest and seedbed wintering at Highland Urban Allotments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
