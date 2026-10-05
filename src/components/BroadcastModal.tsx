import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { VolunteerEvent } from '../types';
import { X, Send, AlertTriangle, Bell, Smartphone, Mail } from 'lucide-react';

interface BroadcastModalProps {
  event: VolunteerEvent | null;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ event, onClose }) => {
  const { sendOrganizerBroadcast } = useVolunteer();
  const [title, setTitle] = useState('Weather & Check-in Advisory');
  const [message, setMessage] = useState(
    'Please note that morning check-in will be held under the North Covered Pavilion due to expected drizzle. Extra rain ponchos are provided.'
  );
  const [isUrgent, setIsUrgent] = useState(true);
  const [isSending, setIsSending] = useState(false);

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      sendOrganizerBroadcast(event.id, title, message, isUrgent);
      setIsSending(false);
      onClose();
    }, 400);
  };

  const totalVolunteersCount = event.shifts.reduce((sum, s) => sum + s.signedUpCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-6">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Bell className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-stone-500 font-sans">
                Organizer Dispatch
              </div>
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Broadcast Volunteer Notification
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-700 space-y-1">
            <div className="font-medium text-stone-900">{event.title}</div>
            <div className="text-stone-500">
              Broadcasting to <span className="font-mono font-medium text-stone-900">{totalVolunteersCount}</span> enrolled volunteers across all shifts.
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Broadcast Subject / Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
              placeholder="e.g. Heavy rain delay / Parking lot change"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Notification Message Content *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
              placeholder="Enter exact instructions or updates for volunteers..."
            />
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-amber-700 focus:ring-amber-500"
              />
              <span className="font-medium">
                Mark as High-Priority / Time-Critical Alert
              </span>
            </label>
            <p className="text-[11px] text-stone-500 pl-6 leading-relaxed">
              Triggers simulated instant SMS text dispatch to phones and browser push banners in addition to standard in-app notification feeds.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching...' : 'Send Broadcast'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
