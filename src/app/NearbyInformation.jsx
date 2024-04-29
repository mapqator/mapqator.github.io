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
} from "@fortawesome/free-solid-svg-icons";

function NearbyCard({
	index2,
	selectedPlacesMap,
	savedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	place_id,
	e,
}) {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="bg-white" key={index2}>
			<div className="flex flex-row gap-1 w-full items-center bg-white p-2">
				<h1 className={`text-center w-[36%]`}>
					{selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name}
				</h1>
				<h1 className={`text-center w-[17%]`}>{e.type}</h1>
				<h1 className={`text-center w-[17%]`}>{e.keyword || "N/A"}</h1>
				<h1 className={`text-center w-[17%]`}>
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
						<div key={index3} className="flex flex-row gap-2">
							<input
								type="checkbox"
								checked={place.selected}
								onChange={(event) => {
									const newNearbyPlacesMap = {
										...nearbyPlacesMap,
									};
									newNearbyPlacesMap[place_id][index2].places[
										index3
									].selected = event.target.checked;
									setNearbyPlacesMap(newNearbyPlacesMap);
								}}
							/>
							<h1 className="overflow-hidden whitespace-nowrap overflow-ellipsis w-[95%]">
								{place.name} | {place.formatted_address}
							</h1>
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
		type: "any",
		keyword: "",
		radius: 1,
		rankBy: "distance",
		hasRadius: false,
		list: [],
	});
	const [nearbyPlacesResults, setNearbyPlacesResults] = useState([]); // list of places from nearby search

	useEffect(() => {
		setNewNearbyPlaces({
			location: "",
			type: "any",
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
					const response = await mapApi.getDetails(e.place.place_id);
					if (response.success) {
						const res = await placeApi.createPlace(
							response.data.result
						);
						if (res.success) {
							newSavedPlacesMap[e.place.place_id] = res.data[0];
							console.log("saved: ", res.data[0].place_id);
						}
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
		if (newNearbyPlaces.location === "" || newNearbyPlaces.type === "")
			return;
		try {
			const loc =
				savedPlacesMap[newNearbyPlaces.location].geometry.location;
			const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
			const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
			const response = await mapApi.getNearby({
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

				newNearbyPlacesMap[newNearbyPlaces.location].push({
					type: newNearbyPlaces.type,
					places: placesWithSelection,
					keyword: newNearbyPlaces.keyword,
					radius: newNearbyPlaces.radius,
					hasRadius: newNearbyPlaces.hasRadius,
					rankBy: newNearbyPlaces.rankBy,
				});

				setNearbyPlacesMap(newNearbyPlacesMap);

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
	};

	return (
		Object.keys(selectedPlacesMap).length > 0 && (
			<div className="flex flex-col border-4 w-full border-black rounded-lg">
				<div className="flex flex-col items-center bg-black">
					<h1 className="text-3xl text-white">Nearby Places</h1>
					<p className="text-lg text-white">
						Distance and Duration from one place to another
					</p>
				</div>

				{Object.keys(nearbyPlacesMap).length > 0 && (
					<div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
						<div className="flex flex-row">
							<h1 className="text-lg w-[36%] text-center font-bold">
								Location
							</h1>
							<h1 className="text-lg w-[17%] text-center font-bold">
								Type
							</h1>
							<h1 className="text-lg w-[17%] text-center font-bold">
								Keyword
							</h1>
							<h1 className="text-lg w-[17%] text-center font-bold">
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
													nearbyPlacesMap,
													setNearbyPlacesMap,
													place_id,
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
											{selectedPlacesMap[place_id]
												.alias ||
												savedPlacesMap[place_id].name}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</div>
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
								{[
									"any",
									"accounting",
									"airport",
									"amusement_park",
									"art_gallery",
									"atm",
									"bakery",
									"bank",
									"bar",
									"beauty_salon",
									"bicycle_store",
									"book_store",
									"bowling_alley",
									"bus_station",
									"cafe",
									"campground",
									"car_dealer",
									"car_rental",
									"car_repair",
									"car_wash",
									"casino",
									"cemetery",
									"church",
									"city_hall",
									"clothing_store",
									"convenience_store",
									"courthouse",
									"dentist",
									"department_store",
									"doctor",
									"drugstore",
									"electrician",
									"electronics_store",
									"embassy",
									"fire_station",
									"florist",
									"food",
									"funeral_home",
									"furniture_store",
									"gas_station",
									"gym",
									"hair_care",
									"hardware_store",
									"health",
									"hindu_temple",
									"home_goods_store",
									"hospital",
									"insurance_agency",
									"jewelry_store",
									"laundry",
									"lawyer",
									"library",
									"light_rail_station",
									"liquor_store",
									"local_government_office",
									"locksmith",
									"lodging",
									"meal_delivery",
									"meal_takeaway",
									"mosque",
									"movie_rental",
									"movie_theater",
									"moving_company",
									"museum",
									"night_club",
									"painter",
									"park",
									"parking",
									"pet_store",
									"pharmacy",
									"physiotherapist",
									"place_of_worship",
									"plumber",
									"point_of_interest",
									"police",
									"political",
									"post_office",
									"primary_school",
									"real_estate_agency",
									"restaurant",
									"roofing_contractor",
									"rv_park",
									"school",
									"secondary_school",
									"shoe_store",
									"shopping_mall",
									"spa",
									"stadium",
									"storage",
									"store",
									"subway_station",
									"supermarket",
									"taxi_stand",
									"tourist_attraction",
									"train_station",
									"transit_station",
									"travel_agency",
									"university",
									"veterinary_care",
									"zoo",
								].map((type, index) => (
									<MenuItem
										key={index}
										value={type}
										// sx={{ width: "2rem" }}
										// style={getStyles(name, personName, theme)}
									>
										{type}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className="w-full">
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
					</div>
					<div className="flex flex-row w-full gap-2">
						<div className="w-full">
							<FormControl
								fullWidth
								className="input-field"
								variant="outlined"
								size="small"
							>
								<InputLabel
									htmlFor="outlined-adornment"
									className="input-label"
								>
									{/* Location */}
								</InputLabel>
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
									label="Radius"
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
											<MenuItem
												key={index}
												value={e.value}
											>
												{e.label}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}
						</div>
					</div>
					<div className="w-full">
						<Button
							variant="contained"
							fullWidth
							onClick={searchNearbyPlaces}
							sx={{ fontSize: "1rem" }}
						>
							+ Add ($)
						</Button>
					</div>
				</div>
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
		)
	);
}
