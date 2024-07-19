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
	IconButton,
	Grid,
	CardContent,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Add, CheckBox, Radio } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
export default function DirectionCard({
	selectedPlacesMap,
	savedPlacesMap,
	directionInformation,
	setDirectionInformation,
	mode,
	index2,
	from_id,
	to_id,
}) {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="flex flex-col">
			<div key={index2} className="flex flex-row gap-1 items-center">
				<h1 className={`text-center w-[30%]`}>
					{savedPlacesMap[to_id].name ||
						selectedPlacesMap[to_id].alias}
				</h1>
				<h1 className={`text-center w-[20%]`}>{mode}</h1>
				<h1 className={`text-center w-[15%]`}>
					{directionInformation[from_id][to_id][mode].routes.length}
				</h1>
				<div className="w-[16%] flex item-center justify-center z-10">
					<input
						type="checkbox"
						checked={
							directionInformation[from_id][to_id][mode].showSteps
						}
						onClick={() => {
							const newDirectionMatrix = {
								...directionInformation,
							};
							newDirectionMatrix[from_id][to_id][mode].showSteps =
								!newDirectionMatrix[from_id][to_id][mode]
									.showSteps;
							setDirectionInformation(newDirectionMatrix);
						}}
						className="cursor-pointer h-5 w-5"
					/>
				</div>
				<div className="w-[7%] flex item-center justify-center">
					<IconButton
						sx={{
							height: "3rem",
							width: "3rem",
						}}
						onClick={() => {
							const newDirectionMatrix = {
								...directionInformation,
							};
							delete newDirectionMatrix[from_id][to_id][mode];
							if (
								Object.keys(newDirectionMatrix[from_id][to_id])
									.length === 0
							)
								delete newDirectionMatrix[from_id][to_id];
							if (
								Object.keys(newDirectionMatrix[from_id])
									.length === 0
							)
								delete newDirectionMatrix[from_id];
							setDirectionInformation(newDirectionMatrix);
						}}
					>
						<div className="text-sm md:text-2xl">
							<FontAwesomeIcon icon={faTrashCan} color="red" />
						</div>
					</IconButton>
				</div>

				<div className="w-[7%] flex item-center justify-center">
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
			</div>
			{expanded && (
				<div className="flex flex-col gap-1">
					{directionInformation[from_id][to_id][mode].routes.map(
						(route, index) => (
							<div
								key={index}
								className="flex flex-col gap-1 p-2 bg-gray-100"
							>
								<div className="flex flex-row justify-between">
									<h1 className="text-lg font-bold w-[70%]">
										Via {route.label}
									</h1>
									<h1 className="text-md text-right w-[15%]">
										{route.duration}
									</h1>
									<h1 className="text-md text-right w-[15%]">
										{route.distance}
									</h1>
								</div>
								{directionInformation[from_id][to_id][mode]
									.showSteps && (
									<div className="flex flex-col gap-1">
										{route.steps.map((step, index1) => (
											<p
												key={index1}
												className="text-sm"
												dangerouslySetInnerHTML={{
													__html: "- " + step,
												}}
											/>
										))}
									</div>
								)}
							</div>
						)
					)}
				</div>
			)}
		</div>
	);
}
