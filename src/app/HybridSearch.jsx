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
	Divider,
	Typography,
} from "@mui/material";
import _ from "lodash";

import { LoadingButton } from "@mui/lab";
import { Clear, Search } from "@mui/icons-material";
import Fuse from "fuse.js";
const AutocompleteSearchBox = ({
	savedPlacesMap,
	addPlace,
	setAddPlace,
	setSavedPlacesMap,
	selectedPlacesMap,
	setSelectedPlacesMap,
}) => {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [selectedPlace, setSelectedPlace] = useState(null);
	const [loading, setLoading] = useState(false);

	const [filteredPlaces, setFilteredPlaces] = useState([]);

	const handleSearch = async (event) => {
		event.preventDefault();
		if (search === "") return;
		setLoading(true);
		try {
			const response = await mapApi.search(search);
			if (response.success) {
				setResults(response.data.results);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};

	const handleSelectPlace = (place) => {
		if (selectedPlace === place) {
			setSelectedPlace(null);
		} else {
			setSelectedPlace(place);
		}
	};

	// Debounced search function
	const debouncedSearch = React.useCallback(
		_.debounce((query) => {
			// Your search logic here, for example:
			const fuse = new Fuse(Object.values(savedPlacesMap), {
				keys: ["name", "formatted_address"],
				threshold: 0.3,
				// distance: 100,
				ignoreLocation: true,
			});
			const result = fuse.search(query);
			const filteredPlaces = result.map((item) => item.item);
			setFilteredPlaces(filteredPlaces);
		}, 300),
		[savedPlacesMap]
	); // Adjust debounce time as needed

	const handleFuzzySearch = async () => {
		// Convert savedPlacesMap object values to an array
		const placesArray = Object.values(savedPlacesMap);

		// Fuse.js options
		const options = {
			// Properties to search in
			keys: ["name", "formatted_address"],
			// // Other options like threshold can be added here
			threshold: 0.2, // Lower this to make the search stricter, or increase for more fuzziness
			// distance: 100, // Increase this to allow for more flexibility in term location
			ignoreLocation: true, // Consider setting to true for more lenient matches
			// // You can adjust these values based on testing to find what works best for your data
			// findAllMatches: true,
		};

		// Create a new Fuse instance with the places array and options
		const fuse = new Fuse(placesArray, options);

		// Use Fuse to search
		const result = fuse.search(search);

		// Map the search result to get the original place objects
		const filteredPlaces = result.map((item) => item.item);

		// Update state with the filtered places
		setFilteredPlaces(filteredPlaces);
	};

	useEffect(() => {
		if (search) {
			debouncedSearch(search);
			// setFilteredPlaces(
			// 	Object.values(savedPlacesMap).filter(
			// 		(place) =>
			// 			place.name
			// 				.toLowerCase()
			// 				.includes(search.toLowerCase()) ||
			// 			place.formatted_address
			// 				.toLowerCase()
			// 				.includes(search.toLowerCase())
			// 	)
			// );
		} else {
			// Handle the case when search is cleared
			setFilteredPlaces(Object.values(savedPlacesMap));
		}
	}, [search, debouncedSearch]);

	const handleAddSave = async () => {
		console.log("Saved: ", selectedPlace);
		// Save the selected place as needed
		const place_id = selectedPlace["place_id"];
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
			handleAdd(place_id);
		} else {
			console.log("Already saved: ", details);
		}
		setSelectedPlace(null);
		return details;
	};

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
		<div className="flex flex-col gap-1">
			<form
				className="flex flex-row items-center w-full gap-1"
				onSubmit={handleSearch}
			>
				<div className="w-1/2">
					<TextField
						// type="text"
						autoComplete="off"
						size="small"
						fullWidth
						placeholder="Search for a place"
						className="border border-black rounded-lg p-2"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="w-1/2 flex flex-row gap-1">
					<LoadingButton
						variant="contained"
						type="submit"
						fullWidth
						// sx={{ height: "100%" }}
						className="!h-10"
						loading={loading}
						startIcon={<Search />}
						loadingPosition="start"
					>
						Search ($)
					</LoadingButton>
					<Button
						onClick={() => {
							setResults([]);
							setSearch("");
						}}
						variant="contained"
						fullWidth
						// sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
						color="error"
					>
						<Clear />
						Clear
					</Button>
				</div>
			</form>

			<div className="w-full flex flex-row gap-1">
				{/* Column 1 */}
				<div className="w-1/2 ">
					{filteredPlaces.length > 0 && (
						<div className="bg-black border-2 border-black flex flex-col gap-[1.5px]">
							<div className="w-full flex flex-col">
								<div className="text-white text-center p-2">
									Places saved in our database
								</div>
								<div className="overflow-y-auto max-h-[40vh] flex flex-col gap-px ">
									{filteredPlaces
										.sort((a, b) => {
											// Place null values at the end
											if (a.last_updated === null)
												return 1;
											if (b.last_updated === null)
												return -1;

											// Sort in descending order
											return (
												new Date(b.last_updated) -
												new Date(a.last_updated)
											);
										})
										.map((place, index) => (
											<li key={index}>
												<button
													className={`flex flex-row justify-center w-full p-2 ${
														addPlace ===
														place.place_id
															? "bg-[#888888]"
															: "hover:bg-[#cccccc] bg-white"
													}`}
													onClick={() => {
														if (
															addPlace ===
															place.place_id
														) {
															setAddPlace("");
														} else {
															setAddPlace(
																place.place_id
															);
														}
													}}
												>
													{
														savedPlacesMap[
															place.place_id
														].name
													}{" "}
													-{" "}
													{
														savedPlacesMap[
															place.place_id
														].formatted_address
													}
												</button>
											</li>
										))}
								</div>
							</div>
							<div className="flex flex-row gap-2 w-full bg-white">
								<Button
									variant="contained"
									fullWidth
									onClick={() => {
										handleAdd(addPlace);
										setAddPlace("");
									}}
									sx={{ fontSize: "1rem" }}
									disabled={addPlace === ""}
								>
									+ Add
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Column 2 */}
				<div className="w-1/2">
					{results.length > 0 && (
						<div className="bg-black border-2 border-black flex flex-col gap-[1.5px]">
							<ul className="w-full flex flex-col">
								<div className="text-white text-center p-2">
									Places fetched using Google Map API
								</div>
								<div className="overflow-y-auto max-h-[40vh] flex flex-col gap-px">
									{results.map((place, index) => (
										<li key={index}>
											<button
												className={`flex flex-row justify-center  w-full p-2 ${
													selectedPlace === place
														? "bg-[#888888]"
														: "hover:bg-[#cccccc] bg-white"
												}`}
												onClick={() =>
													handleSelectPlace(place)
												}
											>
												{place.name} -{" "}
												{place.formatted_address}
											</button>
										</li>
									))}
								</div>
							</ul>
							<div className="flex flex-row gap-2 w-full bg-white">
								<Button
									fullWidth
									onClick={handleAddSave}
									variant="contained"
									sx={{ fontSize: "1rem" }}
									disabled={selectedPlace === null}
								>
									+ Add ($)
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default function HybridSearch({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	setSelectedPlacesMap,
}) {
	const [search, setSearch] = useState("");

	return (
		<div className="w-full flex flex-col items-center bg-white border-4 rounded-lg border-black gap-1">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">Search for a place</h1>
				<p className="text-base text-center text-white">
					Search for a place from google map or our database
				</p>
			</div>
			<div className="p-2 w-full flex flex-col gap-2">
				<AutocompleteSearchBox
					savedPlacesMap={savedPlacesMap}
					addPlace={search}
					setAddPlace={setSearch}
					{...{
						setSavedPlacesMap,
						selectedPlacesMap,
						setSelectedPlacesMap,
					}}
				/>
				{/* <form
					className="flex flex-col items-center w-full"
					onSubmit={handleSearch}
				>
					<input
						type="text"
						placeholder="Search for a place"
						className="border border-black rounded-lg p-2 w-full"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</form> */}
			</div>
		</div>
	);
}
