'use client';

import { useState, useEffect, useRef } from 'react';

const CAMERA_LIST = [
  { id: 1, name: 'Shop Floor A', location: 'Main Production Area' },
  { id: 2, name: 'Vault', location: 'Secure Storage Room' },
  { id: 3, name: 'Main Entrance', location: 'Front Door Security' },
  { id: 4, name: 'Parking Lot', location: 'Outdoor Surveillance' }
];

export default function IncidentPlayer({ incident, loading, incidents = [], onIncidentSelect }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(50);

  const progressRef = useRef(null);
  const playerRef = useRef(null);
  const volumeRef = useRef(null);
  const [showVolume, setShowVolume] = useState(false);

  // Sync player state when selected incident changes
  useEffect(() => {
    if (incident) {
      const tsStart = new Date(incident.tsStart);
      const tsEnd = new Date(incident.tsEnd);
      setDuration(Math.round((tsEnd - tsStart) / 1000));
      setCurrentTime(0);
      setIsPlaying(true);
    }
  }, [incident]);

  // Video playback logic
  useEffect(() => {
    if (!isPlaying) return;
    if (currentTime >= duration) return;
    
    const interval = setInterval(() => {
      setCurrentTime(time => {
        if (time + 1 >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return time + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const formatTime = secs => {
    const mins = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${mins}:${s}`;
  };

  const scrubTo = e => {
    const bar = progressRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const percent = Math.min(Math.max(x / rect.width, 0), 1);
    setCurrentTime(Math.floor(percent * duration));
  };

  const handlePlayPause = () => {
    if (currentTime >= duration) setCurrentTime(0);
    setIsPlaying(p => !p);
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => 
        console.error(`Error enabling fullscreen: ${err.message}`)
      );
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 50);
  };

  const handleCameraSwitch = (cameraId) => {
    const cameraIncidents = incidents.filter(inc => inc.camera.id === cameraId);
    if (cameraIncidents.length === 0) return;
    
    const latestIncident = cameraIncidents.reduce((latest, current) => 
      new Date(current.tsStart) > new Date(latest.tsStart) ? current : latest
    );
    
    if (latestIncident && onIncidentSelect) {
      onIncidentSelect(latestIncident);
    }
  };

  const getCameraShortName = (name) => 
    name.split(' ').map(word => word[0]).join('').toUpperCase();

  if (loading) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 h-full flex items-center justify-center border border-gray-700 shadow-lg">
        <div className="text-center space-y-4">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <div className="text-gray-300 text-lg font-medium">Loading incident footage...</div>
          <p className="text-gray-500 text-sm">Preparing camera feeds</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col border border-gray-700 shadow-lg">
        <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-600 p-2 rounded-lg">🎥</span>
          Incident Player
        </h2>
        <div className="bg-gray-900/50 rounded-xl flex-1 flex items-center justify-center border-2 border-dashed border-gray-700">
          <div className="text-center p-6">
            <div className="text-6xl mb-4 text-gray-600">📹</div>
            <h3 className="text-gray-300 text-lg font-medium mb-2">No Incident Selected</h3>
            <p className="text-gray-500">Please select an incident from the list to view details</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedCamera = CAMERA_LIST.find(cam => cam.id === incident.camera.id) || incident.camera;
  const incidentStart = new Date(incident.tsStart);
  const relativeTime = new Date(incidentStart.getTime() + currentTime * 1000);

  const videoTime = relativeTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 md:p-6 h-full flex flex-col border border-gray-700 shadow-lg ${
      isFullscreen ? 'fixed inset-0 z-50 p-0 m-0 !rounded-none' : ''
    }`}>
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <h2 className="text-white text-xl font-bold flex items-center gap-2">
            <span className={`p-2 rounded-lg ${
              incident.type === 'Gun Threat' || incident.type === 'Weapon Detection' 
                ? 'bg-red-600' 
                : 'bg-blue-600'
            }`}>
              {incident.type === 'Gun Threat' ? '🔫' : 
               incident.type === 'Weapon Detection' ? '⚔️' : '🎥'}
            </span>
            {incident.type} - {selectedCamera.name}
          </h2>
          
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-900/60 text-blue-300 flex items-center gap-1">
              <span>⏱️</span>
              <span>{videoTime}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 bg-gray-900/60 px-3 py-1.5 rounded-full text-sm text-gray-300">
            <span className="text-blue-400">📹CAM - </span>
            {selectedCamera.name}
          </span>
          <span className="flex items-center gap-2 bg-gray-900/60 px-3 py-1.5 rounded-full text-sm text-gray-300">
            <span className="text-blue-400">📍</span>
            {selectedCamera.location}
          </span>
        </div>
      </div>

      {/* Video Area */}
      <div
        ref={playerRef}
        className={`relative bg-black rounded-xl flex-1 mb-4 flex flex-col border border-gray-700 overflow-hidden transition-all duration-300 ${
          isFullscreen ? '!rounded-none' : ''
        }`}
      >
        {/* Video content */}
        <div className="flex-1 flex items-center justify-center relative">
          {incident.thumbnailUrl ? (
            <img
              src={incident.thumbnailUrl}
              alt={selectedCamera.name}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              onError={(e) => (e.target.style.display = 'none')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-7xl text-gray-700">
              📹
            </div>
          )}
          
          {/* Overlay controls */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={handlePlayPause}
              className={`p-4 rounded-full bg-black/50 backdrop-blur-sm transition-all ${
                isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
              }`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="text-4xl text-white">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
            </button>
          </div>
        </div>

        {/* Timeline controls */}
        <div className="bg-gray-900/80 backdrop-blur-sm px-4 py-3 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-blue-400 transition-colors text-lg"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <span className="text-xs text-gray-400 w-12">{formatTime(currentTime)}</span>
            
            <div
              className="flex-1 relative group h-3 flex items-center"
              ref={progressRef}
              onClick={scrubTo}
              onTouchStart={scrubTo}
            >
              <div className="w-full h-1 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-blue-500 group-hover:scale-125 transition-transform"></div>
                </div>
              </div>
            </div>
            
            <span className="text-xs text-gray-400 w-12">{formatTime(duration)}</span>
            
            <div className="relative">
              <button 
                onClick={() => setShowVolume(!showVolume)}
                className="text-white hover:text-blue-400 transition-colors text-lg"
                title="Volume control"
              >
                {volume > 0 ? '🔊' : '🔇'}
              </button>
              {showVolume && (
                <div 
                  ref={volumeRef}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-gray-800 rounded-lg p-3 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
            
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-blue-400 transition-colors text-lg"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? '⛶' : '⛶'}
            </button>
          </div>
        </div>
      </div>

      {/* Camera Strip */}
      <div className="mt-4">
        <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
          <span>📡</span>
          Cameras:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CAMERA_LIST.map((camera, idx) => {
            const isActive = incident && incident.camera.id === camera.id;
            
            return (
              <button
                key={camera.id}
                onClick={() => handleCameraSwitch(camera.id)}
                disabled={!isActive}
                className={`
                  relative h-14 rounded-lg flex flex-col items-center justify-center
                  text-xs font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600/90 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  }
                `}
                title={`${camera.name} - ${camera.location}`}
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className="text-lg font-bold mb-0.5">
                    CAM-{idx + 1}
                  </div>
                  <div className="text-[10px]">
                    {isActive ? 'ACTIVE' : 'No footage available for this incident at exact time stamp'}
                  </div>
                </div>
                
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  isActive ? 'bg-blue-400 shadow-sm shadow-blue-400' : 'bg-gray-500'
                }`}></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}