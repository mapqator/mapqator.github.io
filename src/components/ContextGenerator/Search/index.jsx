"use client";

import AutocompleteSearchBox from "./AutocompleteSearchBox";
import PlaceInformation from "../../Grids/PlacesGrid";
import MapComponent from "./MapComponent";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
export default function PlaceSearch() {
	const { selectedPlacesMap } = useContext(GlobalContext);

	return (
		<div className="flex flex-col gap-2">
			<AutocompleteSearchBox />
			{Object.keys(selectedPlacesMap).length > 0 && (
				<>
					<MapComponent />
					<PlaceInformation />
				</>
			)}
		</div>
	);
}
