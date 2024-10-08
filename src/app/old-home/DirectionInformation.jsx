"use client";

import React, { useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
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
import { Add, CheckBox, Radio } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
function DirectionCard({
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

export function GetDirections({
	selectedPlacesMap,
	savedPlacesMap,
	directionInformation,
	setDirectionInformation,
}) {
	//   const [directionMatrix, setDirectionMatrix] = useState({});
	const [newDirection, setNewDirection] = useState({
		from: "",
		to: "",
		travelMode: "walking",
	});
	const [loading, setLoading] = useState(false);
	// { from, to, mode, routes: [{label, duration, distance, steps:[]}]}
	useEffect(() => {
		setNewDirection({
			from: "",
			to: "",
			travelMode: "walking",
		});
	}, [selectedPlacesMap]);
	const handleDirectionAdd = async () => {
		if (newDirection.from === "" || newDirection.to === "") return;
		// Fetch the direction between the two places from google maps

		setLoading(true);
		const response = await mapApi.getDirections(
			newDirection.from,
			newDirection.to,
			newDirection.travelMode
		);
		if (response.success) {
			// console.log(response.)
			const routes = response.data.routes;
			const newDirectionInfo = { ...directionInformation };
			const all_routes = [];
			routes.forEach((route) => {
				const steps = [];
				route.legs[0].steps.forEach((step) => {
					steps.push(step.html_instructions);
				});
				all_routes.push({
					label: route.summary,
					duration: route.legs[0].duration.text,
					distance: route.legs[0].distance.text,
					steps: steps,
				});
			});
			if (newDirectionInfo[newDirection.from])
				newDirectionInfo[newDirection.from][newDirection.to] = {
					...newDirectionInfo[newDirection.from][newDirection.to],
					[newDirection.travelMode]: {
						routes: all_routes,
						showSteps: false,
					},
				};
			else {
				newDirectionInfo[newDirection.from] = {
					[newDirection.to]: {
						[newDirection.travelMode]: {
							routes: all_routes,
							showSteps: false,
						},
					},
				};
			}
			setDirectionInformation(newDirectionInfo);
		}
		setLoading(false);
	};
	return (
		<>
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

			{
				<div className="flex flex-col gap-2 w-full p-2">
					<div className="flex flex-col md:flex-row gap-2">
						<div className="w-full md:w-1/2">
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
									id="outlined-adornment"
									className="outlined-input"
									value={newDirection.from}
									onChange={(event) => {
										setNewDirection((prev) => ({
											...prev,
											from: event.target.value,
										}));
									}}
									input={<OutlinedInput label={"From"} />}
								>
									{Object.keys(selectedPlacesMap).map(
										(place_id, index) => (
											<MenuItem
												key={index}
												value={place_id}
											>
												{savedPlacesMap[place_id]
													.name ||
													selectedPlacesMap[place_id]
														.alias}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</div>
						<div className="w-full md:w-1/2">
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
									id="outlined-adornment"
									className="outlined-input"
									value={newDirection.to}
									onChange={(event) => {
										setNewDirection((prev) => ({
											...prev,
											to: event.target.value,
										}));
									}}
									input={<OutlinedInput label={"To"} />}
								>
									{Object.keys(selectedPlacesMap).map(
										(place_id, index) => (
											<MenuItem
												key={index}
												value={place_id}
											>
												{savedPlacesMap[place_id]
													.name ||
													selectedPlacesMap[place_id]
														.alias}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</div>
					</div>

					<div className="w-full">
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
								value={newDirection.travelMode}
								onChange={(event) => {
									setNewDirection((prev) => ({
										...prev,
										travelMode: event.target.value,
									}));
								}}
								input={<OutlinedInput label={"Travel Mode"} />}
							>
								{[
									"walking",
									"driving",
									"bicycling",
									"transit",
								].map((mode, index) => (
									<MenuItem key={index} value={mode}>
										{mode}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div className="w-full">
						<LoadingButton
							variant="contained"
							fullWidth
							onClick={handleDirectionAdd}
							sx={{ fontSize: "1rem" }}
							loading={loading}
							loadingPosition="start"
							startIcon={<Add />}
						>
							Add ($)
						</LoadingButton>
					</div>
				</div>
			}
		</>
	);
}
export default function DirectionInformation({
	selectedPlacesMap,
	savedPlacesMap,
	directionInformation,
	setDirectionInformation,
}) {
	return (
		// Object.keys(selectedPlacesMap).length > 0 &&
		<div className="flex flex-col border-4 w-full border-black rounded-lg">
			<div className="flex flex-col items-center bg-black text-center pb-2">
				<h1 className="text-xl md:text-3xl text-white">
					Direction Information
				</h1>
				<p className="text-sm md:text-lg text-zinc-300">
					Routes from one place to another
				</p>
			</div>
			<GetDirections
				{...{
					selectedPlacesMap,
					savedPlacesMap,
					directionInformation,
					setDirectionInformation,
				}}
			/>
		</div>
	);
}
