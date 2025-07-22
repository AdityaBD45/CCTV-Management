import { useState } from 'react';

export default function IncidentCard({
  incident,
  isSelected,
  onSelect,
  onResolve,
  showResolveButton = true,
}) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async (e) => {
    e.stopPropagation();
    setIsResolving(true);
    try {
      await onResolve?.();
    } catch (error) {
      console.error('Failed to resolve incident:', error);
      setIsResolving(false);
    }
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const getTypeColor = (type) => {
    const colors = {
      'Gun Threat': 'bg-red-500',
      'Unauthorised Access': 'bg-orange-500',
      'Face Recognised': 'bg-blue-500',
      'Suspicious Activity': 'bg-yellow-500',
      'Break In Attempt': 'bg-red-600',
      'Weapon Detection': 'bg-red-700',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Gun Threat': '🔫',
      'Unauthorised Access': '🚪',
      'Face Recognised': '👤',
      'Suspicious Activity': '⚠️',
      'Break In Attempt': '🔓',
      'Weapon Detection': '⚔️',
    };
    return icons[type] || '📹';
  };

  return (
    <div
      className={`
        bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 cursor-pointer 
        transition-all duration-200 border border-gray-600 shadow-sm
        ${isSelected ? 'ring-2 ring-blue-400 bg-gray-600 shadow-md' : 'hover:bg-gray-600 hover:shadow-md'}
        ${isResolving ? 'opacity-70 pointer-events-none' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail with fallback */}
        <div className="relative w-full sm:w-20 h-32 sm:h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-gray-300 text-4xl sm:text-2xl border border-gray-500 overflow-hidden">
          <img
            src={incident.thumbnailUrl}
            alt={`${incident.type} incident`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling)
                e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className="w-full h-full flex items-center justify-center absolute inset-0 bg-gray-700"
            style={{ display: 'none' }}
          >
            {getTypeIcon(incident.type)}
          </div>
          {(incident.type === 'Gun Threat' || incident.type === 'Weapon Detection') && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-400"></div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="text-white text-xs font-medium">
              {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-5 h-5 rounded-full ${getTypeColor(incident.type)} flex items-center justify-center shadow-sm`}>
                <div className="text-white text-xs">{getTypeIcon(incident.type)}</div>
              </div>
              <span className="text-white font-medium text-sm md:text-base truncate">
                {incident.type}
              </span>
            </div>
            <div className="text-gray-300 text-sm mb-2 flex items-center gap-2">
              <span className="bg-gray-600 p-1 rounded-full w-5 h-5 flex items-center justify-center">📍</span>
              <span className="truncate">{incident.camera.location}</span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-2">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <span className="bg-gray-600 p-1 rounded-full w-5 h-5 flex items-center justify-center">📹</span>CAM - 
              <span>{incident.camera.name}</span>
            </div>

            {/* Resolve button */}
            {showResolveButton && !!onResolve && (
              <button
                onClick={handleResolve}
                disabled={isResolving}
                className={`
                  text-white text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5
                  ${isResolving
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95 shadow-sm'
                  }
                `}
              >
                {isResolving ? (
                  <>
                    <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">✓</span>
                    <span>Resolve</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}