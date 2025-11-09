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
    const [selectedReport, setSelectedReport] = useState<ReportDto | null>(null);

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
        <>
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
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            setSelectedReport(report);
                                            (document.getElementById('reportModal') as HTMLDialogElement)?.showModal();
                                        }}
                                    >
                                        More
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
            <dialog id="reportModal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box w-11.5/12 max-w-4xl bg-white text-black">
                    {selectedReport && (
                        <>
                            <h3 className="text-xl font-bold mb-3 text-center">
                                Report #{selectedReport.id} - {selectedReport.country}
                            </h3>
                            {/* Hero Section with Image or Placeholder */}
                            <div className="hero rounded-lg mb-4 ">
                                <div className="hero-content flex-col lg:flex-row">
                                    <div className="flex-1 bg-gray-200 flex items-center justify-center rounded-lg mx-2 overflow-hidden min-h-[200px] max-h-95">
                                        <img
                                            src={selectedReport.imageBase64 ? "data:image/jpeg;base64," + selectedReport.imageBase64 : "/assets/banana2.jpg"}
                                            alt="Report"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="">
                                            <strong>Reporter:</strong> {selectedReport.name || 'Anonymous'}
                                        </p>
                                        <p className="py-2">
                                            <strong>Email:</strong> {selectedReport.email}
                                        </p>
                                        <p>
                                            <strong>Coordinates:</strong> ({selectedReport.latitude}, {selectedReport.longitude})
                                        </p>
                                        <p>
                                            <strong>Reported At:</strong>{' '}
                                            {new Date(selectedReport.createdAt).toLocaleString()}
                                        </p>
                                        {/* Mini map showing report location */}
                                        <div className="mt-4 w-full h-64 rounded-lg overflow-hidden border border-gray-300 shadow">
                                            <MapContainer
                                                center={[Number(selectedReport.latitude), Number(selectedReport.longitude)]}
                                                zoom={6}
                                                scrollWheelZoom={false}
                                                dragging={false}
                                                doubleClickZoom={false}
                                                zoomControl={false}
                                                style={{ height: '100%', width: '100%' }}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                                                />
                                                <Marker
                                                    position={[Number(selectedReport.latitude), Number(selectedReport.longitude)]}
                                                    icon={new L.Icon({
                                                        iconUrl: '/assets/icon.png',
                                                        iconSize: [25, 25],
                                                        iconAnchor: [12, 25],
                                                        popupAnchor: [0, -20],
                                                    })}
                                                />
                                            </MapContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="modal-action">
                        <form method="dialog">
                            <button
                                className="btn bg-yellow-400 hover:bg-yellow-500 border-none text-black"
                                onClick={() => setSelectedReport(null)}
                            >
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};