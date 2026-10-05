export type EventCategory =
  | 'Environmental'
  | 'Food Relief'
  | 'Youth & Education'
  | 'Senior Care'
  | 'Animal Welfare'
  | 'Urban Greening'
  | 'Community Aid';

export type EventNeighborhood =
  | 'Downtown Core'
  | 'Riverbank Trail'
  | 'Eastside Commons'
  | 'Pine Hills'
  | 'Harbor View'
  | 'Midtown West';

export interface EventShift {
  id: string;
  title: string;
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "11:30"
  date: string;      // YYYY-MM-DD
  capacity: number;
  signedUpCount: number;
  description?: string;
}

export interface EventOrganizer {
  name: string;
  role: string;
  organization: string;
  avatarUrl: string;
  email: string;
  phone: string;
}

export interface VolunteerEvent {
  id: string;
  title: string;
  category: EventCategory;
  neighborhood: EventNeighborhood;
  address: string;
  venueName: string;
  date: string; // primary display date: YYYY-MM-DD
  displayDateText: string; // e.g. "Saturday, Oct 11, 2026"
  imageUrl: string;
  summary: string;
  description: string;
  requirements: string[];
  providedSupplies: string[];
  organizer: EventOrganizer;
  shifts: EventShift[];
  urgentNeedText?: string;
  isUrgent?: boolean;
  impactMetric: {
    label: string;
    target: number;
    unit: string;
  };
}

export interface VolunteerRegistration {
  id: string;
  eventId: string;
  shiftId: string;
  eventTitle: string;
  shiftTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone: string;
  emergencyContact: string;
  dietaryOrAccessNotes?: string;
  registeredAt: string;
  status: 'confirmed' | 'waitlisted' | 'checked_in' | 'no_show' | 'cancelled';
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    browserPush: boolean;
    remind24h: boolean;
    remind2h: boolean;
  };
}

export type NotificationType =
  | 'reminder'
  | 'broadcast'
  | 'confirmation'
  | 'cancellation'
  | 'waitlist_promoted'
  | 'impact_update';

export interface AppNotification {
  id: string;
  eventId?: string;
  eventTitle?: string;
  type: NotificationType;
  channel: 'in_app' | 'email_sim' | 'sms_sim' | 'push_sim';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  isUrgent?: boolean;
  actionLabel?: string;
  actionTab?: 'catalog' | 'schedule' | 'organizer';
}

export interface UserPreferences {
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone: string;
  enableBrowserPush: boolean;
  enableSmsAlerts: boolean;
  enableEmailAlerts: boolean;
  subscribedNeighborhoods: EventNeighborhood[];
  subscribedCategories: EventCategory[];
  notifyUrgentOnly: boolean;
}
