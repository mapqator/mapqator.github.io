"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField, IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function PlaceInformation({
	selectedPlacesMap,
	setSelectedPlacesMap,
	savedPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
	directionInformation,
	setDirectionInformation,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	poisMap,
	setPoisMap,
}) {
	const deletePlaceFromDistanceMatrix = (place_id) => {
		const newDistanceMatrix = { ...distanceMatrix };
		delete newDistanceMatrix[place_id];
		Object.keys(newDistanceMatrix).forEach((key) => {
			delete newDistanceMatrix[key][place_id];
		});
		setDistanceMatrix(newDistanceMatrix);
	};

	const deletePlaceFromDirections = (place_id) => {
		const newDirectionInformation = { ...directionInformation };
		delete newDirectionInformation[place_id];

		Object.keys(newDirectionInformation).forEach((key) => {
			delete newDirectionInformation[key][place_id];
		});
		setDirectionInformation(newDirectionInformation);
	};

	const deletePlaceFromNearbyPlaces = (place_id) => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		delete newNearbyPlacesMap[place_id];
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	const deletePlaceFromPois = (place_id) => {
		const newPoisMap = { ...poisMap };
		delete newPoisMap[place_id];
		setPoisMap(newPoisMap);
	};

	const deletePlace = (place_id) => {
		deletePlaceFromDistanceMatrix(place_id);
		deletePlaceFromDirections(place_id);
		deletePlaceFromNearbyPlaces(place_id);
		deletePlaceFromPois(place_id);
		const newSelectedPlacesMap = { ...selectedPlacesMap };
		delete newSelectedPlacesMap[place_id];
		setSelectedPlacesMap(newSelectedPlacesMap);
	};
	return (
		Object.keys(selectedPlacesMap).length > 0 && (
			<div className="border-4 w-full border-black rounded-lg h-[30rem] overflow-y-auto">
				<div className="flex flex-col items-center bg-black text-center pb-2">
					<h1 className="text-xl md:text-3xl text-white">
						Places Information
					</h1>
					<p className="text-sm md:text-lg text-zinc-300">
						List of all places in the context
					</p>
				</div>
				<div className="flex flex-col items-center px-2">
					<div className="flex flex-col m-3 p-1 bg-blue-500 gap-1 w-full">
						{/* <div className="flex flex-row">
							<h1 className="text-lg w-[60%] text-center font-bold">
								Place
							</h1>
							<h1 className="text-lg w-[40%] text-center font-bold">
								Attributes
							</h1>
						</div> */}

						{Object.keys(selectedPlacesMap).map(
							(place_id, index) => (
								<div
									key={index}
									className="flex flex-col md:flex-row gap-1 items-center bg-white p-2"
								>
									<div className="flex flex-col gap-2 w-sfull md:w-[60%]">
										<h1 className={`w-full text-left`}>
											{/* <h1 className="text-3xl">{index + 1}</h1> */}
											<b>
												{savedPlacesMap[place_id].name}
											</b>{" "}
											(
											{
												savedPlacesMap[place_id]
													.formatted_address
											}
											)
										</h1>
									</div>
									{/* <input
										type="text"
										placeholder="Alias"
										value={
											selectedPlacesMap[place_id].alias
										}
										className="border border-black p-2 w-[30%]"
										onChange={(event) => {
											const newSelectedPlacesMap = {
												...selectedPlacesMap,
											};
											newSelectedPlacesMap[
												place_id
											].alias = event.target.value;
											setSelectedPlacesMap(
												newSelectedPlacesMap
											);
										}}
									/> */}
									<div className="flex flex-row gap-2 items-center w-full md:w-[40%]">
										<FormControl
											fullWidth
											className="input-field"
											variant="outlined"
											size="small"
										>
											<Select
												required
												multiple
												id="outlined-adornment"
												className="outlined-input"
												value={
													selectedPlacesMap[place_id]
														.selectedAttributes
												}
												onChange={(event) => {
													const newAttributes =
														event.target.value;

													const newSelectedPlacesMap =
														{
															...selectedPlacesMap,
														};
													newSelectedPlacesMap[
														place_id
													].selectedAttributes =
														newAttributes;
													setSelectedPlacesMap(
														newSelectedPlacesMap
													);
												}}
												input={<OutlinedInput />}
												// MenuProps={MenuProps}
											>
												{selectedPlacesMap[
													place_id
												].attributes
													.filter(
														(attribute) =>
															attribute !==
															"last_updated"
													) // Filter out "last_updated"
													.map((value, index) => (
														<MenuItem
															key={index}
															value={value}
															// sx={{ width: "2rem" }}
															// style={getStyles(name, personName, theme)}
														>
															{value
																.replace(
																	/_/g,
																	" "
																) // Replace underscores with spaces
																.split(" ") // Split the string into an array of words
																.map(
																	(word) =>
																		word
																			.charAt(
																				0
																			)
																			.toUpperCase() +
																		word.slice(
																			1
																		)
																) // Capitalize the first letter of each word
																.join(" ")}
														</MenuItem>
													))}
											</Select>
										</FormControl>
										<IconButton
											sx={{
												height: "3rem",
												width: "3rem",
											}}
											onClick={() => {
												deletePlace(place_id);
											}}
										>
											<div className="text-2xl">
												<FontAwesomeIcon
													icon={faTrash}
													color="red"
												/>
											</div>
										</IconButton>
									</div>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		)
	);
}
