/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VolunteerProvider, useVolunteer } from './context/VolunteerContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { EventCatalog } from './components/EventCatalog';
import { EventDetailModal } from './components/EventDetailModal';
import { SignUpModal } from './components/SignUpModal';
import { NotificationCenter } from './components/NotificationCenter';
import { MyScheduleView } from './components/MyScheduleView';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { CreateEventModal } from './components/CreateEventModal';
import { ToastBanner } from './components/ToastBanner';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedEvent,
    setSelectedEvent,
    selectedShiftForSignUp,
    openSignUpModal,
    closeSignUpModal,
  } = useVolunteer();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-stone-200">
      {/* Top Bar Navigation */}
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <>
            <HeroBanner onFilterUrgent={() => setFilterUrgentOnly(true)} />
            <EventCatalog
              urgentOnlyProp={filterUrgentOnly}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
              onQuickSignUp={(evt, shift) => openSignUpModal(evt, shift)}
            />
          </>
        )}

        {activeTab === 'schedule' && (
          <MyScheduleView onSelectEvent={(evt) => setSelectedEvent(evt)} />
        )}

        {activeTab === 'notifications' && <NotificationCenter />}

        {activeTab === 'organizer' && (
          <OrganizerDashboard onOpenCreateModal={() => setIsCreateModalOpen(true)} />
        )}
      </main>

      {/* Modals & Overlays */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSelectShift={(evt, shift) => {
          setSelectedEvent(null);
          openSignUpModal(evt, shift);
        }}
      />

      <SignUpModal
        data={selectedShiftForSignUp}
        onClose={closeSignUpModal}
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ToastBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <VolunteerProvider>
      <AppContent />
    </VolunteerProvider>
  );
}
