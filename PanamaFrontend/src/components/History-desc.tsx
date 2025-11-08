import type { JSX } from "react";

export default function History(): JSX.Element {
    return (
        <div className="flex flex-col md:flex-row items-start justify-between my-8 gap-8">
            <div className="md:w-1/2 text-[#333333] mx-4">
                <h1 className="text-2xl font-bold mb-4">History of the Problem</h1>
                <p>
                    Panama disease is a fungal infection caused by Fusarium oxysporum f. Sp. cubense, which devastated
                    banana plantations in the early 1900s, wiping out the once dominant Gros Michel variety. The
                    Cavendish variety took its place at the top, and remained resistant until the emergence of Tropical
                    Race 4 (TR4) in the 1990s. Originating in Southeast Asia, TR4 has rapidly spread to plantations
                    globally and now threatens worldwide banana production, with no known cure and the ability to persist
                    in soil for decades.
                </p>
            </div>
            <div className="md:w-1/2 w-full max-h-[300px] max-w-[300px] carousel rounded-box overflow-hidden mx-6">
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana1.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana2.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana3.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana4.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana5.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana6.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana7.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
                <div className="carousel-item w-full h-full">
                    <img
                        src="/assets/banana8.svg"
                        className="w-full h-full object-cover rounded-lg"
                        alt="Tailwind CSS Carousel component"
                    />
                </div>
            </div>
        </div>
    );
}