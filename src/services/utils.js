import {
	faBicycle,
	faBus,
	faCar,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function convertFromSnake(text) {
	return text
		.replace(/_/g, " ") // Replace underscores with spaces
		.split(" ") // Split the string into an array of words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(" ");
}

export function convertTravelModeToLabel(mode) {
	return mode === "WALK"
		? "Walking"
		: mode === "DRIVE"
		? "Driving"
		: mode === "BICYCLE"
		? "Bicycling"
		: mode === "TRANSIT"
		? "Transit"
		: "Unknown";
}

export function convertTravelModeToIcon(mode) {
	return mode === "WALK" ? (
		<FontAwesomeIcon icon={faWalking} />
	) : mode === "DRIVE" ? (
		<FontAwesomeIcon icon={faCar} />
	) : mode === "BICYCLE" ? (
		<FontAwesomeIcon icon={faBicycle} />
	) : mode === "TRANSIT" ? (
		<FontAwesomeIcon icon={faBus} />
	) : null;
}

import { list as textSearchList } from "@/tools/TextSearch";
import { list as placeDetailsList } from "@/tools/PlaceDetails";
import { list as nearbySearchList } from "@/tools/NearbySearch";
import { list as computeRoutesList } from "@/tools/ComputeRoutes";
import { list as searchAlongRouteList } from "@/tools/SearchAlongRoute";

export function getToolOptions(mapService) {
	if (mapService === "all") {
		return {
			textSearch: Object.values(textSearchList)
				.map((family) => family)
				.flat(),
			placeDetails: Object.values(placeDetailsList)
				.map((family) => family)
				.flat(),
			nearbySearch: Object.values(nearbySearchList)
				.map((family) => family)
				.flat(),
			computeRoutes: Object.values(computeRoutesList)
				.map((family) => family)
				.flat(),
			searchAlongRoute: Object.values(searchAlongRouteList)
				.map((family) => family)
				.flat(),
		};
	} else {
		return {
			textSearch: textSearchList[mapService],
			placeDetails: placeDetailsList[mapService],
			nearbySearch: nearbySearchList[mapService],
			computeRoutes: computeRoutesList[mapService],
			searchAlongRoute: searchAlongRouteList[mapService],
		};
	}
}
