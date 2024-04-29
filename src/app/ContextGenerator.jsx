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
}) {
	const [savedPlacesMap, setSavedPlacesMap] = useState({});

	useEffect(() => {
		generateContext();
	}, [distanceMatrix, selectedPlacesMap, nearbyPlacesMap]);

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
							: "ranked by distance"
					}):`
				);
				e.places.forEach((near_place, index) => {
					newContext.push(`${index + 1}. ${near_place.name}`);
				});
			});
		});
		setContext(newContext);

		console.log({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
		});

		setContextJSON({
			distance_matrix: distanceMatrix,
			places: selectedPlacesMap,
			nearby_places: nearbyPlacesMap,
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
						generateContext
					/>
					<OnlineSearch
						savedPlacesMap={savedPlacesMap}
						setSavedPlacesMap={setSavedPlacesMap}
						selectedPlacesMap={selectedPlacesMap}
						setSelectedPlacesMap={setSelectedPlacesMap}
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
						savedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
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
