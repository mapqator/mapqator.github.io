"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	Select,
	MenuItem,
	Button,
	TextField,
	IconButton,
	Typography,
	Card,
	CardActionArea,
	Grid,
	CardContent,
	FormControlLabel,
	RadioGroup,
	Radio,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faTrashCan,
	faAdd,
} from "@fortawesome/free-solid-svg-icons";
import placeTypes from "@/app/types.json";
import Autocomplete from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import { Add, Search } from "@mui/icons-material";

function NearbyCard({
	index2,
	selectedPlacesMap,
	savedPlacesMap,
	setSavedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	setSelectedPlacesMap,
	place_id,
	e,
}) {
	const [expanded, setExpanded] = useState(false);

	const handleAddSave = async (place_id) => {
		let details = selectedPlacesMap[place_id];
		if (details === undefined) {
			details = savedPlacesMap[place_id];
			if (details === undefined) {
				const res = await mapApi.getDetails(place_id);
				if (res.success) {
					details = res.data.result;
					setSavedPlacesMap((prev) => ({
						...prev,
						[place_id]: details,
					}));
				} else {
					console.error("Error fetching data: ", res.error);
					return;
				}
			}
			handleAdd(details);
		} else {
			console.log("Already saved: ", details);
		}
		return details;
	};

	const handleAdd = (details) => {
		const place_id = details["place_id"];
		if (place_id === "" || selectedPlacesMap[place_id]) return;
		setSelectedPlacesMap((prev) => ({
			...prev,
			[place_id]: {
				alias: "",
				selectedAttributes: ["formatted_address"],
				attributes: Object.keys(details).filter(
					(key) => details[key] !== null
				),
			},
		}));
	};

	return (
		<div className="bg-white" key={index2}>
			<div className="flex flex-row gap-1 w-full items-center bg-white p-2">
				<h1 className={`text-center w-[36%]`}>
					{savedPlacesMap[place_id].name ||
						selectedPlacesMap[place_id].alias}
				</h1>
				<h1 className={`text-center w-[25%]`}>
					{e.type === "any" ? e.keyword : e.type}
				</h1>
				{/* <h1 className={`text-center w-[17%]`}>{e.keyword || "N/A"}</h1> */}
				<h1 className={`text-center w-[25%]`}>
					{e.hasRadius ? e.radius + " m" : "Distance"}
				</h1>
				{/* <h1
														className={`text-center w-[14%]`}
													>
														{e.places.length}
													</h1> */}
				<IconButton
					sx={{
						height: "3rem",
						width: "3rem",
					}}
					onClick={() => {
						const newNearbyPlacesMap = {
							...nearbyPlacesMap,
						};
						newNearbyPlacesMap[place_id].splice(index2, 1);

						if (newNearbyPlacesMap[place_id].length === 0)
							delete newNearbyPlacesMap[place_id];
						setNearbyPlacesMap(newNearbyPlacesMap);
					}}
				>
					<div className="text-sm md:text-2xl">
						<FontAwesomeIcon icon={faTrashCan} color="red" />
					</div>
				</IconButton>
				<IconButton
					sx={{ height: "3rem", width: "3rem" }}
					onClick={() => setExpanded((prev) => !prev)}
				>
					<div className="text-sm md:text-2xl">
						<FontAwesomeIcon
							icon={expanded ? faChevronUp : faChevronDown}
							color="black"
						/>
					</div>
				</IconButton>
			</div>
			{expanded && (
				<div className="bg-white px-2 py-1 border-2 rounded-md border-black mx-5 mb-5">
					{e.places.map((place, index3) => (
						<div className="flex flex-col w-full" key={index3}>
							<div className="flex flex-row gap-2 items-center">
								<input
									type="checkbox"
									className="w-5 h-5"
									checked={place.selected}
									onChange={(event) => {
										const newNearbyPlacesMap = {
											...nearbyPlacesMap,
										};
										newNearbyPlacesMap[place_id][
											index2
										].places[index3].selected =
											event.target.checked;
										setNearbyPlacesMap(newNearbyPlacesMap);
									}}
								/>
								<h1 className="overflow-hidden whitespace-nowrap overflow-ellipsis w-[95%]">
									{place.name} - {place.formatted_address}
								</h1>
								<IconButton
									sx={{ height: "3rem", width: "3rem" }}
									onClick={() => {
										handleAddSave(place.place_id);
									}}
								>
									<FontAwesomeIcon icon={faAdd} />
								</IconButton>
							</div>
							{index3 < e.places.length - 1 && (
								<div className="border-b-2 border-black w-full"></div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function NearbyInfo({
	savedPlacesMap,
	selectedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	setSavedPlacesMap,
	setSelectedPlacesMap,
}) {
	const [newNearbyPlaces, setNewNearbyPlaces] = useState({
		location: "",
		type: "",
		keyword: "",
		radius: 1000,
		rankBy: "distance",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setNewNearbyPlaces((prev) => ({
			location: "",
			type: "",
			keyword: "",
			radius: 1000,
			rankBy: "distance",
		}));
	}, [selectedPlacesMap]);

	const searchNearbyPlaces = async () => {
		if (newNearbyPlaces.location === "" || newNearbyPlaces.type === "")
			return;
		setLoading(true);
		try {
			const loc =
				savedPlacesMap[newNearbyPlaces.location].geometry.location;
			const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
			const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
			if (!placeTypes.includes(newNearbyPlaces.type)) {
				newNearbyPlaces.keyword = newNearbyPlaces.type;
				newNearbyPlaces.type = "";
			}

			const response = await mapApi.getNearby({
				location: newNearbyPlaces.location,
				lat,
				lng,
				radius: newNearbyPlaces.radius,
				type: newNearbyPlaces.type,
				keyword: newNearbyPlaces.keyword,
				rankBy: newNearbyPlaces.rankBy,
			});
			if (response.success) {
				const places = response.data.results;
				console.log("Nearby Places: ", response.data);
				const newNearbyPlacesMap = { ...nearbyPlacesMap };
				if (
					newNearbyPlacesMap[newNearbyPlaces.location] === undefined
				) {
					newNearbyPlacesMap[newNearbyPlaces.location] = [];
				}

				const placesWithSelection = places.map((place) => ({
					selected: true,
					place_id: place.place_id,
					name: place.name,
					formatted_address: place.vicinity,
				}));

				newNearbyPlacesMap[newNearbyPlaces.location].push({
					type: placeTypes.includes(newNearbyPlaces.type)
						? newNearbyPlaces.type
						: "any",
					places: placesWithSelection,
					keyword: placeTypes.includes(newNearbyPlaces.type)
						? ""
						: newNearbyPlaces.keyword,
					radius: newNearbyPlaces.radius,
					rankBy: newNearbyPlaces.rankBy,
				});

				setNearbyPlacesMap(newNearbyPlacesMap);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};

	return (
		<Card raised>
			<CardContent>
				{Object.keys(nearbyPlacesMap).length > 0 && (
					<div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
						<div className="flex flex-row">
							<h1 className="text-lg w-[36%] text-center font-bold">
								Location
							</h1>
							<h1 className="text-lg w-[25%] text-center font-bold">
								Type
							</h1>
							{/* <h1 className="text-lg w-[17%] text-center font-bold">
							Keyword
						</h1> */}
							<h1 className="text-lg w-[25%] text-center font-bold">
								Rank By/Radius
							</h1>
							{/* <h1 className="text-lg w-[14%] text-center font-bold">
								Count
							</h1> */}
						</div>

						{Object.keys(nearbyPlacesMap).map(
							(place_id, index1) => (
								<div
									key={index1}
									className="flex flex-col gap-1 "
								>
									{nearbyPlacesMap[place_id].map(
										(e, index2) => (
											<NearbyCard
												key={index2}
												{...{
													index2,
													selectedPlacesMap,
													savedPlacesMap,
													setSavedPlacesMap,
													nearbyPlacesMap,
													setNearbyPlacesMap,
													place_id,
													setSelectedPlacesMap,
													e,
												}}
											/>
										)
									)}
								</div>
							)
						)}
					</div>
				)}
				<Typography variant="h5" gutterBottom>
					Search Nearby Places
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<FormControl fullWidth size="small">
							<InputLabel>Location</InputLabel>
							<Select
								value={newNearbyPlaces.location}
								onChange={(e) =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										location: e.target.value,
									}))
								}
								label="Location"
							>
								{Object.keys(selectedPlacesMap).map(
									(place_id) => (
										<MenuItem
											key={place_id}
											value={place_id}
										>
											{savedPlacesMap[place_id].name ||
												selectedPlacesMap[place_id]
													.alias}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							size="small"
							options={placeTypes}
							fullWidth
							freeSolo
							getOptionLabel={(option) =>
								`${option
									.replace(/_/g, " ") // Replace underscores with spaces
									.split(" ") // Split the string into an array of words
									.map(
										(word) =>
											word.charAt(0).toUpperCase() +
											word.slice(1)
									) // Capitalize the first letter of each word
									.join(" ")}`
							}
							onChange={(e, newValue) => {
								// console.log("newValue: ", newValue);
								setNewNearbyPlaces((prev) => ({
									...prev,
									type: newValue,
								}));
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Type"
									value={newNearbyPlaces.type} // Step 3: Bind the value to state
									onChange={(e) => {
										// console.log("newValue: ", newValue);
										setNewNearbyPlaces((prev) => ({
											...prev,
											type: e.target.value,
										}));
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<RadioGroup
							row
							value={newNearbyPlaces.rankBy}
							onChange={(e) =>
								setNewNearbyPlaces((prev) => ({
									...prev,
									rankBy: e.target.value,
								}))
							}
						>
							<FormControlLabel
								value="distance"
								control={<Radio />}
								label="Rank by Distance"
							/>
							<FormControlLabel
								value="prominence"
								control={<Radio />}
								label="Rank by Prominence"
							/>
						</RadioGroup>
					</Grid>
					{newNearbyPlaces.rankBy === "prominence" && (
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
					)}
					<Grid item xs={12}>
						<LoadingButton
							variant="contained"
							fullWidth
							onClick={searchNearbyPlaces}
							startIcon={<Search />}
							loading={loading}
							loadingPosition="start"
						>
							Search Nearby Places
						</LoadingButton>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
}
