import { useState, useEffect } from 'react';
import IncidentCard from './IncidentCard';

export default function IncidentList({
  incidents = [],
  selectedIncident,
  onIncidentSelect,
  onIncidentResolve,
  loading
}) {
  const [showResolved, setShowResolved] = useState(false);
  const [updateTime, setUpdateTime] = useState('');

  // Defensive: always work with array
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  useEffect(() => {
    setUpdateTime(new Date().toLocaleTimeString());
  }, [safeIncidents]);

  // Split for tabs
  const unresolvedIncidents = safeIncidents.filter(inc => !inc.resolved);
  const resolvedIncidents = safeIncidents.filter(inc => inc.resolved);
  const chosenIncidents = showResolved ? resolvedIncidents : unresolvedIncidents;

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 h-full flex flex-col border border-gray-700 shadow-lg">
      {/* Header with tabs */}
      <div className="mb-4 md:mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-white text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
            <span className="bg-blue-600 p-1.5 rounded-lg"></span>
            Incident Dashboard
          </span>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center ${
              !showResolved
                ? 'bg-red-600/90 text-white shadow-md'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setShowResolved(false)}
          >
            <span className="mr-2">🚨</span>
            Unresolved
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
              {unresolvedIncidents.length}
            </span>
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center ${
              showResolved
                ? 'bg-green-600/90 text-white shadow-md'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => setShowResolved(true)}
          >
            <span className="mr-2">✅</span>
            Resolved
            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
              {resolvedIncidents.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-3/4 space-y-4">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <div className="text-gray-400">Loading incidents...</div>
          </div>
        ) : chosenIncidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-3/4 text-center p-4">
            <div className="text-4xl mb-3 text-gray-500">
              {showResolved ? '✅' : '📭'}
            </div>
            <h3 className="text-gray-300 font-medium mb-1">
              No {showResolved ? 'resolved' : 'unresolved'} incidents
            </h3>
            <p className="text-gray-500 text-sm">
              {showResolved 
                ? 'All incidents have been resolved' 
                : 'No active incidents to display'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {chosenIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isSelected={selectedIncident?.id === incident.id}
                onSelect={() => onIncidentSelect(incident)}
                onResolve={!showResolved ? () => onIncidentResolve(incident.id) : undefined}
                showResolveButton={!showResolved}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="mt-4 pt-3 border-t border-gray-700/50 text-xs text-gray-400 flex justify-between">
        <span>Total incidents: {safeIncidents.length}</span>
        <span suppressHydrationWarning>Updated: {updateTime || '--:--:--'}</span>
      </div>
    </div>
  );
}
