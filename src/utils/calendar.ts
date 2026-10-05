import { VolunteerEvent, EventShift } from '../types';

export function generateIcsCalendarFile(event: VolunteerEvent, shift: EventShift): void {
  // Format dates: YYYYMMDDTHHmmssZ
  const eventDateStr = shift.date.replace(/-/g, '');
  const startHourMin = shift.startTime.replace(/:/g, '');
  const endHourMin = shift.endTime.replace(/:/g, '');

  const dtStart = `${eventDateStr}T${startHourMin}00`;
  const dtEnd = `${eventDateStr}T${endHourMin}00`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const title = `Volunteer: ${event.title} (${shift.title})`;
  const description = `${event.summary}\\n\\nLocation: ${event.venueName}, ${event.address}\\nOrganizer: ${event.organizer.name} (${event.organizer.phone})\\n\\nOrganized through Haven Commons Volunteer Network.`;
  const location = `${event.venueName}, ${event.address}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Haven Commons//Volunteer Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:haven-event-${event.id}-${shift.id}-${Date.now()}@havencommons.org`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Volunteer Shift Reminder in 2 Hours',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `volunteer-${event.id}-${shift.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
