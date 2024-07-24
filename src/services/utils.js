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
	return mode === "walking"
		? "Walking"
		: mode === "driving"
		? "Driving"
		: mode === "bicycling"
		? "Bicycling"
		: "Public transport";
}

export function convertTravelModeToIcon(mode) {
	return mode === "walking" ? (
		<FontAwesomeIcon icon={faWalking} />
	) : mode === "driving" ? (
		<FontAwesomeIcon icon={faCar} />
	) : mode === "bicycling" ? (
		<FontAwesomeIcon icon={faBicycle} />
	) : (
		<FontAwesomeIcon icon={faBus} />
	);
}
