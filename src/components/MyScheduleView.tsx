import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { VolunteerRegistration, VolunteerEvent, EventShift } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bell,
  Heart,
} from 'lucide-react';

interface MyScheduleViewProps {
  onSelectEvent: (event: VolunteerEvent) => void;
}

export const MyScheduleView: React.FC<MyScheduleViewProps> = ({ onSelectEvent }) => {
  const {
    registrations,
    events,
    cancelRegistration,
    exportShiftToCalendar,
    setActiveTab,
  } = useVolunteer();

  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const activeRegistrations = registrations.filter((r) => r.status !== 'cancelled');

  // Compute total committed hours (approx 3 hours per shift)
  const totalHours = activeRegistrations.length * 3;

  const handleCancelClick = (regId: string) => {
    cancelRegistration(regId);
    setConfirmCancelId(null);
  };

  const getEventForRegistration = (eventId: string): VolunteerEvent | undefined => {
    return events.find((e) => e.id === eventId);
  };

  const getShiftForRegistration = (event: VolunteerEvent, shiftId: string): EventShift | undefined => {
    return event.shifts.find((s) => s.id === shiftId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
          <span>Personal Ledger</span>
          <span aria-hidden="true">·</span>
          <span>Community Hours</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mt-1">
          My Volunteer Schedule & Impact
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Review your upcoming shifts, download calendar invites, verify alert settings, or manage cancellations.
        </p>
      </div>

      {/* Impact Overview Stats Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
        <div>
          <div className="text-xs text-stone-500 font-sans">Confirmed Shifts</div>
          <div className="text-2xl font-serif font-medium text-stone-900 tabular-nums mt-0.5">
            {activeRegistrations.length}
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-500 font-sans">Estimated Hours</div>
          <div className="text-2xl font-serif font-medium text-stone-900 tabular-nums mt-0.5">
            {totalHours} hrs
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-500 font-sans">Roster Status</div>
          <div className="text-sm font-medium text-emerald-800 flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Good Standing</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-stone-500 font-sans">Notification Sync</div>
          <div className="text-sm font-medium text-stone-800 flex items-center gap-1.5 mt-2">
            <Bell className="w-4 h-4 text-stone-600" />
            <span>Active & Automated</span>
          </div>
        </div>
      </div>

      {/* Shifts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium text-stone-900">
            Upcoming Enrolled Gatherings ({activeRegistrations.length})
          </h3>
          {activeRegistrations.length > 0 && (
            <span className="text-xs text-stone-500">
              Reminder notices dispatch automatically 24h & 2h before each start time.
            </span>
          )}
        </div>

        {activeRegistrations.length > 0 ? (
          <div className="space-y-4">
            {activeRegistrations.map((reg) => {
              const matchedEvent = getEventForRegistration(reg.eventId);
              const matchedShift = matchedEvent
                ? getShiftForRegistration(matchedEvent, reg.shiftId)
                : undefined;

              return (
                <div
                  key={reg.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 transition-all hover:border-stone-400 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {/* Unboxed metadata line */}
                      <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500 font-sans">
                        <span className="font-mono tabular-nums text-stone-900 font-medium">
                          {reg.eventDate}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{reg.eventTime}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`capitalize font-medium ${
                            reg.status === 'confirmed'
                              ? 'text-emerald-700'
                              : reg.status === 'checked_in'
                              ? 'text-blue-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {reg.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-medium text-stone-900 leading-snug">
                        {reg.eventTitle}
                      </h4>

                      <div className="text-xs sm:text-sm text-stone-700 font-medium">
                        {reg.shiftTitle}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{reg.eventLocation}</span>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      {matchedEvent && matchedShift && (
                        <button
                          onClick={() => exportShiftToCalendar(matchedEvent, matchedShift)}
                          className="px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          title="Export standard .ics calendar invite"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-stone-600" />
                          <span>Add to Calendar</span>
                        </button>
                      )}

                      {matchedEvent && (
                        <button
                          onClick={() => onSelectEvent(matchedEvent)}
                          className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      )}

                      <button
                        onClick={() => setConfirmCancelId(reg.id)}
                        className="px-2 py-1 text-xs text-stone-400 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Cancel Shift</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Notification Channels on this Shift */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-stone-700">Alerts:</span>
                      <span>Email ({reg.volunteerEmail})</span>
                      {reg.notificationPreferences.sms && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>SMS ({reg.volunteerPhone})</span>
                        </>
                      )}
                      {reg.notificationPreferences.browserPush && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Push Active</span>
                        </>
                      )}
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(reg.eventLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-700 hover:text-stone-950 font-medium inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Cancellation Confirmation Bar */}
                  {confirmCancelId === reg.id && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-950">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                        <span>
                          Are you sure you want to release this spot? Another volunteer will be able to enroll.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <button
                          onClick={() => setConfirmCancelId(null)}
                          className="px-2.5 py-1 rounded bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 cursor-pointer"
                        >
                          Keep Spot
                        </button>
                        <button
                          onClick={() => handleCancelClick(reg.id)}
                          className="px-2.5 py-1 rounded bg-red-700 text-white hover:bg-red-800 cursor-pointer font-medium"
                        >
                          Release Spot
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-medium text-stone-900">
                No active volunteer shifts scheduled
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Join a neighborhood garden, food recovery run, or tree planting effort to start building community hours.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-5 py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Browse Open Opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
