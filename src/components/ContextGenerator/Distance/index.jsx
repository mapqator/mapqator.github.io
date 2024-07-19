"use client";

import React, { useContext, useEffect } from "react";
import { IconButton, CardContent } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import DistanceForm from "./DistanceForm";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";

export default function CalculateDistance() {
	const {
		selectedPlacesMap,
		savedPlacesMap,
		distanceMatrix,
		setDistanceMatrix,
	} = useContext(GlobalContext);

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
