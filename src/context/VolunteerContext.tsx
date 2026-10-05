import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VolunteerEvent,
  VolunteerRegistration,
  AppNotification,
  UserPreferences,
  EventShift,
} from '../types';
import {
  INITIAL_EVENTS,
  INITIAL_USER_REGISTRATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/seedEvents';
import { generateIcsCalendarFile } from '../utils/calendar';

interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'urgent';
  timestamp: string;
}

interface VolunteerContextType {
  events: VolunteerEvent[];
  registrations: VolunteerRegistration[];
  notifications: AppNotification[];
  userPreferences: UserPreferences;
  activeTab: 'catalog' | 'schedule' | 'notifications' | 'organizer';
  selectedEvent: VolunteerEvent | null;
  selectedShiftForSignUp: { event: VolunteerEvent; shift: EventShift } | null;
  toast: ToastAlert | null;
  unreadNotificationCount: number;

  // Navigation & modals
  setActiveTab: (tab: 'catalog' | 'schedule' | 'notifications' | 'organizer') => void;
  setSelectedEvent: (event: VolunteerEvent | null) => void;
  openSignUpModal: (event: VolunteerEvent, shift: EventShift) => void;
  closeSignUpModal: () => void;
  dismissToast: () => void;

  // Actions
  signUpForEvent: (params: {
    eventId: string;
    shiftId: string;
    volunteerName: string;
    volunteerEmail: string;
    volunteerPhone: string;
    emergencyContact: string;
    dietaryOrAccessNotes?: string;
    preferences: {
      email: boolean;
      sms: boolean;
      browserPush: boolean;
      remind24h: boolean;
      remind2h: boolean;
    };
  }) => Promise<boolean>;

  cancelRegistration: (registrationId: string) => void;
  createEvent: (newEvent: Omit<VolunteerEvent, 'id'>) => void;
  sendOrganizerBroadcast: (eventId: string, title: string, message: string, isUrgent: boolean) => void;
  updateVolunteerRosterStatus: (eventId: string, shiftId: string, registrationId: string, status: 'checked_in' | 'no_show' | 'confirmed') => void;
  
  // Notification management
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void;
  requestBrowserNotificationPermission: () => Promise<boolean>;
  exportShiftToCalendar: (event: VolunteerEvent, shift: EventShift) => void;
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'haven_commons_events_v1',
  REGISTRATIONS: 'haven_commons_registrations_v1',
  NOTIFICATIONS: 'haven_commons_notifications_v1',
  PREFERENCES: 'haven_commons_preferences_v1',
};

export const VolunteerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<VolunteerEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_USER_REGISTRATIONS;
    } catch {
      return INITIAL_USER_REGISTRATIONS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      volunteerName: 'Alex Mercer',
      volunteerEmail: 'alex.mercer@gmail.com',
      volunteerPhone: '(555) 492-8172',
      enableBrowserPush: true,
      enableSmsAlerts: true,
      enableEmailAlerts: true,
      subscribedNeighborhoods: ['Downtown Core', 'Eastside Commons', 'Riverbank Trail'],
      subscribedCategories: ['Environmental', 'Food Relief', 'Urban Greening'],
      notifyUrgentOnly: false,
    };
  });

  const [activeTab, setActiveTab] = useState<'catalog' | 'schedule' | 'notifications' | 'organizer'>('catalog');
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [selectedShiftForSignUp, setSelectedShiftForSignUp] = useState<{ event: VolunteerEvent; shift: EventShift } | null>(null);
  const [toast, setToast] = useState<ToastAlert | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(userPreferences));
  }, [userPreferences]);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'urgent') => {
    const alert: ToastAlert = {
      id: `toast-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToast(alert);
    setTimeout(() => {
      setToast((prev) => (prev?.id === alert.id ? null : prev));
    }, 6000);
  };

  const dismissToast = () => setToast(null);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const openSignUpModal = (event: VolunteerEvent, shift: EventShift) => {
    setSelectedShiftForSignUp({ event, shift });
  };

  const closeSignUpModal = () => {
    setSelectedShiftForSignUp(null);
  };

  const requestBrowserNotificationPermission = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setUserPreferences((prev) => ({ ...prev, enableBrowserPush: granted }));
        if (granted) {
          showToast('Notifications Activated', 'Browser alerts enabled for urgent shift updates.', 'success');
        }
        return granted;
      } catch (err) {
        console.warn('Browser notification request failed:', err);
      }
    }
    setUserPreferences((prev) => ({ ...prev, enableBrowserPush: true }));
    showToast('In-App Notifications Enabled', 'You will receive immediate pop-up alerts.', 'info');
    return true;
  };

  const signUpForEvent = async (params: {
    eventId: string;
    shiftId: string;
    volunteerName: string;
    volunteerEmail: string;
    volunteerPhone: string;
    emergencyContact: string;
    dietaryOrAccessNotes?: string;
    preferences: {
      email: boolean;
      sms: boolean;
      browserPush: boolean;
      remind24h: boolean;
      remind2h: boolean;
    };
  }): Promise<boolean> => {
    const targetEvent = events.find((e) => e.id === params.eventId);
    if (!targetEvent) return false;

    const targetShift = targetEvent.shifts.find((s) => s.id === params.shiftId);
    if (!targetShift) return false;

    const isAtCapacity = targetShift.signedUpCount >= targetShift.capacity;
    const registrationStatus = isAtCapacity ? 'waitlisted' : 'confirmed';

    const newRegistration: VolunteerRegistration = {
      id: `reg-${Date.now()}`,
      eventId: targetEvent.id,
      shiftId: targetShift.id,
      eventTitle: targetEvent.title,
      shiftTitle: targetShift.title,
      eventDate: targetShift.date,
      eventTime: `${targetShift.startTime} - ${targetShift.endTime}`,
      eventLocation: targetEvent.address,
      volunteerName: params.volunteerName,
      volunteerEmail: params.volunteerEmail,
      volunteerPhone: params.volunteerPhone,
      emergencyContact: params.emergencyContact,
      dietaryOrAccessNotes: params.dietaryOrAccessNotes,
      registeredAt: new Date().toISOString(),
      status: registrationStatus,
      notificationPreferences: params.preferences,
    };

    // Update shift count
    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id !== params.eventId) return evt;
        return {
          ...evt,
          shifts: evt.shifts.map((sh) => {
            if (sh.id !== params.shiftId) return sh;
            return {
              ...sh,
              signedUpCount: isAtCapacity ? sh.signedUpCount : sh.signedUpCount + 1,
            };
          }),
        };
      })
    );

    setRegistrations((prev) => [newRegistration, ...prev]);

    // Create confirmation notification
    const confirmationNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      type: 'confirmation',
      channel: params.preferences.sms ? 'sms_sim' : 'email_sim',
      title: isAtCapacity ? 'Waitlist Registration Logged' : 'Volunteer Spot Confirmed!',
      message: isAtCapacity
        ? `You are on the waitlist for "${targetShift.title}". We will notify you immediately if a slot opens up.`
        : `You are booked for "${targetShift.title}" on ${targetShift.date} (${targetShift.startTime} - ${targetShift.endTime}) at ${targetEvent.venueName}. A calendar reminder has been queued.`,
      timestamp: new Date().toISOString(),
      read: false,
      isUrgent: false,
      actionLabel: 'View Schedule',
      actionTab: 'schedule',
    };

    // Also queue simulated reminder notification
    const scheduledReminder: AppNotification = {
      id: `notif-remind-${Date.now()}`,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      type: 'reminder',
      channel: 'email_sim',
      title: `Upcoming: ${targetEvent.title}`,
      message: `Shift check-in is scheduled at ${targetShift.startTime}. Please wear ${targetEvent.requirements[0] || 'comfortable clothing'}. Contact organizer ${targetEvent.organizer.name} at ${targetEvent.organizer.phone} if running late.`,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      read: false,
      isUrgent: false,
      actionLabel: 'Directions',
      actionTab: 'schedule',
    };

    setNotifications((prev) => [confirmationNotification, scheduledReminder, ...prev]);

    // Browser notification trigger if enabled
    if (params.preferences.browserPush && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Haven Commons: Spot Confirmed`, {
          body: `You are confirmed for ${targetEvent.title} (${targetShift.startTime} - ${targetShift.endTime})`,
        });
      } catch {
        // Safe fallback
      }
    }

    showToast(
      isAtCapacity ? 'Added to Waitlist' : 'Sign-up Confirmed!',
      isAtCapacity
        ? `You will be alerted if a volunteer spot frees up.`
        : `Confirmed for ${targetShift.title}. Notification sent.`,
      'success'
    );

    closeSignUpModal();
    return true;
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;

    // Release capacity
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== reg.eventId) return evt;
        return {
          ...evt,
          shifts: evt.shifts.map((sh) => {
            if (sh.id !== reg.shiftId) return sh;
            return {
              ...sh,
              signedUpCount: Math.max(0, sh.signedUpCount - 1),
            };
          }),
        };
      })
    );

    // Update registration status
    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: 'cancelled' } : r))
    );

    // Send cancellation notification
    const cancelNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle,
      type: 'cancellation',
      channel: 'in_app',
      title: 'Volunteer Shift Cancelled',
      message: `Your registration for "${reg.shiftTitle}" on ${reg.eventDate} has been released. The spot is now available for other community volunteers.`,
      timestamp: new Date().toISOString(),
      read: false,
      actionLabel: 'Browse Events',
      actionTab: 'catalog',
    };

    setNotifications((prev) => [cancelNotif, ...prev]);

    showToast('Registration Released', `Your spot for ${reg.shiftTitle} was opened for others.`, 'info');
  };

  const createEvent = (newEventData: Omit<VolunteerEvent, 'id'>) => {
    const createdEvent: VolunteerEvent = {
      ...newEventData,
      id: `evt-${Date.now()}`,
    };

    setEvents((prev) => [createdEvent, ...prev]);

    // Broadcast notification to community subscribers
    const broadcastNotif: AppNotification = {
      id: `notif-pub-${Date.now()}`,
      eventId: createdEvent.id,
      eventTitle: createdEvent.title,
      type: 'impact_update',
      channel: 'in_app',
      title: `New Initiative: ${createdEvent.title}`,
      message: `Organizer ${createdEvent.organizer.name} just posted a new volunteer opportunity in ${createdEvent.neighborhood}. ${createdEvent.shifts.reduce((sum, s) => sum + s.capacity, 0)} spots open.`,
      timestamp: new Date().toISOString(),
      read: false,
      isUrgent: createdEvent.isUrgent,
      actionLabel: 'View Opportunity',
      actionTab: 'catalog',
    };

    setNotifications((prev) => [broadcastNotif, ...prev]);
    showToast('Event Published', `"${createdEvent.title}" is now open for volunteer sign-ups.`, 'success');
  };

  const sendOrganizerBroadcast = (
    eventId: string,
    title: string,
    message: string,
    isUrgent: boolean
  ) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;

    const notif: AppNotification = {
      id: `broadcast-${Date.now()}`,
      eventId: evt.id,
      eventTitle: evt.title,
      type: 'broadcast',
      channel: isUrgent ? 'sms_sim' : 'in_app',
      title: `Organizer Alert: ${title}`,
      message: `${evt.organizer.name} (${evt.organizer.organization}): ${message}`,
      timestamp: new Date().toISOString(),
      read: false,
      isUrgent,
      actionLabel: 'View Event',
      actionTab: 'catalog',
    };

    setNotifications((prev) => [notif, ...prev]);

    if (isUrgent && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Haven Commons Alert: ${evt.title}`, {
          body: message,
        });
      } catch {
        // Safe fallback
      }
    }

    showToast(
      isUrgent ? 'Urgent Alert Broadcasted!' : 'Notification Sent',
      `Delivered across simulated SMS, Email & App channels to all enrolled volunteers.`,
      isUrgent ? 'urgent' : 'success'
    );
  };

  const updateVolunteerRosterStatus = (
    _eventId: string,
    _shiftId: string,
    registrationId: string,
    status: 'checked_in' | 'no_show' | 'confirmed'
  ) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status } : r))
    );
    showToast(
      'Roster Updated',
      status === 'checked_in'
        ? 'Volunteer checked in successfully.'
        : status === 'no_show'
        ? 'Marked as no show.'
        : 'Status reset to confirmed.',
      'info'
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateUserPreferences = (prefs: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({ ...prev, ...prefs }));
    showToast('Preferences Saved', 'Alert channel subscriptions updated.', 'success');
  };

  const exportShiftToCalendar = (event: VolunteerEvent, shift: EventShift) => {
    generateIcsCalendarFile(event, shift);
    showToast('Calendar Invite Exported', `Generated .ics file for "${event.title}".`, 'success');
  };

  return (
    <VolunteerContext.Provider
      value={{
        events,
        registrations,
        notifications,
        userPreferences,
        activeTab,
        selectedEvent,
        selectedShiftForSignUp,
        toast,
        unreadNotificationCount,
        setActiveTab,
        setSelectedEvent,
        openSignUpModal,
        closeSignUpModal,
        dismissToast,
        signUpForEvent,
        cancelRegistration,
        createEvent,
        sendOrganizerBroadcast,
        updateVolunteerRosterStatus,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        updateUserPreferences,
        requestBrowserNotificationPermission,
        exportShiftToCalendar,
      }}
    >
      {children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteer = () => {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error('useVolunteer must be used within a VolunteerProvider');
  }
  return context;
};
