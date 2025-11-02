// src/components/MapWidgetInteractive.jsx
import React, { useMemo } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

export default function MapWidgetInteractive({
  center = { lat: 13.0827, lng: 80.2707 }, // Chennai
  zoom = 11,
  markers,
  mapHeight = 320,
  mapMaxWidth = 900
}) {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const fallbackMarkers = useMemo(() => ([
    { id: 'adyar', position: { lat: 13.0067, lng: 80.2570 } },     // Adyar
    { id: 'velachery', position: { lat: 12.9784, lng: 80.2214 } }, // Velachery
    { id: 'parrys', position: { lat: 13.0900, lng: 80.2875 } },    // Parrys Corner
  ]), []);

  const shownMarkers = markers && markers.length ? markers : fallbackMarkers;

  if (loadError) {
    return <div className="text-sm text-red-500">Map failed to load.</div>;
  }
  if (!isLoaded) {
    return <div className="text-sm text-amber-800">Loading map…</div>;
  }

  // --- build the SVG marker you provided as a data URL ---
  const rawSvg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#8B4513" stroke="#654321" stroke-width="2"/>
      <circle cx="20" cy="20" r="8" fill="#D2691E"/>
      <circle cx="20" cy="20" r="4" fill="#FFF"/>
    </svg>
  `;

  const dataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(rawSvg)}`;

  // Create the icon object using Maps Size/Point constructors so sizing/anchor are correct.
  // These constructors are available because isLoaded === true.
  const xIcon = {
    url: dataUrl,
    // scaledSize controls how the icon is scaled visually (set to 36x36 for crispness)
    scaledSize: new window.google.maps.Size(36, 36),
    size: new window.google.maps.Size(40, 40),
    // anchor the icon so the bottom center of the circle sits on the marker position
    anchor: new window.google.maps.Point(20, 36),
  };

  const handleMarkerClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className="w-full flex justify-center my-4">
      <div style={{ width: '100%', maxWidth: mapMaxWidth, borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 30px rgba(2,6,23,0.06)' }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: `${mapHeight}px` }}
          center={center}
          zoom={zoom}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: true,
          }}
        >
          {shownMarkers.map(m => (
            <Marker
              key={m.id}
              position={m.position}
              icon={xIcon}
              onClick={handleMarkerClick}
              title="Login to view artisan"
              optimized={false}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}
