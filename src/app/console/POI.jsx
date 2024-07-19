"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField, IconButton } from "@mui/material";
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
import { Add } from "@mui/icons-material";

function POICard({
	selectedPlacesMap,
	savedPlacesMap,
	setSavedPlacesMap,
	poi,
	poisMap,
	setPoisMap,
	index2,
	place_id,
	setSelectedPlacesMap,
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
		<div className="bg-white">
			<div className="flex flex-row gap-1 w-full items-center p-2">
				<h1 className={`w-[50%] text-center`}>
					{savedPlacesMap[place_id].name ||
						selectedPlacesMap[place_id].alias}
				</h1>
				<h1 className={`w-[18%] text-center`}>{poi.type}</h1>
				<h1 className={`w-[18%] text-center`}>
					{
						poisMap[place_id][index2].places.filter(
							(place) => place.selected
						).length
					}
				</h1>
				<IconButton
					sx={{
						height: "3rem",
						width: "3rem",
					}}
					onClick={() => {
						const newPoisMap = {
							...poisMap,
						};
						newPoisMap[place_id].splice(index2, 1);
						if (newPoisMap[place_id].length === 0)
							delete newPoisMap[place_id];
						setPoisMap(newPoisMap);
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
				<div className="px-2 py-1 border-t-2 border-black">
					{poi.places.map((place, index3) => (
						<div className="flex flex-col w-full" key={index3}>
							<div className="flex flex-row gap-2 items-center">
								<input
									type="checkbox"
									className="w-5 h-5"
									checked={place.selected}
									onChange={(event) => {
										const newPoisMap = { ...poisMap };
										newPoisMap[place_id][index2].places[
											index3
										].selected = event.target.checked;
										setPoisMap(newPoisMap);
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
							{index3 < poi.places.length - 1 && (
								<div className="border-b-2 border-black w-full"></div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export function DiscoverArea({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	poisMap,
	setSelectedPlacesMap,
	setPoisMap,
}) {
	const [newPois, setNewPois] = useState({ location: "", type: "" });
	const [loading, setLoading] = useState(false);
	// useEffect(() => {
	// 	console.log(selectedPlacesMap);
	// }, [selectedPlacesMap]);

	const searchInsidePlaces = async () => {
		if (newPois.location === "" || newPois.type === "") return;

		setLoading(true);
		try {
			const res = await mapApi.getInside({
				location: newPois.location,
				type: newPois.type,
			});
			if (res.success) {
				const places = res.data.results;
				const newPoisMap = { ...poisMap };
				if (newPoisMap[newPois.location] === undefined) {
					newPoisMap[newPois.location] = [];
				}

				const placesWithSelection = places.map((place) => ({
					selected: true,
					place_id: place.place_id,
					name: place.name,
					formatted_address: place.formatted_address,
				}));

				newPoisMap[newPois.location].push({
					type: newPois.type,
					places: placesWithSelection,
				});

				setPoisMap(newPoisMap);
				setLoading(false);
				// const newSavedPlacesMap = { ...savedPlacesMap };
				// for (const place of results) {
				// 	if (newSavedPlacesMap[place.place_id] === undefined) {
				// 		try {
				// 			const res2 = await mapApi.getDetails(
				// 				place.place_id
				// 			);
				// 			if (res2.success) {
				// 				newSavedPlacesMap[place.place_id] =
				// 					res2.data[0];
				// 				console.log("saved: ", res.data[0].place_id);
				// 			}
				// 		} catch (error) {
				// 			console.error(error);
				// 		}
				// 	}
				// }
				// setSavedPlacesMap(newSavedPlacesMap);
			}
		} catch (error) {
			// console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};

	return (
		<>
			{Object.keys(poisMap).length > 0 && (
				<div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
					<div className="flex flex-row">
						<h1 className="text-lg w-[50%] text-center font-bold">
							Location
						</h1>
						<h1 className="text-lg w-[18%] text-center font-bold">
							Type
						</h1>

						<h1 className="text-lg w-[18%] text-center font-bold">
							Count
						</h1>
					</div>
					{Object.keys(poisMap).map((place_id, index1) => (
						<div key={index1} className="flex flex-col gap-1 ">
							{poisMap[place_id].map((poi, index2) => (
								<POICard
									key={index2}
									selectedPlacesMap={selectedPlacesMap}
									savedPlacesMap={savedPlacesMap}
									setSavedPlacesMap={setSavedPlacesMap}
									poi={poi}
									poisMap={poisMap}
									setPoisMap={setPoisMap}
									index2={index2}
									place_id={place_id}
									setSelectedPlacesMap={setSelectedPlacesMap}
								/>
							))}
						</div>
					))}
				</div>
			)}
			<div className="flex flex-col gap-2 w-full p-2">
				<div className="w-full">
					<FormControl
						fullWidth
						className="input-field"
						variant="outlined"
						// style={{ width: "20rem" }}
						size="small"
					>
						<InputLabel
							htmlFor="outlined-adornment"
							className="input-label"
						>
							Location
						</InputLabel>
						<Select
							required
							id="outlined-adornment"
							className="outlined-input"
							value={newPois.location}
							onChange={(event) => {
								setNewPois((prev) => ({
									...prev,
									location: event.target.value,
								}));
							}}
							input={<OutlinedInput label={"Location"} />}
							// MenuProps={MenuProps}
						>
							{Object.keys(selectedPlacesMap).map(
								(place_id, index) => (
									<MenuItem key={index} value={place_id}>
										{savedPlacesMap[place_id].name ||
											selectedPlacesMap[place_id].alias}
									</MenuItem>
								)
							)}
						</Select>
					</FormControl>
				</div>
				<div className="w-full">
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
							setNewPois((prev) => ({
								...prev,
								type: newValue,
							}));
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Type"
								value={newPois.type} // Step 3: Bind the value to state
								onChange={(e) => {
									setNewPois((prev) => ({
										...prev,
										type: e.target.value,
									}));
								}}
							/>
						)}
					/>
				</div>

				<div className="w-full">
					<LoadingButton
						variant="contained"
						fullWidth
						onClick={searchInsidePlaces}
						sx={{ fontSize: "1rem" }}
						startIcon={<Add />}
						loading={loading}
						loadingPosition="start"
					>
						Add ($)
					</LoadingButton>
				</div>
			</div>
		</>
	);
}
export default function POI({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	poisMap,
	setSelectedPlacesMap,
	setPoisMap,
}) {
	return (
		// Object.keys(selectedPlacesMap).length > 0 &&
		<div className="flex flex-col border-4 w-full border-black rounded-lg">
			<div className="flex flex-col items-center bg-black text-center pb-2">
				<h1 className="text-xl md:text-3xl text-white">
					Places in an Area
				</h1>
				<p className="text-sm md:text-lg text-zinc-300">
					Results of the Points of Interest search
				</p>
			</div>
			<DiscoverArea
				{...{
					savedPlacesMap,
					setSavedPlacesMap,
					selectedPlacesMap,
					poisMap,
					setSelectedPlacesMap,
					setPoisMap,
				}}
			/>
		</div>
	);
}
