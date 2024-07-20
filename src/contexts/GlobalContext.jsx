import QueryApi from "@/api/queryApi";
import PlaceApi from "@/api/placeApi";
import React, { createContext, useState, useContext, useEffect } from "react";
const queryApi = new QueryApi();
const placeApi = new PlaceApi();
export const GlobalContext = createContext();
export default function GlobalContextProvider({ children }) {
	const [savedPlacesMap, setSavedPlacesMap] = useState({
		1: {
			name: "Bangladesh University of Engineering and Technology",
			place_id: 1,
			formatted_address: "Polashi Bazar, Azimpur, Dhaka",
			rating: "4.5",
		},
		2: {
			name: "Labaid Hospital",
			place_id: 2,
			formatted_address: "Dhanmondi 32 Road, Dhaka",
			rating: "4.8",
		},
	});
	const [contextJSON, setContextJSON] = useState({});
	const [context, setContext] = useState({
		places: [],
		nearby: [],
		area: [],
		distance: [],
		direction: [],
		params: [],
	});
	const [distanceMatrix, setDistanceMatrix] = useState({
		1: {
			2: {
				walking: {
					distance: "5 km",
					duration: "6 mins",
				},
				driving: {
					distance: "5 km",
					duration: "6 mins",
				},
				bicycling: {
					distance: "5 km",
					duration: "6 mins",
				},
				transit: {
					distance: "5 km",
					duration: "6 mins",
				},
			},
		},
	});
	const [selectedPlacesMap, setSelectedPlacesMap] = useState({
		1: {
			selectedAttributes: ["formatted_address", "rating"],
			attributes: ["formatted_address", "name", "place_id", "rating"],
		},
		2: {
			selectedAttributes: ["formatted_address"],
			attributes: ["formatted_address", "name", "place_id", "rating"],
		},
	});
	const [nearbyPlacesMap, setNearbyPlacesMap] = useState({
		1: [
			{
				type: "restaurant",
				rankby: "distance",
				keyword: "",
				places: [
					{
						name: "Dhanmondi",
						formatted_address: "Dhanmondi 27 road",
						selected: true,
					},
					{
						name: "Farmgate",
						formatted_address: "Indira road, Dhaka",
						selected: true,
					},
				],
			},
		],
	});
	const [currentInformation, setCurrentInformation] = useState({
		time: null,
		day: "",
		location: "",
	});
	const [directionInformation, setDirectionInformation] = useState({
		1: {
			2: {
				walking: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Mirpur",
							steps: [],
						},
					],
					showSteps: true,
				},
				driving: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Uttara",
							steps: [],
						},
					],
					showSteps: true,
				},
				bicycling: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Jhigatola",
							steps: [],
						},
					],
					showSteps: true,
				},
				transit: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Uttara",
							steps: ["Go left from <b>Md pur</b>", "Then right"],
						},
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Dhanmondi",
							steps: ["Go left from Md pur", "Then right"],
						},
					],
					showSteps: true,
				},
			},
		},
	});
	const [poisMap, setPoisMap] = useState({
		1: [
			{
				type: "restaurant",
				places: [
					{
						name: "Dhanmondi",
						formatted_address: "Dhanmondi 27 road",
						selected: true,
					},
					{
						name: "Farmgate",
						formatted_address: "Indira road, Dhaka",
						selected: true,
					},
				],
			},
		],
	});
	const initQuery = {
		question: "",
		answer: {
			type: "mcq",
			options: ["", "", "", ""],
			correct: -1,
		},
		context: "",
		context_json: {},
		context_gpt: "",
		classification: "",
	};
	const [query, setQuery] = useState(initQuery);
	const [queries, setQueries] = useState([
		{
			id: 152,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 153,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "routing",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 154,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "time_calculation",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 155,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "nearby_poi",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 156,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "opinion",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 157,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 158,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 159,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 160,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 161,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 162,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
		{
			id: 163,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
		},
	]);

	const fetchQueries = async () => {
		// setLoading(true);
		try {
			const res = await queryApi.getQueries();
			if (res.success) {
				console.log("Data: ", res.data);
				setQueries(res.data);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const fetchPlaces = async () => {
		console.log("Fetching places");
		// setButtonLoading(true);
		try {
			const res = await placeApi.getPlaces();
			if (res.success) {
				// create a map for easy access
				const newSavedPlacesMap = {};
				res.data.forEach((e) => {
					newSavedPlacesMap[e.place_id] = e;
				});
				setSavedPlacesMap(newSavedPlacesMap);
				// setFetched(true);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		// setButtonLoading(false);
	};

	useEffect(() => {
		// if (process.env.NODE_ENV === "production")
		{
			console.log("Fetching queries");
			fetchQueries();
			fetchPlaces();
		}
	}, []);

	// useEffect(() => {
	// 	generateContext();
	// }, [
	// 	distanceMatrix,
	// 	selectedPlacesMap,
	// 	nearbyPlacesMap,
	// 	savedPlacesMap,
	// 	currentInformation,
	// 	directionInformation,
	// 	poisMap,
	// ]);

	const placeToContext = (place_id) => {
		let place = savedPlacesMap[place_id];
		if (!place) return "";

		let attributes = selectedPlacesMap[place_id].selectedAttributes;
		let text = "";

		if (
			attributes.includes("formatted_address") ||
			(attributes.includes("geometry") && place.geometry.location)
		) {
			const lat =
				typeof place.geometry.location.lat === "function"
					? place.geometry.location.lat()
					: place.geometry.location.lat;
			const lng =
				typeof place.geometry.location.lng === "function"
					? place.geometry.location.lng()
					: place.geometry.location.lng;
			text += `- Location: ${
				attributes.includes("formatted_address")
					? place.formatted_address
					: ""
			}${
				attributes.includes("geometry")
					? "(" + lat + ", " + lng + ")"
					: ""
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
			text += place.reservable
				? "- Reservable.\n"
				: "- Not Reservable.\n";
		}

		if (attributes.includes("wheelchair_accessible_entrance")) {
			text += place.wheelchair_accessible_entrance
				? "- Wheelchair Accessible Entrance.\n"
				: "- Not Wheelchair Accessible Entrance.\n";
		}

		return text;
	};

	const generateContext = async () => {
		let newContext = [];

		for (const place_id of Object.keys(selectedPlacesMap)) {
			// if (!savedPlacesMap[place_id]) {
			// 	await handleSave(place_id);
			// }
			const text = placeToContext(place_id);
			if (text !== "") {
				newContext.push(
					`Information of <b>${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					}</b>:`
				);
				// Split the text into lines and add to context
				text.split("\n").forEach((line) => {
					newContext.push(line);
				});
			}
		}

		Object.keys(distanceMatrix).forEach((from_id) => {
			Object.keys(distanceMatrix[from_id]).forEach((to_id) => {
				Object.keys(distanceMatrix[from_id][to_id]).forEach((mode) => {
					if (mode === "transit") {
						newContext.push(
							`Distance from ${
								// selectedPlacesMap[from_id].alias ||
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
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
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
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
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
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
								savedPlacesMap[from_id].name
							} to ${
								// selectedPlacesMap[to_id].alias ||
								savedPlacesMap[to_id].name
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
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} by public transport. They are:`
							);
						} else if (mode === "driving") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} by car. They are:`
							);
						} else if (mode === "bicycling") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
								} by cycle. They are:`
							);
						} else if (mode === "walking") {
							newContext.push(
								`There are ${
									directionInformation[from_id][to_id][mode]
										.routes.length
								} routes from ${
									// selectedPlacesMap[from_id].alias ||
									savedPlacesMap[from_id].name
								} to ${
									// selectedPlacesMap[to_id].alias ||
									savedPlacesMap[to_id].name
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

		Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
			nearbyPlacesMap[place_id].forEach((e) => {
				newContext.push(
					`Nearby places of ${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
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
								// selectedPlacesMap[near_place.place_id]?.alias ||
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

		Object.keys(poisMap).forEach((place_id, index) => {
			poisMap[place_id].forEach((poi) => {
				newContext.push(
					`Places in ${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					} of type \"${poi.type}\" are:`
				);
				let counter = 1;
				poi.places.forEach((place) => {
					if (place.selected) {
						newContext.push(
							`${counter}. <b>${
								// selectedPlacesMap[place.place_id]?.alias ||
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
					// selectedPlacesMap[currentInformation.location]?.alias ||
					savedPlacesMap[currentInformation.location]?.name
				}</b>.`
			);
		}

		setContext(newContext);

		console.log({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
			current_information: currentInformation,
			pois: poisMap,
			directions: directionInformation,
		});

		setContextJSON({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
			current_information: currentInformation,
			pois: poisMap,
			directions: directionInformation,
		});
	};

	return (
		<GlobalContext.Provider
			value={{
				savedPlacesMap,
				setSavedPlacesMap,
				contextJSON,
				setContextJSON,
				context,
				setContext,
				distanceMatrix,
				setDistanceMatrix,
				selectedPlacesMap,
				setSelectedPlacesMap,
				nearbyPlacesMap,
				setNearbyPlacesMap,
				currentInformation,
				setCurrentInformation,
				directionInformation,
				setDirectionInformation,
				poisMap,
				setPoisMap,
				query,
				setQuery,
				queries,
				setQueries,
				initQuery,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}
