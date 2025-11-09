import { useEffect, useState } from "react";
import type { JSX } from "react";

export default function History(): JSX.Element {
    const totalSlides = 4;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // 3 seconds per image
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hero min-h-[60vh] bg-yellow-100 text-[#333333] py-12 px-6">
            <div className="hero-content flex-col lg:flex-row-reverse items-center justify-between gap-12 w-full max-w-7xl mx-auto">
                {/* Image Slideshow */}
                <div className="relative w-full lg:w-3/8 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    {[...Array(totalSlides)].map((_, i) => (
                        <img
                            key={i}
                            src={`/assets/banana${i + 1}.jpg`}
                            alt={`Banana ${i + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                i === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                </div>

                {/* Text Section */}
                <div className="max-w-xl text-center lg:text-left">
                    <h1 className="text-4xl font-bold mb-6 text-[#eab308]">
                        Bananas No More?
                    </h1>

                    <p className="text-lg leading-relaxed">
                        Panama disease is a fungal infection caused by{" "}
                        <em>Fusarium oxysporum</em> f. sp. <em>cubense</em>, which
                        devastated banana plantations in the early 1900s, wiping out
                        the once dominant Gros Michel variety. The Cavendish variety
                        took its place and remained resistant until the emergence of
                        Tropical Race 4 (TR4) in the 1990s. Originating in Southeast
                        Asia, TR4 has rapidly spread to plantations globally and now
                        threatens worldwide banana production, with no known cure and
                        the ability to persist in soil for decades.
                    </p>
                </div>
            </div>
        </div>
    );
}
