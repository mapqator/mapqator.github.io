"use client";

import React, { useEffect, useState } from "react";
import { Select, MenuItem, Button, TextField } from "@mui/material";

const AutocompleteSearchBox = ({ savedPlacesMap, addPlace, setAddPlace }) => {
	const [search, setSearch] = useState("");

	const filteredPlaces = Object.values(savedPlacesMap).filter(
		(place) =>
			place.name.toLowerCase().includes(search.toLowerCase()) ||
			place.formatted_address.toLowerCase().includes(search.toLowerCase())
	);
	return (
		<>
			<div
				className="flex flex-col items-center w-full py-3 px-2 border-b-4 border-black"
				// onSubmit={handleSearch}
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
					// type="submit"
				>
					Search
				</button>
			</div>
			<div className="p-2 w-full overflow-y-auto max-h-[40vh] flex flex-col gap-2">
				{filteredPlaces.map((place, index) => (
					<li
						key={index}
						className="flex flex-row gap-2 items-center"
					>
						<button
							className={`border-black flex flex-row justify-center border w-full rounded-lg p-2 ${
								addPlace === place.place_id
									? "bg-[#888888]"
									: "hover:bg-[#cccccc]"
							}`}
							onClick={() => {
								if (addPlace === place.place_id) {
									setAddPlace("");
								} else {
									setAddPlace(place.place_id);
								}
							}}
						>
							{savedPlacesMap[place.place_id].name} -{" "}
							{savedPlacesMap[place.place_id].formatted_address}
						</button>
					</li>
				))}
			</div>
		</>
	);
};

export default function OfflineSearch({
	savedPlacesMap,
	selectedPlacesMap,
	setSelectedPlacesMap,
}) {
	const [addPlace, setAddPlace] = useState("");
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
		<div className="w-1/2 flex flex-col items-center bg-white border-4 rounded-lg border-black">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">Offline: Choose a place</h1>
				<p className="text-base text-white">
					Choose a place from the database
				</p>
			</div>
			<AutocompleteSearchBox
				savedPlacesMap={savedPlacesMap}
				addPlace={addPlace}
				setAddPlace={setAddPlace}
			/>
			{addPlace !== "" && (
				<div className="flex flex-row gap-2 w-full p-2 border-t-4 border-black">
					{/* <button
						className="bg-blue-500 rounded-md p-2 w-full"
						onClick={() => handleAdd(addPlace)}
					>
						Edit
					</button> */}

					<Button
						variant="contained"
						fullWidth
						onClick={() => handleAdd(addPlace)}
						sx={{ fontSize: "1rem" }}
					>
						+ Add
					</Button>
				</div>
			)}
		</div>
	);
}
