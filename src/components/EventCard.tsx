import React, { useState } from 'react';
import { VolunteerEvent, EventShift } from '../types';
import { MapPin, Clock, Users, ArrowUpRight, AlertCircle, Calendar } from 'lucide-react';

interface EventCardProps {
  event: VolunteerEvent;
  onSelectEvent: (event: VolunteerEvent) => void;
  onQuickSignUp: (event: VolunteerEvent, shift: EventShift) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelectEvent,
  onQuickSignUp,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Total capacity and signed up calculations
  const totalCapacity = event.shifts.reduce((sum, s) => sum + s.capacity, 0);
  const totalSignedUp = event.shifts.reduce((sum, s) => sum + s.signedUpCount, 0);
  const spotsRemaining = Math.max(0, totalCapacity - totalSignedUp);
  const percentFilled = Math.min(100, Math.round((totalSignedUp / totalCapacity) * 100));

  // Find the first shift with an open spot, or the first shift overall
  const nextAvailableShift =
    event.shifts.find((s) => s.signedUpCount < s.capacity) || event.shifts[0];

  return (
    <article className="group bg-white rounded-xl border border-stone-200/90 hover:border-stone-400/80 transition-all duration-200 flex flex-col h-full overflow-hidden hover:shadow-md">
      {/* Visual Slot */}
      <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelectEvent(event)}>
        {!imgFailed ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-100 text-stone-500">
            <span className="font-serif text-lg text-stone-700">{event.venueName}</span>
            <span className="text-xs text-stone-400 mt-1">{event.category}</span>
          </div>
        )}

        {/* Scrim with date & neighborhood */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent flex items-end justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate max-w-[200px]">{event.venueName}</span>
          </div>
          <span className="shrink-0 text-stone-300 font-mono tabular-nums">
            {event.neighborhood}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Zero-Pill Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500 font-medium">
            <span className="text-stone-700">{event.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{event.displayDateText}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="font-mono tabular-nums">
              {spotsRemaining > 0 ? `${spotsRemaining} spots open` : 'Waitlist only'}
            </span>
          </div>

          {/* Event Title */}
          <h2
            onClick={() => onSelectEvent(event)}
            className="text-lg sm:text-xl font-serif font-medium text-stone-900 group-hover:text-amber-900 transition-colors cursor-pointer leading-snug line-clamp-2"
          >
            {event.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {event.summary}
          </p>

          {/* Urgent callout notice if active */}
          {event.urgentNeedText && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50/80 border-l-2 border-amber-600 text-stone-800 text-xs rounded-r">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span className="font-medium text-amber-950">{event.urgentNeedText}</span>
            </div>
          )}
        </div>

        {/* Shifts & Capacity Footer */}
        <div className="pt-4 mt-4 border-t border-stone-100 space-y-3">
          {/* Capacity Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-sans">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{event.shifts.length} shift options</span>
              </span>
              <span className="font-mono tabular-nums">
                {totalSignedUp} / {totalCapacity} filled ({percentFilled}%)
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentFilled >= 100
                    ? 'bg-stone-500'
                    : percentFilled >= 75
                    ? 'bg-amber-600'
                    : 'bg-stone-800'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onSelectEvent(event)}
              className="flex-1 py-2 px-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center"
            >
              View Full Details
            </button>

            {nextAvailableShift && (
              <button
                onClick={() => onQuickSignUp(event, nextAvailableShift)}
                className="py-2 px-3.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
              >
                <span>Sign Up</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
