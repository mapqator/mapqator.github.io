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
			attributes.includes("geometry") ? "(" + lat + ", " + lng + ")" : ""
		}.\n`;
	}
	if (attributes.includes("opening_hours")) {
		text += `- Open: ${place.opening_hours.weekday_text.join(", ")}.\n`;
	}
	if (attributes.includes("rating")) {
		text += `- Rating: ${place.rating}. (${place.user_ratings_total} ratings).\n`;
	}

	if (attributes.includes("reviews")) {
		text += `- Reviews: \n${place.reviews
			.map((review, index) => {
				console.log(review.text);
				return `   ${index + 1}. ${review.author_name} (Rating: ${
					review.rating
				}): ${review.text}\n`;
			})
			.join("")} `; // Use .join('') to concatenate without commas
	}
	console.log(text);
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

	return text;
};
const ContextGeneratorService = {
	getPlacesContext: (selectedPlacesMap, savedPlacesMap) => {
		const newContext = [];
		for (const place_id of Object.keys(selectedPlacesMap)) {
			const text = placeToContext(
				place_id,
				selectedPlacesMap,
				savedPlacesMap
			);
			if (text !== "") {
				newContext.push(
					`Information of <b>${savedPlacesMap[place_id]?.name}</b>:`
				);

				text.split("\n").forEach((line) => {
					newContext.push(line);
				});
			}
		}
		return newContext;
	},
	getParamsContext: (currentInformation, savedPlacesMap) => {
		const newContext = [];
		if (currentInformation.time && currentInformation.day !== "") {
			newContext.push(
				`Current time is ${currentInformation.time.format(
					"h:mm a"
				)} on ${currentInformation.day}.`
			);
		} else if (currentInformation.time) {
			newContext.push(
				`Current time is ${currentInformation.time.format("h:mm a")}.`
			);
		} else if (currentInformation.day !== "") {
			newContext.push(`Today is ${currentInformation.day}.`);
		}

		if (currentInformation.location !== "") {
			newContext.push(
				`Current location of user is <b>${
					savedPlacesMap[currentInformation.location]?.name
				}</b>.`
			);
		}
		return newContext;
	},
	getAreaContext: (poisMap, savedPlacesMap) => {
		const newContext = [];
		Object.keys(poisMap).forEach((place_id, index) => {
			poisMap[place_id].forEach((poi) => {
				newContext.push(
					`Places in ${savedPlacesMap[place_id]?.name} of type \"${poi.type}\" are:`
				);
				let counter = 1;
				poi.places.forEach((place) => {
					if (place.selected) {
						newContext.push(
							`${counter}. <b>${
								savedPlacesMap[place.place_id]?.name ||
								place.name
							}</b> (${
								place.formatted_address ||
								savedPlacesMap[place.place_id]?.vicinity
							})`
						);
						counter++;
					}
				});

				newContext.push("");
			});
		});
		return newContext;
	},
	getNearbyContext: (nearbyPlacesMap, savedPlacesMap) => {
		const newContext = [];
		Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
			nearbyPlacesMap[place_id].forEach((e) => {
				newContext.push(
					`Nearby places of ${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id]?.name
					} ${e.type === "any" ? "" : 'of type "' + e.type + '"'} ${
						e.keyword !== ""
							? 'with keyword "' + e.keyword + '"'
							: ""
					} are (${
						e.hasRadius
							? "in " + e.radius + " m radius"
							: "sorted by distance in ascending order"
					}):`
				);
				let counter = 1;
				e.places.forEach((near_place) => {
					if (near_place.selected) {
						newContext.push(
							`${counter}. <b>${
								savedPlacesMap[near_place.place_id]?.name ||
								near_place.name
							}</b> (${
								near_place.formatted_address ||
								savedPlacesMap[near_place.place_id]?.vicinity
							})`
						);
						counter++;
					}
				});

				newContext.push("\n");
			});
		});
		return newContext;
	},
	getDistanceContext: (distanceMatrix, savedPlacesMap) => {
		const newContext = [];
		Object.keys(distanceMatrix).forEach((from_id) => {
			Object.keys(distanceMatrix[from_id]).forEach((to_id) => {
				Object.keys(distanceMatrix[from_id][to_id]).forEach((mode) => {
					if (mode === "transit") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id]?.name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id]?.name
							} by public transport is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					} else if (mode === "driving") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id]?.name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id]?.name
							} by car is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					} else if (mode === "bicycling") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id]?.name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id]?.name
							} by cycle is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					} else if (mode === "walking") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id]?.name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id]?.name
							} on foot is ${
								distanceMatrix[from_id][to_id][mode].distance
							} (${
								distanceMatrix[from_id][to_id][mode].duration
							}).`
						);
					}
				});
			});
		});
		return newContext;
	},
	getDirectionContext: (directionInformation, savedPlacesMap) => {
		const newContext = [];
		Object.keys(directionInformation).forEach((from_id) => {
			Object.keys(directionInformation[from_id]).forEach((to_id) => {
				Object.keys(directionInformation[from_id][to_id]).forEach(
					(mode) => {
						if (mode === "transit") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id]?.name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id]?.name
								} by public transport. They are:`
							);
						} else if (mode === "driving") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id]?.name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id]?.name
								} by car. They are:`
							);
						} else if (mode === "bicycling") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id]?.name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id]?.name
								} by cycle. They are:`
							);
						} else if (mode === "walking") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id]?.name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id]?.name
								} on foot. They are:`
							);
						}

						directionInformation[from_id][to_id][
							mode
						].routes.forEach((route, index) => {
							newContext.push(
								`${index + 1}. Via ${route.label} | ${
									route.duration
								} | ${route.distance}`
							);

							if (
								directionInformation[from_id][to_id][mode]
									.showSteps
							) {
								route.steps.forEach((step, index) => {
									newContext.push(` - ${step}`);
								});
							}
						});
					}
				);
			});
		});
		return newContext;
	},
};

export default ContextGeneratorService;
