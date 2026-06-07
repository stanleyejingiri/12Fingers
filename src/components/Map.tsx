import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { WorkerProfile } from '@/types/worker';

interface MapProps {
  workers: WorkerProfile[];
  userLocation?: [number, number];
}

const Map = ({ workers, userLocation }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: userLocation || [-74.5, 40],
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for workers
    workers.forEach((worker) => {
      if (worker.location) {
        const el = document.createElement('div');
        el.className = 'worker-marker';
        el.innerHTML = '👷';
        el.style.fontSize = '24px';
        el.style.cursor = 'pointer';

        new mapboxgl.Marker(el)
          .setLngLat([worker.location.longitude, worker.location.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<h3 class="text-lg font-bold">${worker.name}</h3>
                <p>${worker.category}</p>
                <p>$${worker.hourlyRate}/hour</p>`
              )
          )
          .addTo(map.current);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [workers, userLocation, mapboxToken]);

  return (
    <div className="space-y-4">
      {!mapboxToken && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please enter your Mapbox public token to view the map:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter Mapbox public token..."
          />
          <p className="text-xs text-gray-500 mt-1">
            You can find your token at https://mapbox.com/ in the Tokens section of your dashboard
          </p>
        </div>
      )}
      <div ref={mapContainer} className="h-[400px] rounded-lg shadow-lg" />
    </div>
  );
};

export default Map;