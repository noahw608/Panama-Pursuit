import { WorldMap } from "./WorldMap.tsx";
import type { JSX } from "react";

export default function Map(): JSX.Element {
    return (
        <section className="bg-teal py-12 flex justify-center">
            <div className="max-w-5xl w-full px-6">
                <h2 className="text-4xl font-semibold text-yellow-500 mb-6 text-center">
                    Global Coverage Map
                </h2>

                 <div className="text-[#F9F9F9] text-md mb-6 opacity-90 text-center">
                        Active Outbreaks: 42 | Countries Affected: 12
                </div>

                <div className="border-2 border-gray-300 rounded-lg overflow-auto flex justify-center items-center mx-auto max-w-full shadow-md">
                    <WorldMap />
                </div>
            </div>
        </section>
    );
}