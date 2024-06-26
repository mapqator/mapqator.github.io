"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField, IconButton } from "@mui/material";
import OnlineSearch from "./OnlineSearch";
import OfflineSearch from "./OfflineSearch";
import PlaceInformation from "./PlaceInformation";
import DistanceInformation from "./DistanceInformation";
import NearbyInformation from "./NearbyInformation";
import ContextPreview from "./ContextPreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import CurrentInformation from "./CurrentInformation";
import { format } from "date-fns";
import POI from "./POI";
import { setLoading } from "./page";

export default function ContextGenerator({
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
	poisMap,
	setPoisMap,
}) {
	const [savedPlacesMap, setSavedPlacesMap] = useState({});

	useEffect(() => {
		generateContext();
	}, [
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		savedPlacesMap,
		currentInformation,
		poisMap,
	]);

	const generateContext = () => {
		let newContext = [];
		Object.keys(selectedPlacesMap).forEach((place_id) => {
			const text = placeToContext(place_id);
			if (text !== "")
				newContext.push(
					`Information of ${
						selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					}: ${text}`
				);
		});

		Object.keys(distanceMatrix).forEach((from_id, index) => {
			Object.keys(distanceMatrix[from_id]).forEach((to_id, index) => {
				Object.keys(distanceMatrix[from_id][to_id]).forEach((mode) => {
					newContext.push(
						`${mode} Distance from ${
							selectedPlacesMap[from_id].alias ||
							savedPlacesMap[from_id].name
						} to ${
							selectedPlacesMap[to_id].alias ||
							savedPlacesMap[to_id].name
						} is ${
							distanceMatrix[from_id][to_id][mode].distance
						} (${distanceMatrix[from_id][to_id][mode].duration}).`
					);
				});
			});
		});

		Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
			nearbyPlacesMap[place_id].forEach((e) => {
				newContext.push(
					`Nearby places of ${
						selectedPlacesMap[place_id].alias ||
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
							`${counter}. ${
								selectedPlacesMap[near_place.place_id]?.alias ||
								savedPlacesMap[near_place.place_id]?.name ||
								near_place.name
							} - ${near_place.formatted_address}`
						);
						counter++;
					}
				});
			});
		});

		poisMap.forEach((poi, index) => {
			newContext.push(`POIs for query "${poi.query}" are:`);
			let counter = 1;
			poi.places.forEach((place) => {
				if (place.selected) {
					newContext.push(
						`${counter}. ${
							selectedPlacesMap[place.place_id]?.alias ||
							savedPlacesMap[place.place_id]?.name ||
							place.name
						} - ${place.formatted_address}`
					);
					counter++;
				}
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
				`Current location of user is ${
					selectedPlacesMap[currentInformation.location]?.alias ||
					savedPlacesMap[currentInformation.location]?.name
				}.`
			);
		}

		setContext(newContext);

		console.log({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
			current_information: currentInformation,
			pois: poisMap,
		});

		setContextJSON({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
			current_information: currentInformation,
			pois: poisMap,
		});
	};

	const placeToContext = (place_id) => {
		let place = savedPlacesMap[place_id];
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
			text += `Location: ${
				attributes.includes("formatted_address")
					? place.formatted_address
					: ""
			}${
				attributes.includes("geometry")
					? "(" + lat + ", " + lng + ")"
					: ""
			}. `;
		}
		if (attributes.includes("opening_hours")) {
			text += `Open: ${place.opening_hours.weekday_text.join(", ")}. `;
		}
		if (attributes.includes("rating")) {
			text += `Rating: ${place.rating}. (${place.user_ratings_total} ratings). `;
		}

		if (attributes.includes("reviews")) {
			text += `Reviews: ${place.reviews.map((review) => {
				return `${review.author_name} (${review.rating}): ${review.text}`;
			})} `;
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

			text += `Price Level: ${priceMap[place.price_level]}. `;
		}

		if (attributes.includes("delivery")) {
			text += place.delivery
				? "Delivery Available. "
				: "Delivery Not Available. ";
		}

		if (attributes.includes("dine_in")) {
			text += place.dine_in
				? "Dine In Available. "
				: "Dine In Not Available. ";
		}

		if (attributes.includes("takeaway")) {
			text += place.takeaway
				? "Takeaway Available. "
				: "Takeaway Not Available. ";
		}

		if (attributes.includes("reservable")) {
			text += place.reservable ? "Reservable. " : "Not Reservable. ";
		}

		if (attributes.includes("wheelchair_accessible_entrance")) {
			text += place.wheelchair_accessible_entrance
				? "Wheelchair Accessible Entrance. "
				: "Not Wheelchair Accessible Entrance. ";
		}

		return text;
	};
	const fetchPlaces = async () => {
		try {
			const res = await placeApi.getPlaces();
			if (res.success) {
				// create a map for easy access
				const newSavedPlacesMap = {};
				res.data.forEach((e) => {
					newSavedPlacesMap[e.place_id] = e;
				});
				setSavedPlacesMap(newSavedPlacesMap);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	useEffect(() => {
		fetchPlaces();
	}, []);

	return (
		<>
			<div className="flex flex-col w-1/2 bg-white gap-4  min-h-screen p-5">
				<div className="absolute top-5 right-5">
					<IconButton
						onClick={() => {
							setSelectedPlacesMap({});
							setDistanceMatrix({});
							setNearbyPlacesMap({});
							setContext([]);
							setContextJSON({});
							setCurrentInformation({
								time: null,
								day: "",
								location: "",
							});
						}}
					>
						<FontAwesomeIcon icon={faRefresh} color="black" />
					</IconButton>
				</div>
				<div className="bg-white flex flex-col items-center">
					<h1 className="text-3xl text-black">Context Generator</h1>
					<p className="text-lg">
						Generate context for a given question
					</p>
					<h1 className="bg-black h-1 w-full mt-2"></h1>
				</div>

				<div className="flex flex-row gap-4">
					<OfflineSearch
						savedPlacesMap={savedPlacesMap}
						selectedPlacesMap={selectedPlacesMap}
						setSelectedPlacesMap={setSelectedPlacesMap}
					/>
					<OnlineSearch
						{...{
							savedPlacesMap,
							setSavedPlacesMap,
							selectedPlacesMap,
							setSelectedPlacesMap,
							setPoisMap,
						}}
					/>
				</div>

				<PlaceInformation
					{...{
						selectedPlacesMap,
						setSelectedPlacesMap,
						savedPlacesMap,
					}}
				/>

				<DistanceInformation
					{...{
						selectedPlacesMap,
						savedPlacesMap,
						distanceMatrix,
						setDistanceMatrix,
					}}
				/>

				<NearbyInformation
					{...{
						savedPlacesMap,
						setSavedPlacesMap,
						selectedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
					}}
				/>

				<POI
					{...{
						savedPlacesMap,
						setSavedPlacesMap,
						selectedPlacesMap,
						poisMap,
						setPoisMap,
					}}
				/>

				<CurrentInformation
					{...{
						selectedPlacesMap,
						currentInformation,
						setCurrentInformation,
						savedPlacesMap,
					}}
				/>
				<ContextPreview
					{...{
						setContextJSON,
						context,
						setContext,
						savedPlacesMap,
						selectedPlacesMap,
						distanceMatrix,
						nearbyPlacesMap,
					}}
				/>
			</div>
			<div className="hidden" id="map"></div>
		</>
	);
}
