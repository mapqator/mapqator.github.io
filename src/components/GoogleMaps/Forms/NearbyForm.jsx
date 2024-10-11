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
	Box,
	Paper,
} from "@mui/material";
import types from "@/database/newtypes.json";
import { LoadingButton } from "@mui/lab";
import { Add, Search } from "@mui/icons-material";
import PlaceSelectionField from "@/components/GoogleMaps/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useContext } from "react";
import TypeSelectionField from "@/components/GoogleMaps/InputFields/TypeSelectionField";
import { AppContext } from "@/contexts/AppContext";
import { showError } from "@/contexts/ToastProvider";
import {
	GoogleMap,
	LoadScript,
	useJsApiLoader,
	Marker,
} from "@react-google-maps/api";
import PoiSelectionField from "../InputFields/PoiSelectionField";
import NearbyComponent from "../Embed/NearbyComponent";
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

export default function NearbyForm({
	handlePlaceAdd,
	newNearbyPlaces,
	setNewNearbyPlaces,
}) {
	const {
		selectedPlacesMap,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
		tools,
	} = useContext(GlobalContext);

	const [list, setList] = useState([]);
	const [apiCalls, setApiCalls] = useState([]);
	const [routingSummaries, setRoutingSummaries] = useState([]);
	const [uuid, setUuid] = useState("");

	const { apiCallLogs, setApiCallLogs } = useContext(GlobalContext);

	const [mapsApi, setMapsApi] = useState(null);
	useEffect(() => {
		const loadMapsApi = async () => {
			const mapsModule = await import(
				process.env.NEXT_PUBLIC_MAPS_API_PATH
			);
			setMapsApi(mapsModule.default);
		};

		loadMapsApi();
	}, []);

	const handleSave = async (place) => {
		let details = savedPlacesMap[place.id];
		if (details === undefined) {
			setSavedPlacesMap((prev) => ({
				...prev,
				[place.id]: place,
			}));
		}
	};

	console.log("New nearby: ", newNearbyPlaces);

	const [loading, setLoading] = useState(false);
	const searchNearbyPlaces = async () => {
		if (newNearbyPlaces.locationBias === "" || newNearbyPlaces.type === "")
			return;
		setLoading(true);

		if (!placeTypes.includes(newNearbyPlaces.type)) {
			newNearbyPlaces.keyword = newNearbyPlaces.type;
			newNearbyPlaces.type = "";
		} else {
			newNearbyPlaces.keyword = "";
		}

		if (list.length > 0) {
			const places = list;

			const newNearbyPlacesMap = [...nearbyPlacesMap];

			newNearbyPlacesMap.push({
				locationBias: newNearbyPlaces.locationBias,
				type: newNearbyPlaces.type,
				keyword: newNearbyPlaces.keyword,
				minRating: newNearbyPlaces.minRating,
				priceLevels: newNearbyPlaces.priceLevels,
				rankPreference: newNearbyPlaces.rankPreference,
				places: places,
				routingSummaries: routingSummaries,
				uuid,
			});

			setNearbyPlacesMap(newNearbyPlacesMap);
			setApiCallLogs((prev) => [...prev, ...apiCalls]);
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

	const fetchNearbyPlaces = async (data) => {
		if (!mapsApi) return;
		if (data.locationBias === "" || data.type === "") return;
		setLoading(true);
		const location = savedPlacesMap[data.locationBias].location;
		const lat = location.latitude;
		const lng = location.longitude;

		if (!placeTypes.includes(data.type)) {
			data.keyword = data.type;
			data.type = "";
		} else {
			data.keyword = "";
		}

		const response = await tools.nearbySearch.run({
			lat,
			lng,
			locationBias: data.locationBias,
			searchBy: data.searchBy,
			type: data.type,
			keyword: data.keyword,
			rankPreference: data.rankPreference,
			minRating: data.minRating,
			priceLevels: data.priceLevels,
			maxResultCount: data.maxResultCount,
		});

		if (response.success) {
			const places = response.data.result.places;
			setList(places);
			setApiCalls(response.data.apiCallLogs);
			setUuid(response.data.uuid);
			setRoutingSummaries(response.data.result.routingSummaries);
		} else {
			showError("Couldn't find nearby places.");
		}
		setLoading(false);
	};
	// Wrap the fetchNearbyPlaces function with debounce
	const debouncedFetchNearbyPlaces = useCallback(
		debounce(fetchNearbyPlaces, 1000),
		[tools]
	);

	useEffect(() => {
		debouncedFetchNearbyPlaces(newNearbyPlaces);
	}, [newNearbyPlaces, debouncedFetchNearbyPlaces]);

	if (!mapsApi) {
		return <div>Loading...</div>;
	}

	return (
		newNearbyPlaces && (
			<Box className="flex flex-col md:flex-row gap-4">
				<Box className="w-1/2">
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

						{/* <Grid item xs={12}>
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
						</Grid> */}

						<Grid item xs={12}>
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
						</Grid>
						{/* <Grid item xs={12}>
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
						</Grid> */}

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
									.displayName?.text
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
													newNearbyPlaces.priceLevels.indexOf(
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
						<Grid item xs={12}>
							<TextField
								type="number"
								label="Max Results (1 to 20)"
								value={newNearbyPlaces.maxResultCount}
								onChange={(e) =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										maxResultCount: e.target.value,
									}))
								}
								fullWidth
								size="small"
								inputProps={{ min: 1, max: 20, step: 1 }}
							/>
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
							{/* <h6 className="px-2  text-sm text-center">
						Note: Added pois may differ from what is shown in the
						map.
					</h6> */}
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
						{newNearbyPlaces.locationBias === "" ? (
							<Box className="h-[365px] flex flex-row items-center justify-center">
								<h1
									// variant="body1"
									className="text-center p-4 text-xl text-zinc-400"
								>
									Select a location to view nearby places.
								</h1>
							</Box>
						) : (
							<NearbyComponent
								height={"365px"}
								places={list}
								locationBias={
									savedPlacesMap[newNearbyPlaces.locationBias]
								}
							/>
						)}
					</Paper>
				</Box>
			</Box>
		)
	);
}
