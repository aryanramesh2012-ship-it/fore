
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type ForestMapProps = {
  className?: string;
};

const incidents = [
  {
    name: "Sample forest incident",
    location: "Tamil Nadu",
    lat: 11.0168,
    lng: 76.9558,
    description: "Illustrative incident for testing the map.",
  },
  {
    name: "Sample forest alert",
    location: "Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    description: "Illustrative alert for testing the map.",
  },
  {
    name: "Sample monitoring report",
    location: "Kerala",
    lat: 10.8505,
    lng: 76.2711,
    description: "Illustrative report for testing the map.",
  },
];

export default function ForestMap({
  className = "",
}: ForestMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapElement.current || mapInstance.current) return;

    const map = L.map(mapElement.current, {
      center: [22.5, 79],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    incidents.forEach((incident) => {
      const marker = L.circleMarker(
        [incident.lat, incident.lng],
        {
          radius: 8,
          color: "#b8f36b",
          weight: 2,
          fillColor: "#294d2b",
          fillOpacity: 0.95,
        }
      ).addTo(map);

      marker.bindPopup(`
        <strong>${incident.name}</strong>
        <br />
        ${incident.location}
        <br />
        <small>${incident.description}</small>
      `);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={mapElement}
      className={className}
      style={{
        width: "100%",
        height: "480px",
        minHeight: "320px",
        borderRadius: "14px",
        overflow: "hidden",
        background: "#15251c",
      }}
      aria-label="Interactive map of India with sample forest incident markers"
    />
  );
}
