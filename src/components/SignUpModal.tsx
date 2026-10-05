import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { VolunteerEvent, EventShift } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Bell,
  Mail,
  Smartphone,
  CalendarPlus,
  Shield,
  ArrowRight,
  Info,
} from 'lucide-react';

interface SignUpModalProps {
  data: {
    event: VolunteerEvent;
    shift: EventShift;
  } | null;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ data, onClose }) => {
  const { signUpForEvent, userPreferences, exportShiftToCalendar, setActiveTab } = useVolunteer();

  // Form State
  const [name, setName] = useState(userPreferences.volunteerName || 'Alex Mercer');
  const [email, setEmail] = useState(userPreferences.volunteerEmail || 'alex.mercer@gmail.com');
  const [phone, setPhone] = useState(userPreferences.volunteerPhone || '(555) 492-8172');
  const [emergencyContact, setEmergencyContact] = useState('Maya Mercer (555) 492-8173');
  const [notes, setNotes] = useState('');

  // Notification Preferences
  const [emailPref, setEmailPref] = useState(true);
  const [smsPref, setSmsPref] = useState(true);
  const [pushPref, setPushPref] = useState(userPreferences.enableBrowserPush);
  const [remind24h, setRemind24h] = useState(true);
  const [remind2h, setRemind2h] = useState(true);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!data) return null;
  const { event, shift } = data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const ok = await signUpForEvent({
        eventId: event.id,
        shiftId: shift.id,
        volunteerName: name,
        volunteerEmail: email,
        volunteerPhone: phone,
        emergencyContact,
        dietaryOrAccessNotes: notes,
        preferences: {
          email: emailPref,
          sms: smsPref,
          browserPush: pushPref,
          remind24h,
          remind2h,
        },
      });

      if (ok) {
        setIsSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAtCapacity = shift.signedUpCount >= shift.capacity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-xs uppercase tracking-wider text-stone-500 font-sans">
              Volunteer Enrollment
            </div>
            <h3 className="font-serif text-lg font-medium text-stone-900 mt-0.5">
              {isAtCapacity ? 'Join Shift Waitlist' : 'Confirm Shift Registration'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Confirmation Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-2xl font-serif font-medium text-stone-900">
                You are on the Roster!
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Thank you, <span className="font-medium text-stone-900">{name}</span>. Your spot for{' '}
                <span className="font-medium text-stone-900">{shift.title}</span> has been confirmed.
              </p>
            </div>

            {/* Shift Summary Card */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 text-left text-xs space-y-2">
              <div className="font-medium text-stone-900 text-sm">{event.title}</div>
              <div className="flex items-center gap-2 text-stone-600">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{shift.startTime} – {shift.endTime} · {shift.date}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{event.venueName}, {event.address}</span>
              </div>
            </div>

            {/* Notification Confirmation Banner */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-left flex items-start gap-2.5 text-xs text-amber-950">
              <Bell className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium">Integrated Notifications Active:</span> We sent a confirmation to{' '}
                <span className="underline">{email}</span>
                {phone && smsPref ? ` and SMS alert to ${phone}` : ''}. You will automatically receive reminders 24h & 2h before your shift.
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => exportShiftToCalendar(event, shift)}
                className="flex-1 py-2.5 px-4 text-xs font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <CalendarPlus className="w-4 h-4 text-stone-600" />
                <span>Add to Calendar (.ics)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('schedule');
                }}
                className="flex-1 py-2.5 px-4 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View My Shifts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Sign-Up Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Context Header */}
            <div className="p-3.5 bg-stone-100 rounded-xl space-y-1 text-xs text-stone-700">
              <div className="font-medium text-stone-900 line-clamp-1">{event.title}</div>
              <div className="flex items-center gap-2 text-stone-600 font-mono tabular-nums">
                <span>{shift.title}</span>
                <span>·</span>
                <span>{shift.startTime} - {shift.endTime}</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                Volunteer Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Phone (for SMS updates)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Emergency Contact (Name & Phone)
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                    placeholder="Contact Name & Phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Accessibility, Dietary or Physical Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
                  placeholder="e.g. Vegetarian snacks, seated duties preferred"
                />
              </div>
            </div>

            {/* Integrated Notification Preferences Section */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-stone-700" />
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  Notification & Reminder Delivery
                </h4>
              </div>

              <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-stone-200">
                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPref}
                    onChange={(e) => setEmailPref(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-400"
                  />
                  <span>Send booking confirmation & check-in guide to email</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsPref}
                    onChange={(e) => setSmsPref(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-400"
                  />
                  <span>Send urgent weather changes & coordinator SMS alerts</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushPref}
                    onChange={(e) => setPushPref(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-400"
                  />
                  <span>Enable browser push alerts for same-day updates</span>
                </label>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-500 pt-1">
                <span className="font-medium text-stone-700">Scheduled Reminders:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remind24h}
                    onChange={(e) => setRemind24h(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-stone-900"
                  />
                  <span>24 hours prior</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remind2h}
                    onChange={(e) => setRemind2h(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-stone-900"
                  />
                  <span>2 hours prior</span>
                </label>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                {isSubmitting ? 'Registering...' : isAtCapacity ? 'Join Waitlist' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
