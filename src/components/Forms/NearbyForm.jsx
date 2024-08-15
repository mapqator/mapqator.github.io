"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import mapApi from "@/api/mapApi";
import {
	TextField,
	Grid,
	FormControlLabel,
	RadioGroup,
	Radio,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	ListItemText,
	Checkbox,
	OutlinedInput,
} from "@mui/material";
import types from "@/database/newtypes.json";
import { LoadingButton } from "@mui/lab";
import { Add, Search } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useContext } from "react";
import TypeSelectionField from "@/components/InputFields/TypeSelectionField";
import { AppContext } from "@/contexts/AppContext";
import { showError } from "@/contexts/ToastProvider";
import {
	GoogleMap,
	LoadScript,
	useJsApiLoader,
	Marker,
} from "@react-google-maps/api";
import PoiSelectionField from "../InputFields/PoiSelectionField";

const placeTypes = [];
for (const category in types) {
	placeTypes.push(...types[category]);
}
console.log(placeTypes);

//  PRICE_LEVEL_FREE is not allowed in a request. It is only used to populate the response.
const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

export default function NearbyForm({ handlePlaceAdd }) {
	const { selectedPlacesMap, nearbyPlacesMap, setNearbyPlacesMap } =
		useContext(GlobalContext);
	const { savedPlacesMap, setSavedPlacesMap } = useContext(AppContext);
	const initialData = {
		locationBias: "",
		searchBy: "type",
		type: "",
		keyword: "",
		rankPreference: "RELEVANCE",
		minRating: 0, // Values are rounded up to the nearest 0.5.
		priceLevels: [],
	};
	const [newNearbyPlaces, setNewNearbyPlaces] = useState(initialData);

	const handleSave = async (place) => {
		let details = savedPlacesMap[place_id];
		if (details === undefined) {
			const res = await mapApi.getDetailsNew(place_id);
			setSavedPlacesMap((prev) => ({
				...prev,
				[place.id]: place,
			}));
		}
	};

	const [loading, setLoading] = useState(false);
	const searchNearbyPlaces = async () => {
		if (newNearbyPlaces.locationBias === "" || newNearbyPlaces.type === "")
			return;
		setLoading(true);
		const location = savedPlacesMap[newNearbyPlaces.locationBias].location;
		const lat = location.latitude;
		const lng = location.longitude;

		if (!placeTypes.includes(newNearbyPlaces.type)) {
			newNearbyPlaces.keyword = newNearbyPlaces.type;
			newNearbyPlaces.type = "";
		} else {
			newNearbyPlaces.keyword = "";
		}

		const response = await mapApi.getNearbyNew({
			lat,
			lng,
			locationBias: newNearbyPlaces.locationBias,
			searchBy: newNearbyPlaces.searchBy,
			type: newNearbyPlaces.type,
			keyword: newNearbyPlaces.keyword,
			rankPreference: newNearbyPlaces.rankPreference,
			minRating: newNearbyPlaces.minRating,
			priceLevels: newNearbyPlaces.priceLevels,
		});

		if (response.success) {
			const places = response.data.places;
			console.log("Nearby Places: ", response.data);
			const newNearbyPlacesMap = { ...nearbyPlacesMap };
			if (
				newNearbyPlacesMap[newNearbyPlaces.locationBias] === undefined
			) {
				newNearbyPlacesMap[newNearbyPlaces.locationBias] = [];
			}

			const resPriceMap = {
				...priceMap,
				PRICE_LEVEL_FREE: "Free",
				PRICE_LEVEL_UNSPECIFIED: "Unspecified",
			};
			const placesWithSelection = places.map((place) => ({
				selected: true,
				place_id: place.id,
				name: place.displayName.text,
				formatted_address: place.shortFormattedAddress,
				rating: place.rating,
				priceLevel: place.priceLevel
					? resPriceMap[place.priceLevel]
					: null,
				userRatingCount: place.userRatingCount,
			}));

			newNearbyPlacesMap[newNearbyPlaces.locationBias].push({
				type:
					newNearbyPlaces.searchBy === "type"
						? newNearbyPlaces.type
						: newNearbyPlaces.keyword,
				minRating: newNearbyPlaces.minRating,
				priceLevels: newNearbyPlaces.priceLevels,
				rankBy: newNearbyPlaces.rankPreference,
				places: placesWithSelection,
			});

			setNearbyPlacesMap(newNearbyPlacesMap);
			setNewNearbyPlaces((prev) => ({
				...prev,
				type: "",
				keyword: "",
			}));
			setLoading(false);

			places.forEach((place) => {
				handleSave(place);
			});
		} else {
			showError("Couldn't find nearby places.");
		}
		setLoading(false);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<PlaceSelectionField
					label="Location"
					value={newNearbyPlaces.locationBias}
					onChange={(e) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							locationBias: e.target.value,
						}))
					}
					handlePlaceAdd={handlePlaceAdd}
				/>
			</Grid>

			<Grid item xs={12}>
				<RadioGroup
					row
					value={newNearbyPlaces.searchBy}
					onChange={(e) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							searchBy: e.target.value,
						}))
					}
				>
					<FormControlLabel
						value="type"
						control={<Radio />}
						label="Search by type"
					/>
					<FormControlLabel
						value="keyword"
						control={<Radio />}
						label="Search by keyword"
					/>
				</RadioGroup>
			</Grid>

			<Grid item xs={12}>
				{newNearbyPlaces.searchBy === "type" ? (
					<TypeSelectionField
						type={newNearbyPlaces.type}
						setType={(newValue) => {
							console.log("New Value: ", newValue);
							setNewNearbyPlaces((prev) => ({
								...prev,
								type: newValue,
							}));
						}}
					/>
				) : (
					<TextField
						fullWidth
						size="small"
						label="Keyword"
						value={newNearbyPlaces.keyword}
						onChange={(e) =>
							setNewNearbyPlaces((prev) => ({
								...prev,
								keyword: e.target.value,
							}))
						}
					/>
				)}
			</Grid>

			{/* {newNearbyPlaces.locationBias &&
				((newNearbyPlaces.searchBy === "type" &&
					newNearbyPlaces.type) ||
					(newNearbyPlaces.searchBy === "keyword" &&
						newNearbyPlaces.keyword)) && (
					<Grid item xs={12}>
						<iframe
							width="100%"
							height="450"
							// style="border:0"
							style={{
								border: 0,
							}}
							loading="lazy"
							allowfullscreen
							referrerPolicy="no-referrer-when-downgrade"
							src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&language=en&q=${
								newNearbyPlaces.searchBy === "type"
									? newNearbyPlaces.type
									: newNearbyPlaces.keyword
							}s near ${
								savedPlacesMap[newNearbyPlaces.locationBias]
									.displayName.text
							}`}
						></iframe>
					</Grid>
				)} */}

			<Grid item xs={12}>
				<TextField
					type="number"
					value={newNearbyPlaces.minRating}
					label="Min Rating"
					onChange={(e) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							minRating: e.target.value,
						}))
					}
					inputProps={{ step: 0.5, min: 0, max: 5 }}
					size="small"
					fullWidth
				/>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth size="small">
					<InputLabel>Price</InputLabel>
					<Select
						// input={<OutlinedInput label="Tag" />}
						value={newNearbyPlaces.priceLevels}
						onChange={(e) =>
							setNewNearbyPlaces((prev) => ({
								...prev,
								priceLevels: e.target.value,
							}))
						}
						label={"Price"}
						multiple
						renderValue={(selected) => {
							if (selected.length === 0) {
								return <em>Any</em>; // Custom label for empty array
							}
							return selected
								.map((value) => priceMap[value] || value)
								.join(", ");
						}}
					>
						{Object.keys(priceMap).map((key) => (
							<MenuItem key={key} value={key}>
								<Checkbox
									checked={
										newNearbyPlaces.priceLevels.indexOf(
											key
										) > -1
									}
								/>
								<ListItemText primary={priceMap[key]} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Typography variant="caption">
					The default is to select all price levels.
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<RadioGroup
					row
					value={newNearbyPlaces.rankPreference}
					onChange={(e) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							rankPreference: e.target.value,
						}))
					}
				>
					<FormControlLabel
						value="RELEVANCE"
						control={<Radio />}
						label="Rank by Relevance"
					/>
					<FormControlLabel
						value="DISTANCE"
						control={<Radio />}
						label="Rank by Distance"
					/>
				</RadioGroup>
			</Grid>
			{/* {newNearbyPlaces.rankPreference === "prominence" && (
				<Grid item xs={12}>
					<TextField
						fullWidth
						size="small"
						label="Radius (meters)"
						type="number"
						value={newNearbyPlaces.radius}
						onChange={(e) =>
							setNewNearbyPlaces((prev) => ({
								...prev,
								radius: e.target.value,
							}))
						}
					/>
				</Grid>
			)} */}
			<Grid item xs={12}>
				<LoadingButton
					variant="contained"
					fullWidth
					onClick={searchNearbyPlaces}
					startIcon={<Add />}
					loading={loading}
					loadingPosition="start"
				>
					Add Nearby POIs
				</LoadingButton>
				<h6 className="px-2  text-sm text-center">
					Note: Added pois may differ from what is shown in the map.
				</h6>
			</Grid>
		</Grid>
	);
}
