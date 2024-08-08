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
