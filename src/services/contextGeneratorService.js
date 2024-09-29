import Pluralize from "pluralize";
import { convertFromSnake } from "./utils";
const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

const placeToContext = (place_id, selectedPlacesMap, savedPlacesMap) => {
	let place = savedPlacesMap[place_id];
	if (!place) return "";

	let attributes = selectedPlacesMap[place_id].selectedAttributes;
	let text = "";

	if (attributes.includes("formatted_address")) {
		text += `- Address: ${place.shortFormattedAddress}${
			attributes.includes("location")
				? " (" +
				  place.location.latitude +
				  ", " +
				  place.location.longitude +
				  ")"
				: ""
		}.\n`;
	}

	if (attributes.includes("internationalPhoneNumber")) {
		text += `- Phone Number: ${place.internationalPhoneNumber}.\n`;
	}

	if (attributes.includes("regularOpeningHours")) {
		text += `- Opening hours: ${place.regularOpeningHours.join(", ")}.\n`;
	}
	if (attributes.includes("rating")) {
		text += `- Rating: ${place.rating}. ${
			place.user_ratings_total
				? "(Total " + place.userRatingCount + " ratings)"
				: ""
		}\n`;
	}

	if (attributes.includes("priceLevel")) {
		// - 0 Free
		// - 1 Inexpensive
		// - 2 Moderate
		// - 3 Expensive
		// - 4 Very Expensive
		// Convert price level from number to string
		const priceMap = [
			"Free",
			"Inexpensive",
			"Moderate",
			"Expensive",
			"Very Expensive",
		];
		text += `- ${place.priceLevel}.\n`;
	}
	if (attributes.includes("delivery")) {
		text += place.delivery
			? "- Delivery Available.\n"
			: "- Delivery Not Available.\n";
	}
	if (attributes.includes("dineIn")) {
		text += place.dineIn
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

	if (attributes.includes("servesBreakfast")) {
		text += place.servesBreakfast
			? "- Serves Breakfast.\n"
			: "- Does Not Serve Breakfast.\n";
	}
	if (attributes.includes("servesLunch")) {
		text += place.servesLunch
			? "- Serves Lunch.\n"
			: "- Does Not Serve Lunch.\n";
	}

	if (attributes.includes("servesDinner")) {
		text += place.servesDinner
			? "- Serves Dinner.\n"
			: "- Does Not Serve Dinner.\n";
	}
	if (attributes.includes("accessibilityOptions")) {
		text += place.accessibilityOptions.wheelchairAccessibleEntrance
			? "- Wheelchair Accessible Entrance.\n"
			: "- Not Wheelchair Accessible Entrance.\n";
	}
	if (attributes.includes("reviews")) {
		text += `- Reviews: \n${place.reviews
			.map((review, index) => {
				// console.log(review.text);
				return `   ${index + 1}. ${
					review.authorAttribution.displayName
				} (Rating: ${review.rating}): ${review.text.text}\n`;
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
					`Information of <b>${savedPlacesMap[place_id]?.displayName.text}</b>:\n` +
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
					convertFromSnake(e.type)
				)} of ${
					// selectedPlacesMap[place_id].alias ||
					savedPlacesMap[place_id]?.displayName.text
				}${
					e.minRating > 0
						? " with a minimum rating of " + e.minRating
						: ""
				}${
					e.priceLevels.length > 0
						? (e.minRating > 0 ? " and " : " ") +
						  "price levels of " +
						  e.priceLevels.map((p) => priceMap[p]).join(" or ")
						: ""
				} are:${
					e.rankBy === "DISTANCE" ? " (Rank by Distance)" : ""
				}\n`;
				let counter = 1;
				e.places.forEach((near_place) => {
					if (near_place.selected) {
						newContext += `${counter}. <b>${
							savedPlacesMap[near_place.place_id]?.displayName
								.text || near_place.name
						}</b> (${
							"Rating: " +
							near_place.rating +
							(near_place.priceLevel
								? " | " + near_place.priceLevel
								: "")
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
					savedPlacesMap[from_id]?.displayName.text
				}</b> to <b>${
					// selectedPlacesMap[to_id].alias ||
					savedPlacesMap[to_id]?.displayName.text
				}</b> is:\n`;
				Object.keys(distanceMatrix[from_id][to_id]).forEach((mode) => {
					newContext += `- ${
						mode.toLowerCase() === "transit"
							? "By public transport"
							: mode.toLowerCase() === "walk"
							? "On foot"
							: mode.toLowerCase() === "drive"
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

		directionInformation.forEach((direction) => {
			if (newContext.length > 0) {
				newContext += "\n";
			}
			if (direction.intermediates.length > 0) {
				if (direction.optimizeWaypointOrder) {
					newContext += `If we want to start our journey from <b>${
						savedPlacesMap[direction.origin]?.displayName.text
					}</b>, then visit ${direction.intermediates.map(
						(intermediate) =>
							`<b>${savedPlacesMap[intermediate]?.displayName.text}</b>,`
					)} and end our journey at <b>${
						savedPlacesMap[direction.destination]?.displayName.text
					}</b>, the optimized order of visit by ${
						direction.travelMode.toLowerCase() === "transit"
							? "public transport"
							: direction.travelMode.toLowerCase() ===
									"walking" ||
							  direction.travelMode.toLowerCase() === "walk"
							? "foot"
							: direction.travelMode.toLowerCase() ===
									"driving" ||
							  direction.travelMode.toLowerCase() === "drive"
							? "car"
							: "cycle"
					} is:\n`;
					newContext += `First go to <b>${
						savedPlacesMap[
							direction.intermediates[
								direction.routes[0]
									.optimizedIntermediateWaypointIndex[0]
							]
						]?.displayName.text
					}</b> from <b>${
						savedPlacesMap[direction.origin]?.displayName.text
					}</b> which takes ${
						direction.routes[0].legs[0].localizedValues
							.staticDuration.text +
						" (" +
						direction.routes[0].legs[0].localizedValues.distance
							.text +
						")"
					}.\n`;

					for (let i = 1; i < direction.intermediates.length; i++) {
						newContext += `Then go to <b>${
							savedPlacesMap[
								direction.intermediates[
									direction.routes[0]
										.optimizedIntermediateWaypointIndex[i]
								]
							]?.displayName.text
						}</b> from <b>${
							savedPlacesMap[
								direction.intermediates[
									direction.routes[0]
										.optimizedIntermediateWaypointIndex[
										i - 1
									]
								]
							]?.displayName.text
						}</b> which takes ${
							direction.routes[0].legs[i].localizedValues
								.staticDuration.text +
							" (" +
							direction.routes[0].legs[i].localizedValues.distance
								.text +
							")"
						}.\n`;
					}

					newContext += `Finally go to <b>${
						savedPlacesMap[direction.destination]?.displayName.text
					}</b> from <b>${
						savedPlacesMap[
							direction.intermediates[
								direction.routes[0]
									.optimizedIntermediateWaypointIndex[
									direction.intermediates.length - 1
								]
							]
						]?.displayName.text
					}</b> which takes ${
						direction.routes[0].legs[
							direction.routes[0].legs.length - 1
						].localizedValues.staticDuration.text +
						" (" +
						direction.routes[0].legs[
							direction.routes[0].legs.length - 1
						].localizedValues.distance.text +
						")"
					}.\n`;

					newContext += `The entire route is Via ${
						direction.routes[0].label
					} and total time taken is ${
						direction.routes[0].duration +
						" (" +
						direction.routes[0].distance +
						")"
					}.\n`;
				} else {
					newContext += `If we start our journey from <b>${
						savedPlacesMap[direction.origin]?.displayName.text
					}</b>, then visit ${direction.intermediates
						.map(
							(intermediate) =>
								`<b>${savedPlacesMap[intermediate]?.displayName.text}</b>`
						)
						.join(", ")}, and finally end our journey at <b>${
						savedPlacesMap[direction.destination]?.displayName.text
					}</b>, the ${
						direction.travelMode.toLowerCase() === "transit"
							? "transit"
							: direction.travelMode.toLowerCase() ===
									"walking" ||
							  direction.travelMode.toLowerCase() === "walk"
							? "walking"
							: direction.travelMode.toLowerCase() ===
									"driving" ||
							  direction.travelMode.toLowerCase() === "drive"
							? "driving"
							: direction.travelMode.toLowerCase() ===
									"bicycling" ||
							  direction.travelMode.toLowerCase() === "bicycle"
							? "bicycling"
							: "two-wheeler"
					} route is as follows:\n`;

					newContext += `First, go to <b>${
						savedPlacesMap[direction.intermediates[0]]?.displayName
							.text
					}</b> from <b>${
						savedPlacesMap[direction.origin]?.displayName.text
					}</b>, which takes ${
						direction.routes[0].legs[0].localizedValues
							.staticDuration.text +
						" (" +
						direction.routes[0].legs[0].localizedValues.distance
							.text +
						")"
					}.\n`;

					for (let i = 1; i < direction.intermediates.length; i++) {
						newContext += `Then, go to <b>${
							savedPlacesMap[direction.intermediates[i]]
								?.displayName.text
						}</b> from <b>${
							savedPlacesMap[direction.intermediates[i - 1]]
								?.displayName.text
						}</b>, which takes ${
							direction.routes[0].legs[i].localizedValues
								.staticDuration.text +
							" (" +
							direction.routes[0].legs[i].localizedValues.distance
								.text +
							")"
						}.\n`;
					}

					newContext += `Finally, go to <b>${
						savedPlacesMap[direction.destination]?.displayName.text
					}</b> from <b>${
						savedPlacesMap[
							direction.intermediates[
								direction.intermediates.length - 1
							]
						]?.displayName.text
					}</b>, which takes ${
						direction.routes[0].legs[
							direction.routes[0].legs.length - 1
						].localizedValues.staticDuration.text +
						" (" +
						direction.routes[0].legs[
							direction.routes[0].legs.length - 1
						].localizedValues.distance.text +
						")"
					}.\n`;

					newContext += `The entire route follows ${
						direction.routes[0].label
					}, with a total time of ${
						direction.routes[0].duration +
						" (" +
						direction.routes[0].distance +
						")"
					}.\n`;
				}
			} else {
				newContext += `There are ${
					direction.routes.length
				} routes from <b>${
					savedPlacesMap[direction.origin]?.displayName.text
				}</b> to <b>${
					savedPlacesMap[direction.destination]?.displayName.text
				}</b> by ${
					direction.travelMode.toLowerCase() === "transit"
						? "public transport"
						: direction.travelMode.toLowerCase() === "walking" ||
						  direction.travelMode.toLowerCase() === "walk"
						? "foot"
						: direction.travelMode.toLowerCase() === "driving" ||
						  direction.travelMode.toLowerCase() === "drive"
						? "car"
						: "cycle"
				}. They are:\n`;

				direction.routes.forEach((route, index) => {
					newContext += `${index + 1}. Via ${route.label} | ${
						route.duration
					} (${route.distance})\n`;
					if (direction.showSteps) {
						route.legs.forEach((leg) =>
							leg.steps.map((step) => {
								if (step.navigationInstruction)
									newContext += ` - ${step.navigationInstruction.instructions}\n`;
							})
						);
					}
				});
			}
		});
		return newContext;

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
		// text +=
		// 	context.area !== "" ? (text !== "" ? "\n" : "") + context.area : "";
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
