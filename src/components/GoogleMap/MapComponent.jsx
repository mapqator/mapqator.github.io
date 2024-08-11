import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";

export default function MapComponent() {
	const { selectedPlacesMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
	const [locations, setLocations] = useState([]);
	const [googleMapsApiKey, setGoogleMapsApiKey] = useState(undefined);
	const { isAuthenticated } = useAuth();
	useEffect(() => {
		const key = getGoogleMapsApiKey();
		setGoogleMapsApiKey(key);
	}, [isAuthenticated]);

	useEffect(() => {
		const list = [];
		Object.keys(selectedPlacesMap).map((place_id) => {
			const place = savedPlacesMap[place_id];
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		console.log(list);
		setLocations(list);
	}, [selectedPlacesMap]);

	const mapStyles = {
		height: "400px",
		width: "100%",
	};

	return (
		locations.length > 0 && (
			<GoogleMap
				mapContainerStyle={mapStyles}
				zoom={12}
				center={locations[locations.length - 1]}
			>
				{locations.map((location, index) => (
					<Marker key={index} position={location} />
				))}
			</GoogleMap>
		)
	);
}
