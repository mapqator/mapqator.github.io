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

	const filteredPlaces = Object.values(savedPlacesMap).filter(
		(place) =>
			place.name.toLowerCase().includes(search.toLowerCase()) ||
			place.formatted_address.toLowerCase().includes(search.toLowerCase())
	);
	const handleSearch = async (event) => {
		event.preventDefault();
		if (search === "") return;
		try {
			const response = await mapApi.search(search);
			if (response.success) {
				setResults(response.data.results);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const handleSelectPlace = (place) => {
		if (selectedPlace === place) {
			setSelectedPlace(null);
		} else {
			setSelectedPlace(place);
		}
	};

	const handleAddSave = async () => {
		console.log("Saved: ", selectedPlace);
		// Save the selected place as needed
		try {
			const response = await mapApi.getDetails(selectedPlace["place_id"]);
			if (response.success) {
				const res = await placeApi.createPlace(response.data.result);
				if (res.success) {
					const newSavedPlacesMap = { ...savedPlacesMap };
					newSavedPlacesMap[res.data[0].place_id] = res.data[0];
					setSavedPlacesMap(newSavedPlacesMap);

					const newSelectedPlacesMap = { ...selectedPlacesMap };
					newSelectedPlacesMap[res.data[0].place_id] = {
						alias: "",
						selectedAttributes: ["formatted_address"],
						attributes: Object.keys(res.data[0]).filter(
							(e) => res.data[0][e] !== null
						),
					};
					setSelectedPlacesMap(newSelectedPlacesMap);

					setSelectedPlace(null);
					return res.data[0];
				}
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const handleAdd = (place_id) => {
		// Don't add if already added
		if (place_id === "") return;

		const newSelectedPlacesMap = { ...selectedPlacesMap };
		newSelectedPlacesMap[place_id] = {
			alias: "",
			selectedAttributes: ["formatted_address"],
			attributes: Object.keys(savedPlacesMap[place_id]).filter(
				(key) => savedPlacesMap[place_id][key] !== null
			),
		};
		setSelectedPlacesMap(newSelectedPlacesMap);

		setAddPlace("");
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
						size="small"
						fullWidth
						placeholder="Search for a place"
						className="border border-black rounded-lg p-2"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="w-1/2">
					<Button
						variant="contained"
						type="submit"
						fullWidth
						// sx={{ height: "100%" }}
						className="!h-10"
					>
						Search ($)
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
									Saved Places
								</div>
								<div className="overflow-y-auto max-h-[40vh] flex flex-col gap-px ">
									{filteredPlaces.map((place, index) => (
										<li key={index}>
											<button
												className={`flex flex-row justify-center w-full p-2 ${
													addPlace === place.place_id
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
									onClick={() => handleAdd(addPlace)}
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
									Google Map Places
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
