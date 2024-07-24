import { AppContext } from "@/contexts/AppContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";

export default function MapComponent() {
	const { selectedPlacesMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);

	const [locations, setLocations] = useState([]);

	useEffect(() => {
		const list = [];
		Object.keys(selectedPlacesMap).map((place_id) => {
			const place = savedPlacesMap[place_id];
			const lat =
				typeof place.geometry?.location.lat === "function"
					? place.geometry?.location.lat()
					: place.geometry?.location.lat;
			const lng =
				typeof place.geometry?.location.lng === "function"
					? place.geometry?.location.lng()
					: place.geometry?.location.lng;
			list.push({ lat, lng });
		});
		console.log(list);
		setLocations(list);
	}, [selectedPlacesMap]);
	const mapStyles = {
		height: "400px",
		width: "100%",
	};
	const defaultCenter = {
		lat: 0,
		lng: 0,
	};
	return (
		<LoadScript
			googleMapsApiKey={"AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs"}
		>
			<GoogleMap
				mapContainerStyle={mapStyles}
				zoom={2}
				center={defaultCenter}
			>
				{locations.map((location, index) => (
					<Marker
						key={index}
						position={{ lat: location[0], lng: location[1] }}
					/>
				))}
			</GoogleMap>
		</LoadScript>
	);
}
