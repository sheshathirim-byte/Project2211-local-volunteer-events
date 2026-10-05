import React, { useState } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { AppNotification, EventCategory, EventNeighborhood } from '../types';
import {
  Bell,
  Check,
  Trash2,
  AlertCircle,
  Smartphone,
  Mail,
  Compass,
  Sliders,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const ALL_CATEGORIES: EventCategory[] = [
  'Environmental',
  'Food Relief',
  'Youth & Education',
  'Senior Care',
  'Animal Welfare',
  'Urban Greening',
  'Community Aid',
];

const ALL_NEIGHBORHOODS: EventNeighborhood[] = [
  'Downtown Core',
  'Eastside Commons',
  'Riverbank Trail',
  'Pine Hills',
  'Harbor View',
  'Midtown West',
];

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    userPreferences,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    updateUserPreferences,
    requestBrowserNotificationPermission,
    setActiveTab,
    setSelectedEvent,
    events,
  } = useVolunteer();

  const [activeFilter, setActiveFilter] = useState<'all' | 'broadcast' | 'reminder' | 'confirmation'>('all');
  const [viewMode, setViewMode] = useState<'feed' | 'simulation' | 'settings'>('feed');

  // Channel simulator selected item
  const [selectedNotifForSim, setSelectedNotifForSim] = useState<AppNotification | null>(
    notifications[0] || null
  );
  const [simChannel, setSimChannel] = useState<'sms' | 'email' | 'push'>('sms');

  // Settings form local state
  const [enableBrowserPush, setEnableBrowserPush] = useState(userPreferences.enableBrowserPush);
  const [enableSms, setEnableSms] = useState(userPreferences.enableSmsAlerts);
  const [enableEmail, setEnableEmail] = useState(userPreferences.enableEmailAlerts);
  const [urgentOnly, setUrgentOnly] = useState(userPreferences.notifyUrgentOnly);
  const [subsNeighborhoods, setSubsNeighborhoods] = useState<EventNeighborhood[]>(
    userPreferences.subscribedNeighborhoods
  );
  const [subsCategories, setSubsCategories] = useState<EventCategory[]>(
    userPreferences.subscribedCategories
  );

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const handleActionClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.eventId) {
      const found = events.find((e) => e.id === notif.eventId);
      if (found) {
        setSelectedEvent(found);
      }
    }
    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
    }
  };

  const handleSavePreferences = () => {
    updateUserPreferences({
      enableBrowserPush,
      enableSmsAlerts: enableSms,
      enableEmailAlerts: enableEmail,
      notifyUrgentOnly: urgentOnly,
      subscribedNeighborhoods: subsNeighborhoods,
      subscribedCategories: subsCategories,
    });
  };

  const toggleNeighborhood = (n: EventNeighborhood) => {
    setSubsNeighborhoods((prev) =>
      prev.includes(n) ? prev.filter((item) => item !== n) : [...prev, n]
    );
  };

  const toggleCategory = (c: EventCategory) => {
    setSubsCategories((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
            <span>Community Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>Alerts & Reminders</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-900 mt-1">
            Notification Feed & Dispatch Simulator
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage multi-channel volunteer alerts, weather advisories, shift reminders, and subscriptions.
          </p>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('feed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'feed'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Live Feed ({notifications.length})
          </button>
          <button
            onClick={() => setViewMode('simulation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'simulation'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Multi-Channel Preview
          </button>
          <button
            onClick={() => setViewMode('settings')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewMode === 'settings'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Alert Preferences
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE FEED */}
      {viewMode === 'feed' && (
        <div className="space-y-4">
          {/* Filter Bar & Clear Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'all', label: 'All Alerts' },
                  { id: 'broadcast', label: 'Organizer Bulletins' },
                  { id: 'reminder', label: 'Shift Reminders' },
                  { id: 'confirmation', label: 'Sign-up Confirms' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {unreadNotificationCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => {
                const dateObj = new Date(notif.timestamp);
                const timeString = isNaN(dateObj.getTime())
                  ? 'Just now'
                  : dateObj.toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-all ${
                      !notif.read
                        ? 'bg-white border-stone-300 shadow-sm'
                        : 'bg-white/70 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.isUrgent
                              ? 'bg-amber-100 text-amber-800'
                              : notif.type === 'reminder'
                              ? 'bg-stone-100 text-stone-700'
                              : notif.type === 'confirmation'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {notif.isUrgent ? (
                            <AlertCircle className="w-4 h-4 text-amber-700" />
                          ) : notif.type === 'reminder' ? (
                            <Clock className="w-4 h-4" />
                          ) : notif.type === 'confirmation' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-1">
                          {/* Unboxed metadata */}
                          <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500 font-sans">
                            <span className="capitalize font-medium text-stone-700">
                              {notif.type.replace('_', ' ')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">{timeString}</span>
                            {notif.isUrgent && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-amber-700">Urgent</span>
                              </>
                            )}
                          </div>

                          <h3 className="text-sm font-medium text-stone-900 leading-snug">
                            {notif.title}
                          </h3>

                          <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                            {notif.message}
                          </p>
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {notif.actionLabel && (
                          <button
                            onClick={() => handleActionClick(notif)}
                            className="px-2.5 py-1 text-xs font-medium text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
                          >
                            {notif.actionLabel}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedNotifForSim(notif);
                            setViewMode('simulation');
                          }}
                          title="Preview in multi-channel simulator"
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteNotification(notif.id)}
                          title="Delete notification"
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-xl border border-stone-200 p-6 space-y-2">
              <Bell className="w-8 h-8 text-stone-300 mx-auto" />
              <div className="text-sm font-medium text-stone-800">No notifications in this category</div>
              <div className="text-xs text-stone-500">You are completely up to date with your local volunteer network.</div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MULTI-CHANNEL PREVIEW SIMULATOR */}
      {viewMode === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-stone-100/70 p-4 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
            <span className="font-medium text-stone-900">Multi-Channel Delivery System:</span>
            <p>
              When organizers broadcast updates or shifts approach, Haven Commons dispatches across SMS text, automated email digests, and browser push notifications. Inspect how notifications appear on volunteer devices below:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left list of alerts to preview */}
            <div className="md:col-span-5 space-y-2">
              <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Select Dispatch to Inspect
              </div>
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNotifForSim(n)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors cursor-pointer ${
                    selectedNotifForSim?.id === n.id
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-medium truncate">{n.title}</div>
                  <div className={`truncate mt-0.5 ${selectedNotifForSim?.id === n.id ? 'text-stone-300' : 'text-stone-500'}`}>
                    {n.message}
                  </div>
                </button>
              ))}
            </div>

            {/* Right preview canvas */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Device Rendering Mockup
                </span>
                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setSimChannel('sms')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                      simChannel === 'sms' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    SMS Text
                  </button>
                  <button
                    onClick={() => setSimChannel('email')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                      simChannel === 'email' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setSimChannel('push')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                      simChannel === 'push' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                    }`}
                  >
                    Web Push
                  </button>
                </div>
              </div>

              {selectedNotifForSim ? (
                <div className="min-h-[220px] flex items-center justify-center p-4 bg-stone-50/70 rounded-xl border border-stone-200">
                  {/* SMS Preview */}
                  {simChannel === 'sms' && (
                    <div className="w-full max-w-sm bg-white rounded-2xl p-4 shadow-sm border border-stone-300/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                        <span>HAVEN-COMMONS SMS ALERT</span>
                        <span>Now</span>
                      </div>
                      <div className="p-3 bg-stone-100 rounded-xl rounded-tl-xs text-xs text-stone-800 leading-relaxed font-sans">
                        <span className="font-semibold">{selectedNotifForSim.title}: </span>
                        {selectedNotifForSim.message}
                        <div className="text-[10px] text-stone-400 mt-2">
                          Reply STOP to unsubscribe · havencommons.org/m/{selectedNotifForSim.id}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Preview */}
                  {simChannel === 'email' && (
                    <div className="w-full bg-white rounded-xl p-5 shadow-sm border border-stone-300/80 space-y-3 text-xs">
                      <div className="border-b border-stone-100 pb-2 space-y-1">
                        <div className="text-stone-500">
                          <span className="font-medium text-stone-700">From: </span>
                          alerts@havencommons.org (Haven Volunteer Network)
                        </div>
                        <div className="text-stone-500">
                          <span className="font-medium text-stone-700">To: </span>
                          {userPreferences.volunteerEmail}
                        </div>
                        <div className="text-stone-800 font-medium pt-1 text-sm">
                          {selectedNotifForSim.title}
                        </div>
                      </div>
                      <div className="text-stone-700 leading-relaxed space-y-2">
                        <p>{selectedNotifForSim.message}</p>
                        <p className="text-stone-500 text-[11px]">
                          Thank you for stepping up for local community resilience.
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className="inline-block px-3 py-1.5 bg-stone-900 text-white rounded text-[11px] font-medium">
                          Open in Haven Commons
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Push Alert Preview */}
                  {simChannel === 'push' && (
                    <div className="w-full max-w-md bg-stone-900 text-white rounded-xl p-4 shadow-lg space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <div className="flex items-center gap-1.5 font-sans font-medium text-stone-200">
                          <Bell className="w-3.5 h-3.5 text-amber-400" />
                          <span>Haven Commons</span>
                        </div>
                        <span className="font-mono text-[10px]">Just now</span>
                      </div>
                      <div className="text-xs font-semibold text-stone-100">
                        {selectedNotifForSim.title}
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-2">
                        {selectedNotifForSim.message}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-stone-500 text-center py-8">Select an alert to preview.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SETTINGS & SUBSCRIPTIONS */}
      {viewMode === 'settings' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-8">
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Notification Channels & Community Subscriptions
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Select how and when you want Haven Commons to alert you regarding upcoming shifts and urgent neighborhood callouts.
            </p>
          </div>

          {/* Delivery Channels */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Active Delivery Channels
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Push Notifications */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-xs text-stone-900">
                    <Bell className="w-4 h-4 text-stone-700" />
                    <span>Browser Web Push</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableBrowserPush}
                    onChange={(e) => setEnableBrowserPush(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Direct notifications even when Haven Commons is open in a background tab.
                </p>
                <button
                  type="button"
                  onClick={requestBrowserNotificationPermission}
                  className="text-[11px] font-medium text-stone-800 hover:text-stone-950 underline"
                >
                  Verify Browser Permissions
                </button>
              </div>

              {/* SMS Text */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-xs text-stone-900">
                    <Smartphone className="w-4 h-4 text-stone-700" />
                    <span>SMS Coordinator Alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableSms}
                    onChange={(e) => setEnableSms(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Real-time texts for weather cancellations, venue shifts, or urgent morning needs.
                </p>
              </div>

              {/* Email Digests */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-medium text-xs text-stone-900">
                    <Mail className="w-4 h-4 text-stone-700" />
                    <span>Email Shift Guides</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableEmail}
                    onChange={(e) => setEnableEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Detailed parking instructions, gear checklists, and confirmation receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Neighborhood Subscriptions */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Subscribed Neighborhoods
            </h4>
            <p className="text-xs text-stone-500">
              Receive alerts whenever new volunteer gatherings are scheduled in these areas.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_NEIGHBORHOODS.map((nh) => {
                const isSelected = subsNeighborhoods.includes(nh);
                return (
                  <button
                    key={nh}
                    type="button"
                    onClick={() => toggleNeighborhood(nh)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {nh}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Interests */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">
              Cause & Category Subscriptions
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = subsCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgent only toggle */}
          <div className="pt-2 border-t border-stone-200">
            <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 border-stone-300"
              />
              <span className="font-medium text-stone-900">
                Only alert me for urgent, short-handed emergency needs (e.g. storms, harvest floods, sudden shortages)
              </span>
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Save Notification Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
