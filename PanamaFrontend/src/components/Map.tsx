import { WorldMap } from "./WorldMap.tsx";
import type { JSX } from "react";
import { useEffect, useState } from "react";

interface ReportDto {
    id: number;
    country: string;
    // add other fields if needed
}

export default function Map(): JSX.Element {
    const [reports, setReports] = useState<ReportDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch("http://panamabackend-production.up.railway.app/api/reports");
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: ReportDto[] = await response.json();
                setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    // Compute dynamic numbers
    const activeOutbreaks = reports.length;
    const countriesAffected = new Set(reports.map(r => r.country)).size;

    return (
        <section className="bg-teal py-12 flex justify-center">
            <div className="max-w-5xl w-full px-6">
                <h2 className="text-4xl font-semibold text-yellow-500 mb-6 text-center">
                    Global Coverage Map
                </h2>

                <div className="text-white text-md mb-6 opacity-90 text-center">
                    {loading
                        ? "Loading data..."
                        : `Active Outbreaks: ${activeOutbreaks} | Countries Affected: ${countriesAffected}`}
                </div>

                <div className="border-2 border-gray-300 rounded-lg overflow-auto flex justify-center items-center mx-auto max-w-full shadow-md">
                    <WorldMap />
                </div>
            </div>
        </section>
    );
}