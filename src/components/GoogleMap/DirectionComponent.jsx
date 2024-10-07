import { getGoogleMapsApiKey } from "@/api/base";
import { AppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	GoogleMap,
	LoadScript,
	Marker,
	DirectionsRenderer,
	DirectionsService,
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

export default function DirectionComponent({ height, zoom, polyline }) {
	const mapStyles = {
		height: height || "400px",
		width: "100%",
	};

	const coords = useMemo(() => {
		if (polyline) {
			return decodePolyline(polyline);
		}
		return [];
	}, [polyline]);

	// console.log(decodePolyline(polyline));
	// const coords = [
	// 	{ lat: 23.75636, lng: 90.3845 },
	// 	{ lat: 23.75692, lng: 90.38445 },
	// 	{ lat: 23.75697, lng: 90.38446 },
	// 	{ lat: 23.75706, lng: 90.38447 },
	// 	{ lat: 23.75764, lng: 90.38449 },
	// 	{ lat: 23.75798, lng: 90.38448 },
	// 	{ lat: 23.7581, lng: 90.38446 },
	// 	{ lat: 23.7581, lng: 90.38425 },
	// 	{ lat: 23.75811, lng: 90.38412 },
	// 	{ lat: 23.7588, lng: 90.3841 },
	// 	{ lat: 23.75882, lng: 90.38439 },
	// 	{ lat: 23.75889, lng: 90.38518 },
	// 	{ lat: 23.75897, lng: 90.38618 },
	// 	{ lat: 23.75903, lng: 90.38796 },
	// 	{ lat: 23.7591, lng: 90.38972 },
	// 	{ lat: 23.75912, lng: 90.38984 },
	// 	{ lat: 23.75892, lng: 90.38989 },
	// 	{ lat: 23.75843, lng: 90.39006 },
	// 	{ lat: 23.75802, lng: 90.39022 },
	// 	{ lat: 23.75735, lng: 90.39047 },
	// 	{ lat: 23.75688, lng: 90.39065 },
	// 	{ lat: 23.75673, lng: 90.39072 },
	// 	{ lat: 23.75614, lng: 90.39096 },
	// 	{ lat: 23.75586, lng: 90.39107 },
	// 	{ lat: 23.75566, lng: 90.39115 },
	// 	{ lat: 23.75547, lng: 90.39122 },
	// 	{ lat: 23.75528, lng: 90.39129 },
	// 	{ lat: 23.75404, lng: 90.39178 },
	// 	{ lat: 23.75384, lng: 90.39186 },
	// 	{ lat: 23.75332, lng: 90.39207 },
	// 	{ lat: 23.75277, lng: 90.3923 },
	// 	{ lat: 23.75222, lng: 90.39251 },
	// 	{ lat: 23.75188, lng: 90.39265 },
	// 	{ lat: 23.75157, lng: 90.39277 },
	// 	{ lat: 23.75138, lng: 90.39284 },
	// 	{ lat: 23.75031, lng: 90.39325 },
	// 	{ lat: 23.75004, lng: 90.39326 },
	// 	{ lat: 23.75002, lng: 90.3933 },
	// 	{ lat: 23.74999, lng: 90.39334 },
	// 	{ lat: 23.74997, lng: 90.39336 },
	// 	{ lat: 23.7499, lng: 90.39339 },
	// 	{ lat: 23.74987, lng: 90.39339 },
	// 	{ lat: 23.74977, lng: 90.39336 },
	// 	{ lat: 23.74952, lng: 90.39346 },
	// 	{ lat: 23.74901, lng: 90.39367 },
	// 	{ lat: 23.74844, lng: 90.39388 },
	// 	{ lat: 23.74775, lng: 90.39411 },
	// 	{ lat: 23.74752, lng: 90.39419 },
	// 	{ lat: 23.74597, lng: 90.39475 },
	// 	{ lat: 23.74588, lng: 90.39478 },
	// 	{ lat: 23.74568, lng: 90.39485 },
	// 	{ lat: 23.74508, lng: 90.39503 },
	// 	{ lat: 23.74455, lng: 90.3952 },
	// 	{ lat: 23.74398, lng: 90.39536 },
	// 	{ lat: 23.74326, lng: 90.39561 },
	// 	{ lat: 23.74281, lng: 90.39574 },
	// 	{ lat: 23.74273, lng: 90.39576 },
	// 	{ lat: 23.74264, lng: 90.39578 },
	// 	{ lat: 23.74244, lng: 90.39583 },
	// 	{ lat: 23.74214, lng: 90.39589 },
	// 	{ lat: 23.74182, lng: 90.39594 },
	// 	{ lat: 23.74148, lng: 90.396 },
	// 	{ lat: 23.74137, lng: 90.39604 },
	// 	{ lat: 23.74127, lng: 90.39605 },
	// 	{ lat: 23.74122, lng: 90.39606 },
	// 	{ lat: 23.74112, lng: 90.39608 },
	// 	{ lat: 23.74082, lng: 90.3961 },
	// 	{ lat: 23.74065, lng: 90.39611 },
	// 	{ lat: 23.7396, lng: 90.39607 },
	// 	{ lat: 23.73945, lng: 90.39606 },
	// 	{ lat: 23.73928, lng: 90.39605 },
	// 	{ lat: 23.73883, lng: 90.39603 },
	// 	{ lat: 23.73866, lng: 90.39601 },
	// 	{ lat: 23.7385, lng: 90.396 },
	// 	{ lat: 23.73815, lng: 90.39593 },
	// 	{ lat: 23.73806, lng: 90.39592 },
	// 	{ lat: 23.7377, lng: 90.39584 },
	// 	{ lat: 23.73702, lng: 90.39569 },
	// 	{ lat: 23.73697, lng: 90.39568 },
	// 	{ lat: 23.73671, lng: 90.39564 },
	// 	{ lat: 23.73645, lng: 90.3956 },
	// 	{ lat: 23.73598, lng: 90.39555 },
	// 	{ lat: 23.7355, lng: 90.39553 },
	// 	{ lat: 23.73496, lng: 90.39551 },
	// 	{ lat: 23.7343, lng: 90.39551 },
	// 	{ lat: 23.73365, lng: 90.39555 },
	// 	{ lat: 23.73302, lng: 90.39565 },
	// 	{ lat: 23.73295, lng: 90.39567 },
	// 	{ lat: 23.73281, lng: 90.39572 },
	// 	{ lat: 23.73273, lng: 90.3958 },
	// 	{ lat: 23.73264, lng: 90.39582 },
	// 	{ lat: 23.73255, lng: 90.39578 },
	// 	{ lat: 23.7325, lng: 90.39573 },
	// 	{ lat: 23.73249, lng: 90.3957 },
	// 	{ lat: 23.73247, lng: 90.39558 },
	// 	{ lat: 23.73252, lng: 90.39548 },
	// 	{ lat: 23.73229, lng: 90.39531 },
	// 	{ lat: 23.7321, lng: 90.3952 },
	// 	{ lat: 23.732, lng: 90.39513 },
	// 	{ lat: 23.73156, lng: 90.39528 },
	// 	{ lat: 23.73095, lng: 90.39534 },
	// 	{ lat: 23.73019, lng: 90.39543 },
	// 	{ lat: 23.72936, lng: 90.39543 },
	// 	{ lat: 23.72868, lng: 90.39544 },
	// 	{ lat: 23.72831, lng: 90.39542 },
	// 	{ lat: 23.72772, lng: 90.39541 },
	// 	{ lat: 23.72647, lng: 90.39542 },
	// 	{ lat: 23.72664, lng: 90.39448 },
	// 	{ lat: 23.72674, lng: 90.39413 },
	// 	{ lat: 23.72693, lng: 90.39357 },
	// 	{ lat: 23.72694, lng: 90.39354 },
	// 	{ lat: 23.72707, lng: 90.39298 },
	// 	{ lat: 23.72713, lng: 90.39275 },
	// 	{ lat: 23.72671, lng: 90.39265 },
	// 	{ lat: 23.72668, lng: 90.39265 },
	// 	{ lat: 23.72662, lng: 90.39263 },
	// ];
	const [polylineOptions, setPolylineOptions] = useState(
		JSON.stringify(POLYLINE_OPTIONS)
	);

	const [mapCenter, setMapCenter] = useState(null);
	const [mapZoom, setMapZoom] = useState(zoom || 12);

	useEffect(() => {
		if (coords.length > 0) {
			// Calculate the bounding box using LatLngBounds
			const bounds = new window.google.maps.LatLngBounds();

			coords.forEach((coord) => bounds.extend(coord));

			// Get the center of the bounding box
			const center = bounds.getCenter();
			setMapCenter({ lat: center.lat(), lng: center.lng() });

			// You can also automatically adjust the zoom to fit the bounds
			// If you are controlling the map instance, you can use: map.fitBounds(bounds);
		}
	}, [coords]);

	const po = useMemo(() => {
		try {
			return JSON.parse(polylineOptions);
		} catch (e) {
			return POLYLINE_OPTIONS;
		}
	}, [polylineOptions]);
	const mapRef = useRef(null);
	const onLoad = (map) => {
		mapRef.current = map;

		// Create bounds object
		const bounds = new window.google.maps.LatLngBounds();
		coords.forEach((coord) => {
			bounds.extend(coord);
		});

		// Adjust the map to fit all coordinates
		map.fitBounds(bounds);
	};
	return (
		<GoogleMap
			mapContainerStyle={mapStyles}
			// zoom={mapZoom}
			// center={mapCenter}
			onLoad={onLoad}
			options={{ disableDefaultUI: true }}
		>
			<Marker position={coords[0]} />
			<Marker position={coords[coords.length - 1]} />
			<PolylineF path={coords} options={po} />
		</GoogleMap>
	);
}
