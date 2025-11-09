import { useEffect, useState } from "react";
import type { JSX } from "react";

export default function Mission(): JSX.Element {
    const totalSlides = 4;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 5000); // 5 seconds per image
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hero min-h-[90vh] bg-gray-100 text-black py-12 px-6">
            <div className="hero-content flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-7xl mx-auto">
                {/* Image Slideshow (Now on the LEFT) */}
                <div className="relative w-full lg:w-3/8 aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    {[...Array(totalSlides)].map((_, i) => (
                        <img
                            key={i}
                            src={`/assets/mission${i + 1}.jpg`}
                            alt={`Mission ${i + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                i === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))}
                </div>

                {/* Text Section (Now on the RIGHT) */}
                <div className="max-w-xl text-center lg:text-left">
                    <h1 className="text-4xl font-bold mb-6 text-gray-700">
                        Our Mission
                    </h1>

                    <p className="text-lg leading-relaxed">
                        By creating an accessible, data-driven tracking platform,
                        we aim to improve awareness and response to Panama disease globally.
                        Through our mapping tool, we aim to make information about Tropical Race 4
                        (TR4) transparent and accessible. By enabling users to contribute real-time
                        data, researchers, farmers, and policymakers can better monitor the spread of
                        the disease and coordinate efforts to contain it, which will protect banana
                        production worldwide.
                    </p>
                </div>
            </div>
        </div>
    );
}
