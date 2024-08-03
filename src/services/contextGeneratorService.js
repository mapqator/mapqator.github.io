import Pluralize from "pluralize";
import { convertFromSnake } from "./utils";
const placeToContext = (place_id, selectedPlacesMap, savedPlacesMap) => {
	let place = savedPlacesMap[place_id];
	if (!place) return "";

	let attributes = selectedPlacesMap[place_id].selectedAttributes;
	let text = "";

	if (
		attributes.includes("formatted_address") ||
		(attributes.includes("geometry") && place.geometry?.location)
	) {
		const lat =
			typeof place.geometry?.location.lat === "function"
				? place.geometry?.location.lat()
				: place.geometry?.location.lat;
		const lng =
			typeof place.geometry?.location.lng === "function"
				? place.geometry?.location.lng()
				: place.geometry?.location.lng;
		text += `- Location: ${
			attributes.includes("formatted_address")
				? place.formatted_address
				: ""
		}${
			attributes.includes("geometry") ? " (" + lat + ", " + lng + ")" : ""
		}.\n`;
	}
	if (attributes.includes("opening_hours")) {
		text += `- Opening hours: ${place.opening_hours.weekday_text.join(
			", "
		)}.\n`;
	}
	if (attributes.includes("rating")) {
		text += `- Rating: ${place.rating}. ${
			place.user_ratings_total
				? "(Total " + place.user_ratings_total + " ratings)"
				: ""
		}\n`;
	}

	if (attributes.includes("price_level")) {
		// - 0 Free
		// - 1 Inexpensive
		// - 2 Moderate
		// - 3 Expensive
		// - 4 Very Expensive
		// Convert price level from number to string

		let priceLevel = "";
		const priceMap = [
			"Free",
			"Inexpensive",
			"Moderate",
			"Expensive",
			"Very Expensive",
		];

		text += `- Price Level: ${priceMap[place.price_level]}.\n`;
	}

	if (attributes.includes("delivery")) {
		text += place.delivery
			? "- Delivery Available.\n"
			: "- Delivery Not Available.\n";
	}

	if (attributes.includes("dine_in")) {
		text += place.dine_in
			? "- Dine In Available.\n"
			: "- Dine In Not Available.\n";
	}

	if (attributes.includes("takeaway")) {
		text += place.takeaway
			? "- Takeaway Available.\n"
			: "- Takeaway Not Available.\n";
	}

	if (attributes.includes("reservable")) {
		text += place.reservable ? "- Reservable.\n" : "- Not Reservable.\n";
	}

	if (attributes.includes("wheelchair_accessible_entrance")) {
		text += place.wheelchair_accessible_entrance
			? "- Wheelchair Accessible Entrance.\n"
			: "- Not Wheelchair Accessible Entrance.\n";
	}

	if (attributes.includes("reviews")) {
		text += `- Reviews: \n${place.reviews
			.map((review, index) => {
				// console.log(review.text);
				return `   ${index + 1}. ${review.author_name} (Rating: ${
					review.rating
				}): ${review.text}\n`;
			})
			.join("")} `; // Use .join('') to concatenate without commas
	}

	return text;
};
const ContextGeneratorService = {
	getPlacesContext: (selectedPlacesMap, savedPlacesMap) => {
		let newContext = "";
		for (const place_id of Object.keys(selectedPlacesMap)) {
			const text = placeToContext(
				place_id,
				selectedPlacesMap,
				savedPlacesMap
			);
			if (text !== "") {
				if (newContext.length > 0) {
					newContext += "\n";
				}
				newContext +=
					`Information of <b>${savedPlacesMap[place_id]?.name}</b>:\n` +
					text;
			}
		}
		return newContext;
	},
	getParamsContext: (currentInformation, savedPlacesMap) => {
		let newContext = "";
		if (currentInformation.time && currentInformation.day !== "") {
			newContext += `Current time is ${currentInformation.time.format(
				"h:mm a"
			)} on ${currentInformation.day}.\n`;
		} else if (currentInformation.time) {
			newContext += `Current time is ${currentInformation.time.format(
				"h:mm a"
			)}.\n`;
		} else if (currentInformation.day !== "") {
			newContext += `Current day is ${currentInformation.day}.\n`;
		}
		if (currentInformation.location !== "") {
			newContext += `Current location of user is <b>${
				savedPlacesMap[currentInformation.location]?.name
			}</b>.\n`;
		}
		return newContext;
	},
	getAreaContext: (poisMap, savedPlacesMap) => {
		let newContext = "";
		Object.keys(poisMap).forEach((place_id, index) => {
			poisMap[place_id].forEach((poi) => {
				if (newContext.length > 0) {
					newContext += "\n";
				}
				newContext += `Places in ${savedPlacesMap[place_id]?.name} of type \"${poi.type}\" are:\n`;
				let counter = 1;
				poi.places.forEach((place) => {
					if (place.selected) {
						newContext += `${counter}. <b>${
							savedPlacesMap[place.place_id]?.name || place.name
						}</b> (${
							place.formatted_address ||
							savedPlacesMap[place.place_id]?.vicinity
						})\n`;
						counter++;
					}
				});
			});
		});
		return newContext;
	},
	getNearbyContext: (nearbyPlacesMap, savedPlacesMap) => {
		let newContext = "";
		Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
			nearbyPlacesMap[place_id].forEach((e) => {
				if (newContext.length > 0) {
					newContext += "\n";
				}
				newContext += `Nearby ${Pluralize(
					e.type === "any" ? e.keyword : convertFromSnake(e.type)
				)} of ${
					// selectedPlacesMap[place_id].alias ||
					savedPlacesMap[place_id]?.name
				} are (${
					e.rankBy === "distance"
						? "sorted by distance in ascending order"
						: "in " + e.radius + " m radius"
				}):\n`;
				let counter = 1;
				e.places.forEach((near_place) => {
					if (near_place.selected) {
						newContext += `${counter}. <b>${
							savedPlacesMap[near_place.place_id]?.name ||
							near_place.name
						}</b> (${
							near_place.formatted_address ||
							savedPlacesMap[near_place.place_id]?.vicinity
						})\n`;
						counter++;
					}
				});
			});
		});
		return newContext;
	},
	getDistanceContext: (distanceMatrix, savedPlacesMap) => {
		let newContext = "";
		Object.keys(distanceMatrix).forEach((from_id) => {
			Object.keys(distanceMatrix[from_id]).forEach((to_id) => {
				if (newContext.length > 0) {
					newContext += "\n";
				}
				newContext += `Travel time from <b>${
					// selectedPlacesMap[from_id].alias ||
					savedPlacesMap[from_id]?.name
				}</b> to <b>${
					// selectedPlacesMap[to_id].alias ||
					savedPlacesMap[to_id]?.name
				}</b> is:\n`;
				Object.keys(distanceMatrix[from_id][to_id]).forEach((mode) => {
					newContext += `- ${
						mode.toLowerCase() === "transit"
							? "By public transport"
							: mode.toLowerCase() === "walking"
							? "On foot"
							: mode.toLowerCase() === "driving"
							? "By car"
							: "By cycle"
					}: ${distanceMatrix[from_id][to_id][mode].duration} (${
						distanceMatrix[from_id][to_id][mode].distance
					}).\n`;
				});
			});
		});
		return newContext;
	},
	getDirectionContext: (directionInformation, savedPlacesMap) => {
		let newContext = "";
		Object.keys(directionInformation).forEach((from_id) => {
			Object.keys(directionInformation[from_id]).forEach((to_id) => {
				Object.keys(directionInformation[from_id][to_id]).forEach(
					(mode) => {
						if (newContext.length > 0) {
							newContext += "\n";
						}
						newContext += `There are ${
							directionInformation[from_id][to_id][mode].routes
								.length
						} routes from <b>${
							savedPlacesMap[from_id]?.name
						}</b> to <b>${savedPlacesMap[to_id]?.name}</b> ${
							mode.toLowerCase() === "transit"
								? "by public transport"
								: mode.toLowerCase() === "walking"
								? "on foot"
								: mode.toLowerCase() === "driving"
								? "by car"
								: "by cycle"
						}. They are:\n`;

						directionInformation[from_id][to_id][
							mode
						].routes.forEach((route, index) => {
							newContext += `${index + 1}. Via ${route.label} | ${
								route.duration
							} | ${route.distance}\n`;

							if (
								directionInformation[from_id][to_id][mode]
									.showSteps
							) {
								route.steps.forEach((step) => {
									newContext += ` - ${step}\n`;
								});
							}
						});
					}
				);
			});
		});
		return newContext;
	},
	convertContextToText: (context) => {
		let text = "";
		text += context.places !== "" ? context.places : "";
		text +=
			context.nearby !== ""
				? (text !== "" ? "\n" : "") + context.nearby
				: "";
		text +=
			context.area !== "" ? (text !== "" ? "\n" : "") + context.area : "";
		text +=
			context.distance !== ""
				? (text !== "" ? "\n" : "") + context.distance
				: "";
		text +=
			context.direction !== ""
				? (text !== "" ? "\n" : "") + context.direction
				: "";
		// text +=
		// 	context.params !== ""
		// 		? (text !== "" ? "\n" : "") + context.params
		// 		: "";
		return text;
	},
};

export default ContextGeneratorService;
