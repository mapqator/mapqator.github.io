import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	GoogleMap,
	LoadScript,
	Marker,
	PolylineF,
} from "@react-google-maps/api";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

const POLYLINE_OPTIONS = {
	strokeColor: "#0F53FF",
	strokeOpacity: 0.9,
	strokeWeight: 5,
	clickable: true,
};

function decodePolyline(polylineStr) {
	let index = 0,
		lat = 0,
		lng = 0;
	const coordinates = [];
	const changes = { latitude: 0, longitude: 0 };

	while (index < polylineStr.length) {
		// Decode latitude and longitude alternately
		for (const unit of ["latitude", "longitude"]) {
			let shift = 0;
			let result = 0;

			while (index < polylineStr.length) {
				let byte = polylineStr.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
				if (byte < 0x20) break; // Break out of loop when byte is less than 0x20
			}

			changes[unit] = result & 1 ? ~(result >> 1) : result >> 1;
		}

		lat += changes.latitude;
		lng += changes.longitude;

		// Append the decoded lat/lng to the coordinates array
		coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
	}

	return coordinates;
}

export default function RoutePlacesComponent({
	height,
	places,
	encodedPolyline,
}) {
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
		places.map((place) => {
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		setLocations(list);
	}, [places]);

	const coords = useMemo(() => {
		if (encodedPolyline) {
			return decodePolyline(encodedPolyline);
		}
		return [];
	}, [encodedPolyline]);

	console.log("RoutePlacesComponent: ", coords);

	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const mapRef = useRef(null);
	const [polylineOptions, setPolylineOptions] = useState(
		JSON.stringify(POLYLINE_OPTIONS)
	);

	const adjustBounds = () => {
		if (mapRef.current) {
			const bounds = new window.google.maps.LatLngBounds();
			locations.forEach((coord) => {
				bounds.extend(coord);
			});
			coords.forEach((coord) => {
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
	}, [locations, coords]);
	const po = useMemo(() => {
		try {
			return JSON.parse(polylineOptions);
		} catch (e) {
			return POLYLINE_OPTIONS;
		}
	}, [polylineOptions]);

	// Define the custom icon with the desired color
	const customIcon = {
		url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // URL to the custom icon
		scaledSize: new window.google.maps.Size(32, 32), // Size of the icon
	};
	const blueIcon = {
		url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
		scaledSize: new window.google.maps.Size(32, 32),
	};

	// Define predefined symbols
	const circleSymbol = {
		path: window.google.maps.SymbolPath.CIRCLE,
		scale: 5,
		fillColor: "#0F53FF",
		fillOpacity: 0.8,
		strokeWeight: 2,
		strokeColor: "#0000FF",
	};

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
				<Marker position={coords[0]} icon={circleSymbol} />
				<Marker
					position={coords[coords.length - 1]}
					icon={circleSymbol}
				/>
				<PolylineF path={coords} options={po} />
			</GoogleMap>
		)
	);
}
