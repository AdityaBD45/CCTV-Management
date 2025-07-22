'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import IncidentPlayer from '@/components/IncidentPlayer';
import IncidentList from '@/components/IncidentList';

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ALL incidents (resolved and unresolved) on mount
  useEffect(() => {
    fetchIncidents();
    // Optionally: add polling for live/refresh, if desired
    // const interval = setInterval(fetchIncidents, 20000);
    // return () => clearInterval(interval);
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/incidents');
      const data = await response.json();
      setIncidents(data);

      // Select first unresolved by default, else first incident at all
      if (data.length > 0) {
        const firstUnresolved = data.find(inc => !inc.resolved) || data[0];
        setSelectedIncident(firstUnresolved);
      } else {
        setSelectedIncident(null);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  // When a row/card is clicked (from IncidentList or Player strip)
  const handleIncidentSelect = (incident) => {
    setSelectedIncident(incident);
  };

  // When resolve is triggered (from IncidentCard)
  const handleIncidentResolve = async (incidentId) => {
    try {
      // Optimistic UI update
      setIncidents(prev =>
        prev.map(inc =>
          inc.id === incidentId ? { ...inc, resolved: true } : inc
        )
      );

      // If the resolved incident was selected, select next unresolved (if any)
      if (selectedIncident?.id === incidentId) {
        // next unresolved from _new_ state, not old!
        const nextList = incidents.map(inc =>
          inc.id === incidentId ? { ...inc, resolved: true } : inc
        );
        const remainingUnresolved = nextList.filter(i => !i.resolved);
        setSelectedIncident(remainingUnresolved[0] || null);
      }

      // Actually PATCH on backend
      await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH'
      });

      // Optionally re-fetch from server for perfect state
      // await fetchIncidents();
    } catch (error) {
      console.error('Error resolving incident:', error);
      fetchIncidents();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Incident Player - Left Side (60%) */}
        <div className="flex-1 w-3/5 p-6">
          <IncidentPlayer
            incident={selectedIncident}
            loading={loading}
            incidents={incidents}
            onIncidentSelect={handleIncidentSelect}
          />
        </div>

        {/* Incident List - Right Side (40%) */}
        <div className="w-2/5 p-6 pl-3">
          <IncidentList
            incidents={incidents}
            selectedIncident={selectedIncident}
            onIncidentSelect={handleIncidentSelect}
            onIncidentResolve={handleIncidentResolve}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
