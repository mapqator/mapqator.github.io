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
import { Add } from "@mui/icons-material";

function NearbyCard({
	index2,
	selectedPlacesMap,
	savedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	setSelectedPlacesMap,
	place_id,
	e,
}) {
	const [expanded, setExpanded] = useState(false);

	const handleAdd = (place_id) => {
		if (place_id === "" || selectedPlacesMap[place_id]) return;
		setSelectedPlacesMap((prev) => ({
			...prev,
			[place_id]: {
				alias: "",
				selectedAttributes: ["formatted_address"],
				attributes: Object.keys(savedPlacesMap[place_id]).filter(
					(key) => savedPlacesMap[place_id][key] !== null
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
										handleAdd(place.place_id);
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
export default function NearbyInformation({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	setSelectedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
}) {
	// place_id -> place
	const [newNearbyPlaces, setNewNearbyPlaces] = useState({
		location: "",
		type: "",
		keyword: "",
		radius: 1,
		rankBy: "distance",
		hasRadius: false,
		list: [],
	});
	const [nearbyPlacesResults, setNearbyPlacesResults] = useState([]); // list of places from nearby search
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setNewNearbyPlaces({
			location: "",
			type: "",
			keyword: "",
			radius: 1,
			rankBy: "distance",
			hasRadius: false,
			list: [],
		});
		setNearbyPlacesResults([]);
	}, [selectedPlacesMap]);

	const addNearbyPlaces = async () => {
		const newSavedPlacesMap = { ...savedPlacesMap };
		// const newSelectedPlacesMap = { ...selectedPlacesMap };
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		const selectedPlaces = nearbyPlacesResults.filter((e) => e.selected);

		if (newNearbyPlacesMap[newNearbyPlaces.location] === undefined) {
			newNearbyPlacesMap[newNearbyPlaces.location] = [];
		}

		newNearbyPlacesMap[newNearbyPlaces.location].push({
			type: newNearbyPlaces.type,
			places: selectedPlaces.map((e) => {
				return {
					place_id: e.place.place_id,
					name: e.place.name,
					formatted_address: e.place.vicinity,
				};
			}),
			keyword: newNearbyPlaces.keyword,
			radius: newNearbyPlaces.radius,
			hasRadius: newNearbyPlaces.hasRadius,
			rankBy: newNearbyPlaces.rankBy,
		});

		setNearbyPlacesMap(newNearbyPlacesMap);
		setNearbyPlacesResults([]);

		console.log("Need to save in database");
		for (const e of selectedPlaces) {
			if (newSavedPlacesMap[e.place.place_id] === undefined) {
				try {
					const res2 = await mapApi.getDetails(e.place.place_id);
					if (res2.success) {
						newSavedPlacesMap[e.place.place_id] = res2.data[0];
						console.log("saved: ", res2.data[0].place_id);
					}
				} catch (error) {
					console.error(error);
				}
			}

			// if (newSelectedPlacesMap[e.place.place_id] === undefined) {
			//   newSelectedPlacesMap[e.place.place_id] = {
			//     alias: "",
			//     selectedAttributes: ["formatted_address", "geometry"],
			//     attributes: Object.keys(newSavedPlacesMap[e.place.place_id]).filter(
			//       (key) => newSavedPlacesMap[e.place.place_id][key] !== null
			//     ),
			//   };
			// }
		}

		// setSelectedPlacesMap(newSelectedPlacesMap);
		setSavedPlacesMap(newSavedPlacesMap);
		// setNewNearbyPlaces({ location: null, type: "", list: [] });
	};

	const searchNearbyPlaces = async () => {
		console.log(newNearbyPlaces);
		if (newNearbyPlaces.location === "" || newNearbyPlaces.type === "")
			return;

		setLoading(true);
		try {
			const loc =
				savedPlacesMap[newNearbyPlaces.location].geometry.location;
			const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
			const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
			const response = await mapApi.getNearby({
				location: newNearbyPlaces.location,
				lat,
				lng,
				radius: newNearbyPlaces.radius,
				type: newNearbyPlaces.type,
				keyword: newNearbyPlaces.keyword,
				rankBy: newNearbyPlaces.hasRadius ? "prominence" : "distance",
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

				if (!placeTypes.includes(newNearbyPlaces.type)) {
					newNearbyPlaces.keyword = newNearbyPlaces.type;
				}
				newNearbyPlacesMap[newNearbyPlaces.location].push({
					type: placeTypes.includes(newNearbyPlaces.type)
						? newNearbyPlaces.type
						: "any",
					places: placesWithSelection,
					keyword: placeTypes.includes(newNearbyPlaces.type)
						? ""
						: newNearbyPlaces.keyword,
					radius: newNearbyPlaces.radius,
					hasRadius: newNearbyPlaces.hasRadius,
					rankBy: newNearbyPlaces.rankBy,
				});

				setNearbyPlacesMap(newNearbyPlacesMap);
				setLoading(false);
				setNearbyPlacesResults(placesWithSelection);
				const newSavedPlacesMap = { ...savedPlacesMap };
				for (const place of places) {
					if (newSavedPlacesMap[place.place_id] === undefined) {
						try {
							const response = await mapApi.getDetails(
								place.place_id
							);
							if (response.success) {
								const res = await placeApi.createPlace(
									response.data.result
								);
								if (res.success) {
									newSavedPlacesMap[place.place_id] =
										res.data[0];
									console.log(
										"saved: ",
										res.data[0].place_id
									);
								}
							}
						} catch (error) {
							console.error(error);
						}
					}
				}
				setSavedPlacesMap(newSavedPlacesMap);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};

	return (
		// Object.keys(selectedPlacesMap).length > 0 &&
		<div className="flex flex-col border-4 w-full border-black rounded-lg">
			<div className="flex flex-col items-center bg-black text-center pb-2">
				<h1 className="text-xl md:text-3xl text-white">
					Nearby Places
				</h1>
				<p className="text-sm md:text-lg text-zinc-300">
					Nearby POIs of a given location
				</p>
			</div>
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

					{Object.keys(nearbyPlacesMap).map((place_id, index1) => (
						<div key={index1} className="flex flex-col gap-1 ">
							{nearbyPlacesMap[place_id].map((e, index2) => (
								<NearbyCard
									key={index2}
									{...{
										index2,
										selectedPlacesMap,
										savedPlacesMap,
										nearbyPlacesMap,
										setNearbyPlacesMap,
										place_id,
										setSelectedPlacesMap,
										e,
									}}
								/>
							))}
						</div>
					))}
				</div>
			)}

			{Object.keys(selectedPlacesMap).length > 0 ? (
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
								value={newNearbyPlaces.location}
								onChange={(event) => {
									setNewNearbyPlaces((prev) => ({
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
												selectedPlacesMap[place_id]
													.alias}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</div>
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
					{/* <div className="w-full">
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
								Type
							</InputLabel>
							<Select
								required
								id="outlined-adornment"
								className="outlined-input"
								value={newNearbyPlaces.type}
								onChange={(event) => {
									setNewNearbyPlaces((prev) => ({
										...prev,
										type: event.target.value,
									}));
								}}
								input={<OutlinedInput label={"Type"} />}
								// MenuProps={MenuProps}
							>
								{placeTypes.map((type, index) => (
									<MenuItem
										key={index}
										value={type}
										// sx={{ width: "2rem" }}
										// style={getStyles(name, personName, theme)}
									>
										{type
											.replace(/_/g, " ") // Replace underscores with spaces
											.split(" ") // Split the string into an array of words
											.map(
												(word) =>
													word
														.charAt(0)
														.toUpperCase() +
													word.slice(1)
											) // Capitalize the first letter of each word
											.join(" ")}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div> */}
					{/* <div className="w-full">
						<TextField
							// required
							fullWidth
							id="outlined-adornment"
							className="outlined-input"
							size="small"
							label="Keyword"
							value={newNearbyPlaces.keyword}
							onChange={(event) => {
								setNewNearbyPlaces((prev) => ({
									...prev,
									keyword: event.target.value,
								}));
							}}
							input={<OutlinedInput label={"Keyword"} />}
							// MenuProps={MenuProps}
						/>
					</div> */}

					<div className="flex flex-row w-full gap-2">
						<div className="flex flex-row w-1/2 gap-2 items-center">
							<input
								type="radio"
								className="w-5 h-5 cursor-pointer"
								checked={!newNearbyPlaces.hasRadius}
								onClick={() =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										hasRadius: false,
									}))
								}
							/>
							<Typography>Rank By Distance</Typography>
						</div>

						<div className="flex flex-row w-1/2 gap-2 items-center">
							<input
								type="radio"
								className="w-5 h-5 cursor-pointer"
								checked={newNearbyPlaces.hasRadius}
								onClick={() =>
									setNewNearbyPlaces((prev) => ({
										...prev,
										hasRadius: true,
									}))
								}
							/>
							<TextField
								// required
								fullWidth
								id="outlined-adornment"
								className="outlined-input"
								size="small"
								label="Radius (m)"
								value={newNearbyPlaces.radius}
								onChange={(event) => {
									setNewNearbyPlaces((prev) => ({
										...prev,
										radius: event.target.value,
									}));
								}}
								type="number"
								// input={<OutlinedInput label={"Radius"} />}
								// MenuProps={MenuProps}
							/>
						</div>
					</div>
					{/* <div className="flex flex-row w-full gap-2">
					<div className="w-full">
						<FormControl
							fullWidth
							className="input-field"
							variant="outlined"
							size="small"
						>
							
							<Select
								required
								id="outlined-adornment"
								className="outlined-input"
								value={
									newNearbyPlaces.hasRadius
										? "radius"
										: "rankBy"
								}
								onChange={(event) => {
									setNewNearbyPlaces((prev) => ({
										...prev,
										hasRadius:
											event.target.value === "radius"
												? true
												: false,
									}));
								}}
								// input={<OutlinedInput label={"Location"} />}
								// MenuProps={MenuProps}
							>
								{["rankBy", "radius"].map((e, index) => (
									<MenuItem key={index} value={e}>
										{e}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className="w-full">
						{newNearbyPlaces.hasRadius ? (
							<TextField
								// required
								fullWidth
								id="outlined-adornment"
								className="outlined-input"
								size="small"
								label="Radius (m)"
								value={newNearbyPlaces.radius}
								onChange={(event) => {
									setNewNearbyPlaces((prev) => ({
										...prev,
										radius: event.target.value,
									}));
								}}
								type="number"
								// input={<OutlinedInput label={"Radius"} />}
								// MenuProps={MenuProps}
							/>
						) : (
							<FormControl
								fullWidth
								className="input-field"
								variant="outlined"
								size="small"
							>
								<InputLabel
									htmlFor="outlined-adornment"
									className="input-label"
								></InputLabel>
								<Select
									required
									id="outlined-adornment"
									className="outlined-input"
									value={newNearbyPlaces.rankBy}
									onChange={(event) => {
										setNewNearbyPlaces((prev) => ({
											...prev,
											rankBy: event.target.value,
										}));
									}}
									// input={<OutlinedInput label={"Location"} />}
									// MenuProps={MenuProps}
								>
									{[
										{
											label: "distance",
											value: "distance",
										},
									].map((e, index) => (
										<MenuItem key={index} value={e.value}>
											{e.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}
					</div>
				</div> */}
					<div className="w-full">
						<LoadingButton
							variant="contained"
							fullWidth
							onClick={searchNearbyPlaces}
							sx={{ fontSize: "1rem" }}
							startIcon={<Add />}
							loading={loading}
							loadingPosition="start"
						>
							Add ($)
						</LoadingButton>
					</div>
				</div>
			) : (
				<p className="text-center my-auto text-xl text-zinc-400 min-h-16 flex items-center justify-center">
					Add places in the context first.
				</p>
			)}

			{/* {nearbyPlacesResults.length > 0 && (
					<div className="flex flex-col gap-2 p-2">
						{nearbyPlacesResults.map((e, index) => (
							<div key={index} className="flex flex-row gap-2">
								<input
									type="checkbox"
									checked={e.selected}
									onChange={(event) => {
										const newNearbyPlacesResults = [
											...nearbyPlacesResults,
										];
										newNearbyPlacesResults[index].selected =
											event.target.checked;
										setNearbyPlacesResults(
											newNearbyPlacesResults
										);
									}}
								/>
								<h1 className="overflow-hidden whitespace-nowrap overflow-ellipsis w-[95%]">
									{e.place.name} | {e.place.vicinity}
								</h1>
							</div>
						))}
						<Button
							variant="contained"
							fullWidth
							sx={{ fontSize: "1rem" }}
							onClick={addNearbyPlaces}
						>
							+ Add ($)
						</Button>
					</div>
				)} */}
		</div>
	);
}
