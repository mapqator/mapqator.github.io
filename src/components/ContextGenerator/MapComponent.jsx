"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function MapComponent({ locations }) {
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
