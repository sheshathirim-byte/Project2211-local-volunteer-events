import React, { useState } from 'react';
import { VolunteerEvent, EventShift } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  ShieldCheck,
  Package,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface EventDetailModalProps {
  event: VolunteerEvent | null;
  onClose: () => void;
  onSelectShift: (event: VolunteerEvent, shift: EventShift) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onSelectShift,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!event) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const totalCapacity = event.shifts.reduce((sum, s) => sum + s.capacity, 0);
  const totalSignedUp = event.shifts.reduce((sum, s) => sum + s.signedUpCount, 0);
  const totalOpenSpots = Math.max(0, totalCapacity - totalSignedUp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header Ribbon / Image Hero */}
        <div className="relative aspect-[16/8] sm:aspect-[21/9] bg-stone-200 shrink-0">
          <img
            src={event.imageUrl}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

          {/* Close & Share buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Share event link"
              className="p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 backdrop-blur-md transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close modal"
              className="p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {copiedLink && (
            <div className="absolute top-14 right-3 bg-stone-900 text-white text-xs px-2.5 py-1 rounded shadow">
              Link copied!
            </div>
          )}

          {/* Overlay titles */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-300">
              <span>{event.category}</span>
              <span aria-hidden="true">·</span>
              <span>{event.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span>{event.displayDateText}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium leading-tight text-white">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Urgent Note if applicable */}
          {event.urgentNeedText && (
            <div className="flex items-center gap-2.5 p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="flex-1 font-medium">{event.urgentNeedText}</div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-stone-200/80 text-stone-800">
            <div>
              <div className="text-xs text-stone-500 font-sans">Total Shifts</div>
              <div className="text-lg font-serif font-medium text-stone-900 mt-0.5">
                {event.shifts.length} Slots
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-sans">Open Positions</div>
              <div className="text-lg font-serif font-medium text-stone-900 font-mono tabular-nums mt-0.5">
                {totalOpenSpots} spots
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-sans">Community Goal</div>
              <div className="text-lg font-serif font-medium text-stone-900 font-mono tabular-nums mt-0.5">
                {event.impactMetric.target} {event.impactMetric.unit}
              </div>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-sans">Venue</div>
              <div className="text-sm font-medium text-stone-900 truncate mt-1">
                {event.venueName}
              </div>
            </div>
          </div>

          {/* Narrative Overview */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-stone-900">About this Initiative</h3>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-prose">
              {event.description}
            </p>
          </div>

          {/* Shifts Section - Core Sign-up target */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-900">Available Volunteer Shifts</h3>
                <p className="text-xs text-stone-500">Choose a time slot to sign up and receive reminders.</p>
              </div>
              <span className="text-xs font-mono tabular-nums text-stone-600 bg-stone-100 px-2.5 py-1 rounded">
                {totalSignedUp} / {totalCapacity} Volunteers Enrolled
              </span>
            </div>

            <div className="space-y-3">
              {event.shifts.map((shift) => {
                const shiftOpen = Math.max(0, shift.capacity - shift.signedUpCount);
                const isFull = shiftOpen === 0;

                return (
                  <div
                    key={shift.id}
                    className="p-4 bg-white rounded-xl border border-stone-200/90 hover:border-stone-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-700" />
                        <span className="font-mono tabular-nums text-stone-900">
                          {shift.startTime} – {shift.endTime}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{shift.date}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-medium text-stone-900">
                        {shift.title}
                      </h4>
                      {shift.description && (
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {shift.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span
                          className={`font-mono tabular-nums font-medium ${
                            isFull ? 'text-stone-500' : 'text-stone-800'
                          }`}
                        >
                          {isFull
                            ? 'All spots filled (Waitlist available)'
                            : `${shiftOpen} of ${shift.capacity} spots open`}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => onSelectShift(event, shift)}
                        className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                          isFull
                            ? 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-300'
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                      >
                        <span>{isFull ? 'Join Waitlist' : 'Select Shift'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requirements & Provided Gear (2 Cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-700" />
                <span>What to Bring & Requirements</span>
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                {event.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-stone-700" />
                <span>Supplies & Gear Provided</span>
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                {event.providedSupplies.map((supp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-700 mt-0.5 shrink-0" />
                    <span>{supp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Location Details & Directions Hint */}
          <div className="p-4 bg-white rounded-xl border border-stone-200/90 space-y-3">
            <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-700" />
              <span>Location & Gathering Coordinates</span>
            </h3>
            <div className="text-xs text-stone-600 space-y-1">
              <div className="font-medium text-stone-900">{event.venueName}</div>
              <div>{event.address}</div>
              <div className="text-stone-500 italic pt-1">
                Directions: Main volunteer check-in kiosk is located near the central entrance. Free volunteer parking permitted in visitor stalls.
              </div>
            </div>
          </div>

          {/* Organizer Lockup */}
          <div className="p-4 bg-[#F2EFE9] rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={event.organizer.avatarUrl}
                alt={event.organizer.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-stone-300"
              />
              <div>
                <div className="text-xs text-stone-500">Event Coordinator</div>
                <div className="text-sm font-semibold text-stone-900">
                  {event.organizer.name}
                </div>
                <div className="text-xs text-stone-600">
                  {event.organizer.role} · {event.organizer.organization}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <a
                href={`mailto:${event.organizer.email}`}
                className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                title={`Email ${event.organizer.name}`}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`tel:${event.organizer.phone}`}
                className="p-2 bg-white rounded-lg border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                title={`Call ${event.organizer.phone}`}
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Have questions? Contact organizer {event.organizer.name}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
