import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import iconUrl from '../assets/icon.png';

interface Report {
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
}

// Sample data
const reports: Report[] = [
    { id: 1, latitude: 40.7128, longitude: -74.006, title: 'Report 1', description: 'Some info' },
    { id: 2, latitude: 51.5074, longitude: -0.1278, title: 'Report 2', description: 'Other info' },
];

// Optional: Custom marker icon
const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconSize: [25, 25],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

export const WorldMap: React.FC = () => {
    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}           // initial zoom
            minZoom={2}        // cannot zoom out further
            // maxZoom={2}        // cannot zoom in
            style={{ width: '75vw', height: '75vh' }}
            maxBounds={[[ -90, -180 ], [ 90, 180 ]]} // world bounds
            maxBoundsViscosity={1.0}
        >
            {/* OpenStreetMap tiles */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />

            {/* Add markers */}
            {reports.map(report => (
                <Marker
                    key={report.id}
                    position={[report.latitude, report.longitude]}
                    icon={customIcon}
                >
                    <Popup>
                        <strong>{report.title}</strong>
                        <p>{report.description}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};