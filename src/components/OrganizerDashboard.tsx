import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { VolunteerEvent, EventShift, VolunteerRegistration } from '../types';
import { BroadcastModal } from './BroadcastModal';
import {
  Users,
  CheckCircle2,
  XCircle,
  Download,
  Send,
  Plus,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react';

interface OrganizerDashboardProps {
  onOpenCreateModal: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ onOpenCreateModal }) => {
  const { events, registrations, updateVolunteerRosterStatus } = useVolunteer();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('all');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // All registrations for this event
  const eventRegistrations = registrations.filter(
    (r) => r.eventId === currentEvent?.id && r.status !== 'cancelled'
  );

  // Filtered registrations
  const displayedRegistrations = eventRegistrations.filter((r) => {
    if (selectedShiftFilter === 'all') return true;
    return r.shiftId === selectedShiftFilter;
  });

  const checkedInCount = eventRegistrations.filter((r) => r.status === 'checked_in').length;
  const noShowCount = eventRegistrations.filter((r) => r.status === 'no_show').length;
  const pendingCount = eventRegistrations.filter((r) => r.status === 'confirmed').length;

  const handleExportCsv = () => {
    if (!currentEvent) return;

    const headers = [
      'Volunteer Name',
      'Email',
      'Phone',
      'Shift',
      'Status',
      'Registered At',
      'Emergency Contact',
      'Special Notes',
    ];

    const rows = eventRegistrations.map((r) => [
      `"${r.volunteerName}"`,
      `"${r.volunteerEmail}"`,
      `"${r.volunteerPhone}"`,
      `"${r.shiftTitle}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
      `"${r.emergencyContact}"`,
      `"${r.dietaryOrAccessNotes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roster-${currentEvent.id}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentEvent) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h3 className="font-serif text-xl font-medium text-stone-900">No events found</h3>
        <button
          onClick={onOpenCreateModal}
          className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium"
        >
          Create First Event
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
            <span>Coordinator Console</span>
            <span aria-hidden="true">·</span>
            <span>Check-in & Roster</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mt-1">
            Event Management & Attendance Roster
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Coordinate shifts, track volunteer check-ins in real-time, export rosters, and broadcast notifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 text-amber-800" />
            <span>Broadcast Alert</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Event Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {events.map((evt) => (
          <button
            key={evt.id}
            onClick={() => {
              setSelectedEventId(evt.id);
              setSelectedShiftFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all text-left shrink-0 cursor-pointer border ${
              selectedEventId === evt.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <div className="truncate max-w-[240px] font-medium">{evt.title}</div>
            <div className={`text-[11px] truncate mt-0.5 ${selectedEventId === evt.id ? 'text-stone-300' : 'text-stone-500'}`}>
              {evt.displayDateText} · {evt.neighborhood}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Event Summary Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <span>{currentEvent.category}</span>
              <span aria-hidden="true">·</span>
              <span>{currentEvent.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span>{currentEvent.venueName}</span>
            </div>
            <h3 className="text-xl font-serif font-medium text-stone-900">
              {currentEvent.title}
            </h3>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <div>
              <div className="text-stone-400 font-sans">Checked In</div>
              <div className="text-base font-semibold font-mono tabular-nums text-emerald-700">
                {checkedInCount}
              </div>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div>
              <div className="text-stone-400 font-sans">Pending</div>
              <div className="text-base font-semibold font-mono tabular-nums text-stone-800">
                {pendingCount}
              </div>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div>
              <div className="text-stone-400 font-sans">No Shows</div>
              <div className="text-base font-semibold font-mono tabular-nums text-stone-500">
                {noShowCount}
              </div>
            </div>
          </div>
        </div>

        {/* Shift Filter Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 overflow-x-auto text-xs">
          <span className="font-medium text-stone-600 shrink-0">Filter by Shift:</span>
          <button
            onClick={() => setSelectedShiftFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedShiftFilter === 'all'
                ? 'bg-stone-900 text-white font-medium'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Shifts ({eventRegistrations.length})
          </button>
          {currentEvent.shifts.map((s) => {
            const shiftCount = eventRegistrations.filter((r) => r.shiftId === s.id).length;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedShiftFilter(s.id)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
                  selectedShiftFilter === s.id
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {s.title.split(':')[0]} ({shiftCount}/{s.capacity})
              </button>
            );
          })}
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-stone-700" />
            <span className="text-sm font-semibold text-stone-900">
              Registered Volunteers ({displayedRegistrations.length})
            </span>
          </div>
          <span className="text-xs text-stone-500 font-mono tabular-nums">
            Capacity: {currentEvent.shifts.reduce((sum, s) => sum + s.signedUpCount, 0)} /{' '}
            {currentEvent.shifts.reduce((sum, s) => sum + s.capacity, 0)} spots enrolled
          </span>
        </div>

        {displayedRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-medium">Volunteer</th>
                  <th className="py-3 px-4 font-medium">Shift & Time</th>
                  <th className="py-3 px-4 font-medium">Contact & Emergency</th>
                  <th className="py-3 px-4 font-medium">Notes</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {displayedRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Volunteer Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{reg.volunteerName}</div>
                      <div className="text-[11px] text-stone-400 font-mono tabular-nums">
                        Registered {new Date(reg.registeredAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Shift & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-800">{reg.shiftTitle}</div>
                      <div className="text-stone-500 font-mono tabular-nums text-[11px]">
                        {reg.eventTime}
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div>{reg.volunteerEmail}</div>
                      <div className="text-stone-500 font-mono tabular-nums">{reg.volunteerPhone}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-[180px]">
                        ICE: {reg.emergencyContact}
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4">
                      {reg.dietaryOrAccessNotes ? (
                        <span className="text-stone-700 italic max-w-[150px] inline-block truncate">
                          {reg.dietaryOrAccessNotes}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-medium capitalize ${
                          reg.status === 'checked_in'
                            ? 'text-emerald-700'
                            : reg.status === 'no_show'
                            ? 'text-stone-400 line-through'
                            : 'text-stone-800'
                        }`}
                      >
                        {reg.status === 'checked_in' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {reg.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {reg.status !== 'checked_in' ? (
                          <button
                            onClick={() =>
                              updateVolunteerRosterStatus(
                                reg.eventId,
                                reg.shiftId,
                                reg.id,
                                'checked_in'
                              )
                            }
                            className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium transition-colors cursor-pointer"
                          >
                            Check In
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateVolunteerRosterStatus(
                                reg.eventId,
                                reg.shiftId,
                                reg.id,
                                'confirmed'
                              )
                            }
                            title="Undo check in"
                            className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}

                        {reg.status !== 'no_show' && (
                          <button
                            onClick={() =>
                              updateVolunteerRosterStatus(
                                reg.eventId,
                                reg.shiftId,
                                reg.id,
                                'no_show'
                              )
                            }
                            className="px-2 py-1 rounded text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            No Show
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-stone-500">
            No volunteer registrations recorded for this shift yet.
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          event={currentEvent}
          onClose={() => setShowBroadcastModal(false)}
        />
      )}
    </div>
  );
};
