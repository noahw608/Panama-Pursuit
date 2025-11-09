import React, { useEffect, useState } from "react";

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

export const Table: React.FC = () => {
    const [reports, setReports] = useState<ReportDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://panamabackend-production.up.railway.app/api/reports");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <section className="bg-yellow-100 py-12 flex justify-center">
            <div className="max-w-6xl w-full px-6">
                <h2 className="text-4xl font-semibold text-gray-700 mb-6 text-center">
                    Panama Disease Reports
                </h2>

                <div className="overflow-x-auto max-h-[600px] border border-gray-300 rounded-lg shadow-md bg-white">
                    <table className="table w-full table-auto text-black">
                        <thead className="bg-gray-200 sticky top-0 text-black">
                        <tr>
                            <th className="text-left">ID</th>
                            <th className="text-left">Reporter</th>
                            <th className="text-left">Email</th>
                            <th className="text-left">Country</th>
                            <th className="text-left">Latitude</th>
                            <th className="text-left">Longitude</th>
                            <th className="text-left">Reported At</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : reports.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    No reports found.
                                </td>
                            </tr>
                        ) : (
                            reports.map((report, idx) => (
                                <tr
                                    key={report.id}
                                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                >
                                    <td>{report.id}</td>
                                    <td>{report.name || "Anonymous"}</td>
                                    <td>{report.email}</td>
                                    <td>{report.country}</td>
                                    <td>{report.latitude}</td>
                                    <td>{report.longitude}</td>
                                    <td>{new Date(report.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Table;