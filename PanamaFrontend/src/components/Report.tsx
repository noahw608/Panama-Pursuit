import { useForm, Controller } from "react-hook-form";
import {type JSX, useState} from "react";
import {Square, SquareCheck} from "lucide-react";

interface ReportFormData {
    name: string;
    email: string;
    latitude: number | null;
    longitude: number | null;
    country: string | null;
    image: File | null;
}

export default function Report(): JSX.Element {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors }
    } = useForm<ReportFormData>({
        defaultValues: {
            name: "",
            email: "",
            latitude: null,
            longitude: null,
            country: null,
            image: null,
        }
    });
    const [locationStatus, setLocationStatus] = useState<boolean>(false);

    const onSubmit = async (data: ReportFormData) => {
        let country = data.country;

        // If country isn't set yet but lat/lng exist, fetch it
        if ((!country) && data.latitude && data.longitude) {
            country = await fetchCountryFromCoords(data.latitude, data.longitude);
        }

        const payload = {
            ...data,
            country, // now guaranteed to be set
        };


        // Create FormData to handle file upload
        const formData = new FormData();
        formData.append("Name", data.name || "");
        formData.append("Email", data.email || "");
        formData.append("Country", data.country || "");
        formData.append("Latitude", data.latitude?.toString() || "0");
        formData.append("Longitude", data.longitude?.toString() || "0");
        if (data.image) {
            formData.append("Image", data.image);
        }

        try {
            const response = await fetch("https://panamabackend-production.up.railway.app/api/reports", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("Report submitted successfully:", result);
            alert("Report submitted successfully!");
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report. Please try again.");
        }

        console.log("Report Submitted:", payload);
        // send payload to backend
    };

    const handleLocation = async () => {

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setValue("latitude", latitude);
                setValue("longitude", longitude);

                fetchCountryFromCoords(latitude, longitude).then((country) => {
                    if (country) {
                        console.log("Detected country:", country);
                        setValue("country", country);
                    }
                    setLocationStatus(true);
                });

                setLocationStatus(true);
            },
            (err) => {
                alert("Unable to retrieve location.");
                console.error(err);
            }
        );
    };

    const fetchCountryFromCoords = async (lat: number, lng: number): Promise<string | null> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            return data.address?.country || null;
        } catch (error) {
            console.error("Error fetching country:", error);
            return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex justify-center items-start py-10 px-4 text-gray-900">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-200 p-6">

                <h2 className="text-4xl font-semibold text-gray-900 mb-6 border-b-4 border-yellow-400 pb-2">
                    Disease Report
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none bg-white text-gray-900"
                            {...register("name", { required: true })}
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1">Name is required.</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none bg-white text-gray-900"
                            {...register("email", { required: true })}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">Email is required.</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={handleLocation}
                            className="w-[90%] px-4 py-1 bg-gray-300 text-white rounded-lg font-medium hover:bg-gray-200 transition"
                        >
                            Use My Location
                        </button>

                        <div className="flex-shrink-0">
                            {locationStatus ? (
                                <SquareCheck className="text-teal" size={54} />
                            ) : (
                                <Square className="text-gray-300" size={54} />
                            )}
                        </div>
                    </div>

                    <div>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        field.onChange(file);
                                    }}
                                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-white font-bold rounded-lg transition"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}