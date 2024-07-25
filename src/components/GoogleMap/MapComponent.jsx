import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";

export default function MapComponent() {
	const { selectedPlacesMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
	const [locations, setLocations] = useState([]);
	const [googleMapsApiKey, setGoogleMapsApiKey] = useState(null);

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

	useEffect(() => {
		setGoogleMapsApiKey(getGoogleMapsApiKey());
	}, []);
	const mapStyles = {
		height: "400px",
		width: "100%",
	};

	return (
		googleMapsApiKey && (
			<LoadScript
				// googleMapsApiKey={"AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs"} // old api key
				// googleMapsApiKey={"AIzaSyDUaku8pBeUW6ZpujduxBiKpsdCZmgrzv0"} // new api key
				// googleMapsApiKey="AIzaSyCNtIajO-Xwpocu9ARrah2khQF-tG8vWok" // my api key //
				googleMapsApiKey={googleMapsApiKey} // generic
			>
				<GoogleMap
					mapContainerStyle={mapStyles}
					zoom={12}
					center={locations[locations.length - 1]}
				>
					{locations.map((location, index) => (
						<Marker key={index} position={location} />
					))}
				</GoogleMap>
			</LoadScript>
		)
	);
}
