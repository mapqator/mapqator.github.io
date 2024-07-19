"use client";

import React, { useContext, useEffect, useState } from "react";
import { CardContent, Divider } from "@mui/material";
import DirectionCard from "./DirectionCard";
import DirectionForm from "./DirectionForm";
import ContextViewer from "../ContextPreview";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function GetDirections() {
	const {
		selectedPlacesMap,
		savedPlacesMap,
		directionInformation,
		setDirectionInformation,
	} = useContext(GlobalContext);

	return (
		<CardContent>
			{Object.keys(directionInformation).length > 0 && (
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
						<h1 className="text-lg w-[11%] text-center font-bold">
							Routes
						</h1>
						<h1 className="text-lg w-[11%] text-center font-bold">
							Steps
						</h1>
					</div>

					{Object.keys(directionInformation).map((from_id, index) => (
						<div
							key={index}
							className="flex flex-row gap-1 bg-white p-2"
						>
							<h1 className={`text-center w-[30%] py-3`}>
								{savedPlacesMap[from_id].name ||
									selectedPlacesMap[from_id].alias}
							</h1>
							<div className="flex flex-col w-[70%]">
								{Object.keys(directionInformation[from_id]).map(
									(to_id, index1) => (
										<div key={index1}>
											{Object.keys(
												directionInformation[from_id][
													to_id
												]
											).map((mode, index2) => (
												<>
													<DirectionCard
														{...{
															mode,
															index2,
															selectedPlacesMap,
															savedPlacesMap,
															directionInformation,
															setDirectionInformation,
															from_id,
															to_id,
														}}
													/>
												</>
											))}
											{Object.keys(
												directionInformation[from_id]
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
			<DirectionForm />
		</CardContent>
	);
}
