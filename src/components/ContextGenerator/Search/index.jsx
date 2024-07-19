"use client";

import AutocompleteSearchBox from "./AutocompleteSearchBox";
import PlaceInformation from "./places";
import MapComponent from "./MapComponent";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
export default function PlaceSearch() {
	const { selectedPlacesMap } = useContext(GlobalContext);
	const locations = [
		[40.712776, -74.005974], // New York
		[34.052235, -118.243683], // Los Angeles
		[51.507351, -0.127758], // London
		// Add more locations as needed
	];

	return (
		<div className="flex flex-col gap-2">
			<AutocompleteSearchBox />
			{Object.keys(selectedPlacesMap).length > 0 && (
				<MapComponent locations={locations} />
			)}
			<PlaceInformation />
		</div>
	);
}
