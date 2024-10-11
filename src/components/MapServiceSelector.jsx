import React, { useState } from "react";
// import { MapIcon } from "lucide-react";

const mapServices = [
	{ name: "Google Maps", icon: "🌎", image: "/images/google-maps.png" },
	{
		name: "OpenStreetMap",
		icon: "🗺️",
		image: "/images/openstreetmap.logo.png",
	},
	{ name: "TomTom", icon: "🚗", image: "/images/tomtom.png" },
	{ name: "Azure Maps", icon: "☁️", image: "/images/azure-maps.png" },
];

const MapServiceSelector = () => {
	const [selectedService, setSelectedService] = useState(null);

	return (
		<div className="p-4">
			<h2 className="text-2xl font-bold mb-4">Select a Map Service</h2>
			<div className="grid grid-cols-2 gap-4">
				{mapServices.map((service) => (
					<button
						key={service.name}
						className={`p-6 border rounded-lg flex flex-col items-center justify-center transition-colors ${
							selectedService === service.name
								? "bg-blue-500 text-white"
								: "bg-white hover:bg-gray-100"
						}`}
						onClick={() => setSelectedService(service.name)}
					>
						{/* <span className="text-4xl mb-2">{service.icon}</span> */}
						<img
							src={service.image}
							alt={service.name}
							className="w-20 h-20 mb-2"
						/>
						<span className="text-lg font-semibold">
							{service.name}
						</span>
					</button>
				))}
			</div>
			{selectedService && (
				<p className="mt-4 text-lg">
					You selected: <strong>{selectedService}</strong>
				</p>
			)}
		</div>
	);
};

export default MapServiceSelector;
