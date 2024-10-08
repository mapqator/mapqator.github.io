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
	Box,
	Paper,
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
import RoutePlacesComponent from "../GoogleMap/RoutePlacesComponent";
import debounce from "lodash/debounce";

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
	const [routes, setRoutes] = useState([]);
	const [places, setPlaces] = useState([]);

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

		if (routes.length > 0 && places.length > 0) {
			const newRoutePlacesMap = [...routePlacesMap];
			newRoutePlacesMap.push({
				type:
					newRoutePlaces.searchBy === "type"
						? newRoutePlaces.type
						: newRoutePlaces.keyword,
				minRating: newRoutePlaces.minRating,
				priceLevels: newRoutePlaces.priceLevels,
				rankBy: newRoutePlaces.rankPreference,
				routes: routes,
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

	const compute = async (data) => {
		if (data.origin === "" || data.destination === "") {
			return;
		}
		setLoading(true);

		if (data.type === "") {
			const response = await mapApi.getDirectionsNew(data);
			if (response.success) {
				setRoutes(response.data.routes);
			}
		} else {
			const response = await mapApi.searchAlongRoute(data);
			if (response.success) {
				setRoutes(response.data.route_response.routes);
				setPlaces(response.data.nearby_response.places);
			}
		}
		setLoading(false);
	};

	const debouncedCompute = useCallback(debounce(compute, 1000), [
		newRoutePlaces,
	]);

	useEffect(() => {
		debouncedCompute(newRoutePlaces);
	}, [newRoutePlaces, debouncedCompute]);
	return (
		newRoutePlaces && (
			<Box className="flex flex-col md:flex-row gap-4">
				<Box className="w-1/2">
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
											.map(([key, value]) =>
												value ? key : null
											)
											.filter((x) => x)}
										onChange={(e) => {
											const newOptions = {
												...newRoutePlaces.routeModifiers,
											};
											Object.keys(avoidMap).forEach(
												(key) => {
													newOptions[key] =
														e.target.value.includes(
															key
														);
												}
											);
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
														newRoutePlaces
															.routeModifiers[key]
													}
												/>
												<ListItemText
													primary={avoidMap[key]}
												/>
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						)}

						<Grid item xs={12}>
							<Divider className="w-full pt-2" />
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
											.map(
												(value) =>
													priceMap[value] || value
											)
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
											<ListItemText
												primary={priceMap[key]}
											/>
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
				</Box>

				<Box className="w-1/2">
					<Paper elevation={2}>
						<Box>
							<Typography
								variant="h6"
								className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
							>
								Map View
							</Typography>
						</Box>
						{newRoutePlaces.origin === "" &&
						newRoutePlaces.destination === "" ? (
							<Box className="h-[575px] flex flex-row items-center justify-center">
								<h1
									// variant="body1"
									className="text-center p-4 text-xl text-zinc-400"
								>
									Select origin/destination to view route.
								</h1>
							</Box>
						) : (
							<RoutePlacesComponent
								height={"575px"}
								encodedPolyline={
									routes[0]?.polyline.encodedPolyline
								}
								places={places}
								origin={savedPlacesMap[newRoutePlaces.origin]}
								destination={
									savedPlacesMap[newRoutePlaces.destination]
								}
							/>
						)}
					</Paper>
				</Box>
			</Box>
		)
	);
}
