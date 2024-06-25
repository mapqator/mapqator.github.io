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
import placeTypes from "@/app/types.json";

function POICard({
	selectedPlacesMap,
	savedPlacesMap,
	poi,
	poisMap,
	setPoisMap,
	index2,
}) {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="border-2 border-black rounded-lg">
			<div className="flex flex-row gap-1 w-full items-center p-2">
				<h1 className={`w-[90%]`}>{poi.query}</h1>
				<IconButton
					sx={{
						height: "3rem",
						width: "3rem",
					}}
					onClick={() => {
						const newPoisMap = {
							...poisMap,
						};
						newPoisMap.splice(index2, 1);
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
					{poi.places.map((place, index) => (
						<div key={index} className="flex flex-row gap-2">
							<input
								type="checkbox"
								checked={place.selected}
								onChange={(event) => {
									const newPoisMap = [...poisMap];
									newPoisMap[index2].places[index].selected =
										event.target.checked;
									console.log(
										"Changed index ",
										index2,
										index,
										newPoisMap
									);
									setPoisMap(newPoisMap);
								}}
							/>
							<h1 className="overflow-hidden whitespace-nowrap overflow-ellipsis w-[95%]">
								{place.name} - {place.formatted_address}
							</h1>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default function POI({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	poisMap,
	setPoisMap,
}) {
	useEffect(() => {
		console.log(poisMap);
	}, [poisMap]);
	return (
		poisMap.length > 0 && (
			<div className="flex flex-col border-4 w-full border-black rounded-lg">
				<div className="flex flex-col items-center bg-black">
					<h1 className="text-3xl text-white">POIs</h1>
					<p className="text-lg text-white">
						Results of the Points of Interest search
					</p>
				</div>
				<div className="flex flex-col gap-2 w-full p-2">
					{poisMap?.map((poi, index) => (
						<POICard
							key={index}
							selectedPlacesMap={selectedPlacesMap}
							savedPlacesMap={savedPlacesMap}
							poi={poi}
							poisMap={poisMap}
							setPoisMap={setPoisMap}
							index2={index}
						/>
					))}
				</div>
			</div>
		)
	);
}
