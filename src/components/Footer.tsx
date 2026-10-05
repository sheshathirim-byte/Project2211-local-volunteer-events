import React from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { Heart, Compass, Shield, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useVolunteer();

  return (
    <footer className="border-t border-stone-200 bg-[#F4F1EA] text-stone-700 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-xl font-serif font-medium text-stone-900">
              Haven Commons
            </span>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              An open civic network connecting residents with local grassroots volunteer efforts, community land trusts, food rescue operations, and youth literacy hubs.
            </p>
            <div className="text-[11px] text-stone-500 font-mono">
              Operating across 6 municipal districts · Non-commercial civic commons
            </div>
          </div>

          {/* Nav links */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Platform Directory
            </div>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="hover:text-stone-950 transition-colors cursor-pointer"
                >
                  Browse Open Shifts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className="hover:text-stone-950 transition-colors cursor-pointer"
                >
                  My Volunteer Ledger
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="hover:text-stone-950 transition-colors cursor-pointer"
                >
                  Dispatch Notifications & Subscriptions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('organizer')}
                  className="hover:text-stone-950 transition-colors cursor-pointer"
                >
                  Coordinator Attendance Roster
                </button>
              </li>
            </ul>
          </div>

          {/* Civic Stewardship */}
          <div className="md:col-span-4 space-y-2">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Civic Stewardship Guidelines
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Haven Commons verifies all community group coordinators and ensures shift rosters are handled with privacy. For urgent neighborhood support or weather concerns, check your SMS coordinator feed.
            </p>
            <div className="pt-2 text-[11px] text-stone-500">
              Inquiries: <span className="font-mono text-stone-700">community@havencommons.org</span>
            </div>
          </div>
        </div>

        {/* Hairline divider & quiet copyright */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div>
            Haven Commons Civic Alliance © 2026. Built for community resilience and mutual aid.
          </div>
          <div className="flex items-center gap-4">
            <span>Verified Non-Profit Federation</span>
            <span aria-hidden="true">·</span>
            <span>Volunteer Bill of Rights</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
