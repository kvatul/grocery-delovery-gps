"use client";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"; //, Marker, Popup
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

type props = {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
};
function CheckOutMap({ position, setPosition }: props) {
  const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [40, 20],
  });

  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression, 15, { animate: true });
    }, [map, position]);

    return (
      <Marker
        position={position as LatLngExpression}
        icon={markerIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const marker = e.target as L.Marker;
            const { lat, lng } = marker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      />
    );
  };

  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="h-0.5"
      />
      <DraggableMarker />
    </MapContainer>
  );
}

export default CheckOutMap;
