import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
    iconUrl: '/assets/icon.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -20],
});

// backend DTO
interface ReportDto {
    id: number;
    name?: string;
    email: string;
    country: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    imageBase64?: string;
}

export const WorldMap: React.FC = () => {
    const [reports, setReports] = useState<ReportDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch('http://localhost:5070/api/reports');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
            style={{ width: '75vw', height: '75vh' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />

            {!loading &&
                reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[Number(report.latitude), Number(report.longitude)]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div style={{textAlign: 'center', minWidth: '150px'}}>
                                <strong>Panama Disease Report</strong>
                                <p>Location: {report.country}<br/>({report.longitude}, {report.latitude})</p>
                                <p>Reported: {new Date(report.createdAt).toLocaleString()}</p>
                                <button className="btn btn-primary">More</button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
};