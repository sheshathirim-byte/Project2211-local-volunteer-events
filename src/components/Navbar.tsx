import React from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { Bell, Plus, Calendar, CheckSquare } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { activeTab, setActiveTab, unreadNotificationCount, registrations } = useVolunteer();

  const activeRegistrationsCount = registrations.filter((r) => r.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xl sm:text-2xl font-serif font-medium tracking-tight text-stone-900 hover:text-stone-700 transition-colors cursor-pointer text-left"
          >
            Haven Commons
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`transition-colors cursor-pointer relative py-1 ${
                activeTab === 'catalog'
                  ? 'text-stone-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Discover Events
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`transition-colors cursor-pointer relative py-1 flex items-center gap-1.5 ${
                activeTab === 'schedule'
                  ? 'text-stone-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>My Schedule</span>
              {activeRegistrationsCount > 0 && (
                <span className="text-xs font-mono tabular-nums text-stone-500">
                  ({activeRegistrationsCount})
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`transition-colors cursor-pointer relative py-1 flex items-center gap-1.5 ${
                activeTab === 'notifications'
                  ? 'text-stone-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-mono text-white bg-amber-700 rounded-full">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('organizer')}
              className={`transition-colors cursor-pointer relative py-1 ${
                activeTab === 'organizer'
                  ? 'text-stone-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Organizer Hub & Roster
            </button>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('notifications')}
              title="Notification Center"
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.75]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-[#FAF8F5]" />
              )}
            </button>

            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium tracking-wide uppercase text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Post Event</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200 text-xs font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-1 ${activeTab === 'catalog' ? 'text-stone-900 font-semibold' : ''}`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-1 ${activeTab === 'schedule' ? 'text-stone-900 font-semibold' : ''}`}
          >
            My Shifts ({activeRegistrationsCount})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-1 flex items-center gap-1 ${activeTab === 'notifications' ? 'text-stone-900 font-semibold' : ''}`}
          >
            Alerts
            {unreadNotificationCount > 0 && (
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('organizer')}
            className={`py-1 ${activeTab === 'organizer' ? 'text-stone-900 font-semibold' : ''}`}
          >
            Roster
          </button>
        </div>
      </div>
    </header>
  );
};
