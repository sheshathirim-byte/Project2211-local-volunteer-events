import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { VolunteerEvent, EventCategory, EventNeighborhood, EventShift } from '../types';
import { X, Plus, Trash2, Calendar, MapPin, Sparkles, Clock, Users } from 'lucide-react';
import riverCleanupImg from '../assets/images/river_cleanup_crew_1791181733312.jpg';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: EventCategory[] = [
  'Environmental',
  'Food Relief',
  'Youth & Education',
  'Senior Care',
  'Animal Welfare',
  'Urban Greening',
  'Community Aid',
];

const NEIGHBORHOODS: EventNeighborhood[] = [
  'Downtown Core',
  'Eastside Commons',
  'Riverbank Trail',
  'Pine Hills',
  'Harbor View',
  'Midtown West',
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { createEvent } = useVolunteer();

  // Basic Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Environmental');
  const [neighborhood, setNeighborhood] = useState<EventNeighborhood>('Riverbank Trail');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('2026-10-24');
  const [displayDateText, setDisplayDateText] = useState('Saturday, Oct 24, 2026');
  const [imageUrl, setImageUrl] = useState(riverCleanupImg);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [urgentNeedText, setUrgentNeedText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Requirements & Supplies
  const [requirementsInput, setRequirementsInput] = useState(
    'Sturdy closed-toe footwear\nRefillable water bottle\nAges 14+ or accompanied by adult'
  );
  const [suppliesInput, setSuppliesInput] = useState(
    'Work gloves & grabbers provided\nSafety vests\nMidday light refreshments & tea'
  );

  // Impact Goal
  const [metricLabel, setMetricLabel] = useState('Volunteer hours donated');
  const [metricTarget, setMetricTarget] = useState(50);
  const [metricUnit, setMetricUnit] = useState('hours');

  // Organizer details
  const [orgName, setOrgName] = useState('Clara Mendez');
  const [orgRole, setOrgRole] = useState('Community Coordinator');
  const [orgOrganization, setOrgOrganization] = useState('Haven Civic Action Group');
  const [orgEmail, setOrgEmail] = useState('clara@havencivic.org');
  const [orgPhone, setOrgPhone] = useState('(555) 789-2341');

  // Shifts state
  const [shifts, setShifts] = useState<EventShift[]>([
    {
      id: `shift-${Date.now()}-1`,
      title: 'Morning Setup & Initial Task Wave',
      startTime: '09:00',
      endTime: '12:00',
      date: '2026-10-24',
      capacity: 12,
      signedUpCount: 0,
      description: 'Initial site check, tool distribution, and primary community task.',
    },
    {
      id: `shift-${Date.now()}-2`,
      title: 'Afternoon Finalization & Cleanup',
      startTime: '12:30',
      endTime: '15:30',
      date: '2026-10-24',
      capacity: 10,
      signedUpCount: 0,
      description: 'Secondary wave, packing materials, and neighborhood debrief.',
    },
  ]);

  if (!isOpen) return null;

  const handleAddShift = () => {
    setShifts((prev) => [
      ...prev,
      {
        id: `shift-${Date.now()}-${prev.length + 1}`,
        title: `Shift ${prev.length + 1}: General Volunteer Support`,
        startTime: '10:00',
        endTime: '13:00',
        date,
        capacity: 10,
        signedUpCount: 0,
        description: 'Collaborative community volunteering session.',
      },
    ]);
  };

  const handleRemoveShift = (id: string) => {
    if (shifts.length <= 1) return;
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateShift = (id: string, field: keyof EventShift, value: any) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venueName.trim()) return;

    const requirements = requirementsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const providedSupplies = suppliesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    createEvent({
      title,
      category,
      neighborhood,
      venueName,
      address,
      date,
      displayDateText,
      imageUrl,
      summary: summary || description.slice(0, 140) + '...',
      description,
      requirements,
      providedSupplies,
      organizer: {
        name: orgName,
        role: orgRole,
        organization: orgOrganization,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        email: orgEmail,
        phone: orgPhone,
      },
      shifts,
      urgentNeedText: isUrgent ? urgentNeedText || 'Immediate volunteer hands needed' : undefined,
      isUrgent,
      impactMetric: {
        label: metricLabel,
        target: metricTarget,
        unit: metricUnit,
      },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-500 font-sans">
              Civic Action
            </div>
            <h3 className="font-serif text-xl font-medium text-stone-900 mt-0.5">
              Post a Volunteer Opportunity
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-7 flex-1">
          {/* General Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
              Initiative Overview
            </h4>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Westside River Trail Planting & Debris Clear"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Cause / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Neighborhood
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value as EventNeighborhood)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Riverbend Community Pavilion"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 500 River Way, North Pavilions"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Date (YYYY-MM-DD) *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setDisplayDateText(new Date(e.target.value).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
                  }}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Display Date Text
                </label>
                <input
                  type="text"
                  value={displayDateText}
                  onChange={(e) => setDisplayDateText(e.target.value)}
                  placeholder="e.g. Saturday, Oct 24, 2026"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Summary (One-line description) *
              </label>
              <input
                type="text"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Clear brief statement for event cards..."
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Full Description & Volunteer Tasks *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what the initiative accomplishes and what volunteers will be doing..."
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
              />
            </div>
          </div>

          {/* Shifts Section */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Volunteer Shifts & Capacities
                </h4>
                <p className="text-[11px] text-stone-500">
                  Define discrete time slots so volunteers can choose their availability.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddShift}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Shift</span>
              </button>
            </div>

            <div className="space-y-3">
              {shifts.map((shift, idx) => (
                <div
                  key={shift.id}
                  className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={shift.title}
                      onChange={(e) => handleUpdateShift(shift.id, 'title', e.target.value)}
                      placeholder="Shift Title"
                      className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                    {shifts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveShift(shift.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                        title="Delete shift"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Start Time</label>
                      <input
                        type="text"
                        value={shift.startTime}
                        onChange={(e) => handleUpdateShift(shift.id, 'startTime', e.target.value)}
                        placeholder="09:00"
                        className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">End Time</label>
                      <input
                        type="text"
                        value={shift.endTime}
                        onChange={(e) => handleUpdateShift(shift.id, 'endTime', e.target.value)}
                        placeholder="12:00"
                        className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 mb-0.5">Capacity (Volunteers)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={shift.capacity}
                        onChange={(e) => handleUpdateShift(shift.id, 'capacity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements & Supplies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Volunteer Requirements (one per line)
              </label>
              <textarea
                rows={3}
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Supplies & Refreshments Provided (one per line)
              </label>
              <textarea
                rows={3}
                value={suppliesInput}
                onChange={(e) => setSuppliesInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Urgent Need Flag */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-3">
            <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500"
              />
              <span className="font-semibold text-amber-950">
                Flag this event as an Urgent Community Need
              </span>
            </label>
            {isUrgent && (
              <input
                type="text"
                value={urgentNeedText}
                onChange={(e) => setUrgentNeedText(e.target.value)}
                placeholder="e.g. Critical: Short 6 volunteers for Saturday morning riverbank planting"
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Publish Volunteer Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
