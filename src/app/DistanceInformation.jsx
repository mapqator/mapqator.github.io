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
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function DistanceInformation({
	selectedPlacesMap,
	savedPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
}) {
	//   const [distanceMatrix, setDistanceMatrix] = useState({});
	const [newDistance, setNewDistance] = useState({
		from: [],
		to: [],
	});

	useEffect(() => {
		setNewDistance({
			from: [],
			to: [],
			travelMode: "WALKING",
		});
	}, [selectedPlacesMap]);
	const handleDistanceAdd = async () => {
		console.log(newDistance);
		if (newDistance.from.length === 0 || newDistance.to.length === 0)
			return;
		// Fetch the distance between the two places from google maps
		const response = await mapApi.getDistance(
			newDistance.from,
			newDistance.to,
			newDistance.travelMode
		);
		if (response.success) {
			console.log(response.data.matrix);
			const origin = newDistance.from;
			const destination = newDistance.to;
			const matrix = response.data.matrix;
			const newDistanceMatrix = { ...distanceMatrix };
			for (let i = 0; i < origin.length; i++) {
				const o = origin[i];
				for (let j = 0; j < destination.length; j++) {
					const d = destination[j];
					if (o === d) {
					} else if (matrix[i][j]) {
						if (newDistanceMatrix[o])
							newDistanceMatrix[o][d] = {
								...newDistanceMatrix[o][d],
								[newDistance.travelMode]: {
									duration: matrix[i][j].duration.text,
									distance: matrix[i][j].distance.text,
								},
							};
						else {
							newDistanceMatrix[o] = {
								[d]: {
									[newDistance.travelMode]: {
										duration: matrix[i][j].duration.text,
										distance: matrix[i][j].distance.text,
									},
								},
							};
						}
					}
				}
			}
			setDistanceMatrix(newDistanceMatrix);
		}
	};

	return (
		Object.keys(selectedPlacesMap).length > 0 && (
			<div className="flex flex-col border-4 w-full border-black rounded-lg">
				<div className="flex flex-col items-center bg-black">
					<h1 className="text-3xl text-white">
						Distance Information
					</h1>
					<p className="text-lg text-white">
						Distance and Duration from one place to another
					</p>
				</div>
				{Object.keys(distanceMatrix).length > 0 && (
					<div className="flex flex-col m-3 p-1 bg-blue-500 gap-1">
						<div className="flex flex-row">
							<h1 className="text-lg w-[30%] text-center font-bold">
								From
							</h1>
							<h1 className="text-lg w-[21.5%] text-center font-bold">
								To
							</h1>
							<h1 className="text-lg w-[14%] text-center font-bold">
								Mode
							</h1>
							<h1 className="text-lg w-[14%] text-center font-bold">
								Distance
							</h1>
							<h1 className="text-lg w-[14%] text-center font-bold">
								Duration
							</h1>
						</div>

						{Object.keys(distanceMatrix).map((from_id, index) => (
							<div
								key={index}
								className="flex flex-row gap-1 items-center bg-white p-2"
							>
								<h1 className={`text-center w-[30%]`}>
									{selectedPlacesMap[from_id].alias ||
										savedPlacesMap[from_id].name}
								</h1>
								<div className="flex flex-col w-[70%]">
									{Object.keys(distanceMatrix[from_id]).map(
										(to_id, index1) =>
											Object.keys(
												distanceMatrix[from_id][to_id]
											).map((mode, index2) => (
												<>
													<div
														key={index2}
														className="flex flex-row gap-1 items-center"
													>
														<h1
															className={`text-center w-[30%]`}
														>
															{selectedPlacesMap[
																to_id
															].alias ||
																savedPlacesMap[
																	to_id
																].name}
														</h1>
														<h1
															className={`text-center w-[20%]`}
														>
															{mode}
														</h1>
														<h1
															className={`text-center w-[20%]`}
														>
															{
																distanceMatrix[
																	from_id
																][to_id][mode]
																	.distance
															}
														</h1>
														<h1
															className={`text-center w-[20%]`}
														>
															{
																distanceMatrix[
																	from_id
																][to_id][mode]
																	.duration
															}
														</h1>
														<IconButton
															sx={{
																height: "3rem",
																width: "3rem",
															}}
															onClick={() => {
																const newDistanceMatrix =
																	{
																		...distanceMatrix,
																	};
																delete newDistanceMatrix[
																	from_id
																][to_id][mode];
																if (
																	Object.keys(
																		newDistanceMatrix[
																			from_id
																		][to_id]
																	).length ===
																	0
																)
																	delete newDistanceMatrix[
																		from_id
																	][to_id];
																if (
																	Object.keys(
																		newDistanceMatrix[
																			from_id
																		]
																	).length ===
																	0
																)
																	delete newDistanceMatrix[
																		from_id
																	];
																setDistanceMatrix(
																	newDistanceMatrix
																);
															}}
														>
															<div className="text-sm md:text-2xl">
																<FontAwesomeIcon
																	icon={
																		faTrashCan
																	}
																	color="red"
																/>
															</div>
														</IconButton>
													</div>
													{Object.keys(
														distanceMatrix[from_id]
													).length >
														index1 + 1 ||
														(index2 + 1 <
															Object.keys(
																distanceMatrix[
																	from_id
																][to_id]
															).length && (
															<div className="h-[1px] bg-black w-full"></div>
														))}
												</>
											))
									)}
								</div>
							</div>
						))}
					</div>
				)}

				<div className="flex flex-row gap-2 w-full p-2">
					<div className="w-[30%]">
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
								From
							</InputLabel>
							<Select
								required
								multiple
								id="outlined-adornment"
								className="outlined-input"
								value={newDistance.from}
								onChange={(event) => {
									setNewDistance((prev) => ({
										...prev,
										from: event.target.value,
									}));
								}}
								input={<OutlinedInput label={"From"} />}
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
					<div className="w-[30%]">
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
								To
							</InputLabel>
							<Select
								required
								multiple
								id="outlined-adornment"
								className="outlined-input"
								value={newDistance.to}
								onChange={(event) => {
									setNewDistance((prev) => ({
										...prev,
										to: event.target.value,
									}));
								}}
								input={<OutlinedInput label={"To"} />}
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

					<div className="w-[20%]">
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
								Travel Mode
							</InputLabel>
							<Select
								required
								id="outlined-adornment"
								className="outlined-input"
								value={newDistance.travelMode}
								onChange={(event) => {
									setNewDistance((prev) => ({
										...prev,
										travelMode: event.target.value,
									}));
								}}
								input={<OutlinedInput label={"Travel Mode"} />}
							>
								{[
									"WALKING",
									"DRIVING",
									"BICYCLING",
									"TRANSIT",
								].map((mode, index) => (
									<MenuItem key={index} value={mode}>
										{mode}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div className="w-1/5">
						<Button
							variant="contained"
							fullWidth
							onClick={handleDistanceAdd}
							sx={{ fontSize: "1rem" }}
						>
							+ Add ($)
						</Button>
					</div>
				</div>
			</div>
		)
	);
}
