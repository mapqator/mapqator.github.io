"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField } from "@mui/material";

export default function OnlineSearch({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	setSelectedPlacesMap,
	setPoisMap,
}) {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);

	const [selectedPlace, setSelectedPlace] = useState(null);

	const handleSelectPlace = (place) => {
		if (selectedPlace === place) {
			setSelectedPlace(null);
		} else {
			setSelectedPlace(place);
		}
	};

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

	const handleSave = async () => {
		try {
			const response = await mapApi.getDetails(selectedPlace["place_id"]);
			if (response.success) {
				const res = await placeApi.createPlace(response.data.result);
				if (res.success) {
					const newSavedPlacesMap = { ...savedPlacesMap };
					newSavedPlacesMap[res.data[0].place_id] = res.data[0];
					setSavedPlacesMap(newSavedPlacesMap);
				}
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
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

	const handleAddAll = async () => {
		try {
			setPoisMap((prev) => [
				...prev,
				{
					query: search,
					places: results.map((place) => ({
						...place,
						selected: true,
					})),
				},
			]);

			const newSavedPlacesMap = { ...savedPlacesMap };
			for (const place of results) {
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
								newSavedPlacesMap[place.place_id] = res.data[0];
								console.log("saved: ", res.data[0].place_id);
							}
						}
					} catch (error) {
						console.error(error);
					}
				}
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	return (
		<div className="w-1/2 flex flex-col items-center bg-white border-4 rounded-lg border-black gap-1">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">
					Online: Search for a place
				</h1>
				<p className="text-base text-center text-white">
					Search for a place and save it to the database
				</p>
			</div>
			<div className="p-2 w-full flex flex-col gap-2">
				<form
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
					<button
						className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
						type="submit"
					>
						Search ($)
					</button>
				</form>
				{results.length > 0 && (
					<div className="flex flex-row gap-2">
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
							Clear
						</Button>
						{/* <Button
							onClick={handleAddAll}
							variant="contained"
							fullWidth
							// sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
							// color="error"
						>
							Add all
						</Button> */}
					</div>
				)}
				{/* <h1 className="bg-black h-1 w-full my-2"></h1> */}
				<ul className="flex flex-col gap-2 overflow-y-auto max-h-[40vh] ">
					{results.map((place, index) => (
						<li key={index}>
							<button
								className={`border-black border rounded-lg p-2 w-full ${
									selectedPlace === place
										? "bg-[#888888]"
										: "hover:bg-[#cccccc]"
								}`}
								onClick={() => handleSelectPlace(place)}
							>
								{place.name} - {place.formatted_address}
							</button>
						</li>
					))}
				</ul>
			</div>
			{selectedPlace && (
				<div className="flex flex-row gap-[2px] pt-[2px] w-full bg-black">
					<Button
						className="bg-blue-500 rounded-sm p-2 w-full"
						onClick={handleAddSave}
						variant="contained"
						sx={{ fontSize: "1rem" }}
					>
						Add
					</Button>
					<Button
						className="bg-blue-500 rounded-sm p-2 w-full"
						onClick={handleSave}
						variant="contained"
						sx={{ fontSize: "1rem" }}
					>
						Save
					</Button>
				</div>
			)}
		</div>
	);
}
