"use client";

import React, { useEffect, useState } from "react";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import { IconButton, CardContent } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import DistanceForm from "./DistanceForm";

export function CalculateDistance({
	selectedPlacesMap,
	savedPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
}) {
	const [newDistance, setNewDistance] = useState({
		from: [],
		to: [],
		travelMode: "walking",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setNewDistance({
			from: [],
			to: [],
			travelMode: "walking",
		});
	}, [selectedPlacesMap]);

	const handleDistanceAdd = async () => {
		console.log(newDistance);
		if (newDistance.from.length === 0 || newDistance.to.length === 0)
			return;
		setLoading(true);
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
					} else if (matrix[i][j].duration && matrix[i][j].distance) {
						console.log(matrix[i][j]);
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
		setNewDistance((prev) => ({
			from: [],
			to: [],
			travelMode: prev.travelMode,
		}));
		setLoading(false);
	};

	return (
		<CardContent>
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
								{savedPlacesMap[from_id].name ||
									selectedPlacesMap[from_id].alias}
							</h1>
							<div className="flex flex-col w-[70%]">
								{Object.keys(distanceMatrix[from_id]).map(
									(to_id, index1) => (
										<div key={index1}>
											{Object.keys(
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
															{savedPlacesMap[
																to_id
															].name ||
																selectedPlacesMap[
																	to_id
																].alias}
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
												</>
											))}
											{Object.keys(
												distanceMatrix[from_id]
											).length >
												index1 + 1 && (
												<div className="h-[1px] bg-black w-full"></div>
											)}
										</div>
									)
								)}
							</div>
						</div>
					))}
				</div>
			)}

			<DistanceForm />
		</CardContent>
	);
}
