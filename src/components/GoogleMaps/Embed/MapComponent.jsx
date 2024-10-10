import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useRef, useState } from "react";

export default function MapComponent({ locations, height, zoom }) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const mapRef = useRef(null);
	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			locations.forEach((coord) => {
				bounds.extend(coord);
			});
			mapRef.current.fitBounds(bounds);
		}
	};
	const onLoad = (map) => {
		mapRef.current = map;
		adjustBounds();
	};
	useEffect(() => {
		adjustBounds(); // Recenter and adjust zoom whenever coords change
	}, [locations]);
	return (
		locations.length > 0 && (
			<GoogleMap
				mapContainerStyle={mapStyles}
				// zoom={zoom || 12}
				// center={locations[locations.length - 1]}
				onLoad={onLoad}
				options={{ disableDefaultUI: true }}
			>
				{locations.map((location, index) => (
					<Marker key={index} position={location} />
				))}
			</GoogleMap>
		)
	);
}
