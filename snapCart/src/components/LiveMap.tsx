/* import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
 */

///Never import leaflet or react-leaflet normally in Next.js App Router ]
// Because Leaflet uses window, and the server doesn’t have window.
//it uses window → load it inside useEffect or dynamic(..., { ssr:false }) as below
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false },
);
interface ILocation {
  latitude: number;
  longitude: number;
}
interface LProps {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

const LiveMap = ({ userLocation, deliveryBoyLocation }: LProps) => {
  const [icons, setIcons] = useState<any>(null);
  useEffect(() => {
    import("leaflet").then((L) => {
      setIcons({
        userIcon: new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/128/9502/9502529.png",
          iconSize: [45, 45],
        }),
        deliveryBoyIcon: new L.Icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
          iconSize: [45, 45],
        }),
      });
    });
  }, []);

  if (!icons) return null; // ⛔ wait for client

  const center = [userLocation.latitude, userLocation.longitude];
  const linePosition =
    userLocation && deliveryBoyLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  function Recenter({ positions }: { positions: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (positions[0] !== 0 && positions[1] !== 0) {
        map.setView(positions, map.getZoom(), {
          animate: true,
        });
      }
    }, [, positions, map]);

    return null;
  }

  return (
    <div className="relative w-full h-125 rounded-xl overflow-hidden shadow z-2">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full rounded-xl"
      >
        <Recenter positions={center as any} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="h-0.5"
        />
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={icons.userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>
        {deliveryBoyLocation && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={icons.deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        <Polyline positions={linePosition as any} color="green" />
      </MapContainer>
    </div>
  );
};

export default LiveMap;
