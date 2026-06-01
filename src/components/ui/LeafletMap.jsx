import React, { useEffect, useRef } from "react";
import L from "leaflet";

// Leaflet default marker icon fix for bundlers like Vite
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export const LeafletMap = ({ latitude, longitude, onChange, interactive = true }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = Number(latitude) || 27.7172;
    const initialLng = Number(longitude) || 85.3240;

    // Create map instance
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);
    mapRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create marker
    const marker = L.marker([initialLat, initialLng], {
      draggable: interactive,
    }).addTo(map);
    markerRef.current = marker;

    if (interactive && onChange) {
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onChange(position.lat.toFixed(6), position.lng.toFixed(6));
      });

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onChange(lat.toFixed(6), lng.toFixed(6));
      });
    } else {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    }

    return () => {
      map.remove();
    };
  }, []);

  // Update map and marker when latitude or longitude changes from outside
  useEffect(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) return;

    if (mapRef.current && markerRef.current) {
      const currentLatLng = markerRef.current.getLatLng();
      if (currentLatLng.lat.toFixed(6) !== lat.toFixed(6) || currentLatLng.lng.toFixed(6) !== lng.toFixed(6)) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.panTo([lat, lng]);
      }
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-none overflow-hidden relative z-0"
    />
  );
};
