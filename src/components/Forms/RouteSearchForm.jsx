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
	Divider,
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
import TravelSelectionField from "../InputFields/TravelSelectionField.";

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
const avoidMap = {
	avoidTolls: "Tolls",
	avoidHighways: "Highways",
	avoidFerries: "Ferries",
};
export default function RouteSearchForm({
	handlePlaceAdd,
	newRoutePlaces,
	setNewRoutePlaces,
}) {
	const { selectedPlacesMap, routePlacesMap, setRoutePlacesMap } =
		useContext(GlobalContext);
	const { savedPlacesMap, setSavedPlacesMap } = useContext(AppContext);

	const handleSave = async (place) => {
		let details = savedPlacesMap[place.id];
		if (details === undefined) {
			setSavedPlacesMap((prev) => ({
				...prev,
				[place.id]: place,
			}));
		}
	};

	const [loading, setLoading] = useState(false);
	const searchNearbyPlaces = async () => {
		if (newRoutePlaces.type === "") return;
		setLoading(true);

		if (!placeTypes.includes(newRoutePlaces.type)) {
			newRoutePlaces.keyword = newRoutePlaces.type;
			newRoutePlaces.type = "";
		} else {
			newRoutePlaces.keyword = "";
		}

		console.log("Searching for nearby places: ", newRoutePlaces);
		const response = await mapApi.searchAlongRoute({
			origin: newRoutePlaces.origin,
			destination: newRoutePlaces.destination,
			travelMode: newRoutePlaces.travelMode,
			routeModifiers: newRoutePlaces.routeModifiers,
			searchBy: newRoutePlaces.searchBy,
			type: newRoutePlaces.type,
			keyword: newRoutePlaces.keyword,
			rankPreference: newRoutePlaces.rankPreference,
			minRating: newRoutePlaces.minRating,
			priceLevels: newRoutePlaces.priceLevels,
			maxResultCount: newRoutePlaces.maxResultCount,
		});

		if (response.success) {
			const newRoutePlacesMap = [...routePlacesMap];
			const places = response.data.nearby_response.places;
			// const placesWithSelection = places.map((place) => ({
			// 	id: place.id,
			// 	displayName: place.displayName,
			// 	shortFormattedAddress: place.shortFormattedAddress,
			// 	rating: place.rating,
			// 	priceLevel: place.priceLevel,
			// 	userRatingCount: place.userRatingCount,
			// 	location: place.location,
			// }));

			newRoutePlacesMap.push({
				routes: response.data.route_response.routes,
				type:
					newRoutePlaces.searchBy === "type"
						? newRoutePlaces.type
						: newRoutePlaces.keyword,
				minRating: newRoutePlaces.minRating,
				priceLevels: newRoutePlaces.priceLevels,
				rankBy: newRoutePlaces.rankPreference,
				places: places,
			});

			setRoutePlacesMap(newRoutePlacesMap);
			setNewRoutePlaces((prev) => ({
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
		newRoutePlaces && (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<PlaceSelectionField
						label="Origin"
						value={newRoutePlaces.origin}
						onChange={(event) => {
							setNewRoutePlaces((prev) => ({
								...prev,
								origin: event.target.value,
							}));
						}}
						handlePlaceAdd={handlePlaceAdd}
					/>
				</Grid>

				<Grid item xs={12}>
					<PlaceSelectionField
						label="Destination"
						value={newRoutePlaces.destination}
						onChange={(event) => {
							setNewRoutePlaces((prev) => ({
								...prev,
								destination: event.target.value,
							}));
						}}
						handlePlaceAdd={handlePlaceAdd}
					/>
				</Grid>

				<Grid item xs={12}>
					<TravelSelectionField
						mode={newRoutePlaces.travelMode}
						setMode={(value) =>
							setNewRoutePlaces((prev) => ({
								...prev,
								travelMode: value,
							}))
						}
					/>
				</Grid>

				{["DRIVE", "TWO_WHEELER"].includes(
					newRoutePlaces.travelMode
				) && (
					<Grid item xs={12}>
						<FormControl fullWidth size="small">
							<InputLabel>Avoid</InputLabel>
							<Select
								// input={<OutlinedInput label="Tag" />}
								value={Object.entries(
									newRoutePlaces.routeModifiers
								)
									.map(([key, value]) => (value ? key : null))
									.filter((x) => x)}
								onChange={(e) => {
									const newOptions = {
										...newRoutePlaces.routeModifiers,
									};
									Object.keys(avoidMap).forEach((key) => {
										newOptions[key] =
											e.target.value.includes(key);
									});
									setNewRoutePlaces((prev) => ({
										...prev,
										routeModifiers: newOptions,
									}));
								}}
								label={"Avoid"}
								multiple
								renderValue={(selected) => {
									if (selected.length === 0) {
										return <em>Any</em>; // Custom label for empty array
									}
									return selected
										.map((value) => avoidMap[value])
										.join(", ");
								}}
							>
								{Object.keys(avoidMap).map((key) => (
									<MenuItem key={key} value={key}>
										<Checkbox
											checked={
												newRoutePlaces.routeModifiers[
													key
												]
											}
										/>
										<ListItemText primary={avoidMap[key]} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
				)}

				<Grid item xs={12}>
					<Divider className="w-full pt-4" />
				</Grid>

				<Grid item xs={12}>
					<RadioGroup
						row
						value={newRoutePlaces.searchBy}
						onChange={(e) =>
							setNewRoutePlaces((prev) => ({
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
					{newRoutePlaces.searchBy === "type" ? (
						<TypeSelectionField
							type={newRoutePlaces.type}
							setType={(newValue) => {
								console.log("New Value: ", newValue);
								setNewRoutePlaces((prev) => ({
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
							value={newRoutePlaces.keyword}
							onChange={(e) =>
								setNewRoutePlaces((prev) => ({
									...prev,
									keyword: e.target.value,
								}))
							}
						/>
					)}
				</Grid>

				<Grid item xs={12}>
					<TextField
						type="number"
						value={newRoutePlaces.minRating}
						label="Min Rating"
						onChange={(e) =>
							setNewRoutePlaces((prev) => ({
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
							value={newRoutePlaces.priceLevels}
							onChange={(e) =>
								setNewRoutePlaces((prev) => ({
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
											newRoutePlaces.priceLevels.indexOf(
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
						value={newRoutePlaces.rankPreference}
						onChange={(e) =>
							setNewRoutePlaces((prev) => ({
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

				<Grid item xs={12}>
					<TextField
						type="number"
						label="Max Results (1 to 20)"
						value={newRoutePlaces.maxResultCount}
						onChange={(e) =>
							setNewRoutePlaces((prev) => ({
								...prev,
								maxResultCount: e.target.value,
							}))
						}
						fullWidth
						size="small"
						inputProps={{ min: 1, max: 20, step: 1 }}
					/>
				</Grid>

				<Grid item xs={12}>
					<LoadingButton
						variant="contained"
						fullWidth
						onClick={searchNearbyPlaces}
						startIcon={<Add />}
						loading={loading}
						loadingPosition="start"
					>
						Add Places
					</LoadingButton>
				</Grid>
			</Grid>
		)
	);
}
