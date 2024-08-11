import React, { useContext, useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
import {
	Box,
	Checkbox,
	Chip,
	FormControl,
	Grid,
	InputLabel,
	ListItemText,
	MenuItem,
	Select,
	Switch,
	Typography,
} from "@mui/material";
import { Add, ArrowRight, ArrowRightAlt } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import TravelSelectionField from "@/components/InputFields/TravelSelectionField.";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";
import DepartureTimeField from "../InputFields/DepartureTimeField";
import dayjs from "dayjs";
import { AppContext } from "@/contexts/AppContext";

const avoidMap = {
	avoidTolls: "Tolls",
	avoidHighways: "Highways",
	avoidFerries: "Ferries",
};
const transitModeMap = {
	BUS: "Bus",
	LIGHT_RAIL: "Tram and Light rail",
	SUBWAY: "Subway",
	TRAIN: "Train",
	// RAIL: "Rail", // This is equivalent to a combination of SUBWAY, TRAIN, and LIGHT_RAIL.
};
export default function DirectionForm({ handlePlaceAdd }) {
	const { selectedPlacesMap, directionInformation, setDirectionInformation } =
		useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
	const initialData = {
		origin: "",
		destination: "",
		intermediates: [],
		travelMode: "WALK",
		departureTime: {
			type: "now",
			date: dayjs(),
			time: dayjs(),
			departureTimestamp: new Date(),
		},
		optimizeWaypointOrder: false,
		transitPreferences: {
			allowedTravelModes: [],
		},
		routeModifiers: {
			avoidTolls: false,
			avoidHighways: false,
			avoidFerries: false,
		},
	};
	const [newDirection, setNewDirection] = useState(initialData);
	const [loading, setLoading] = useState(false);
	// { from, to, mode, routes: [{label, duration, distance, steps:[]}]}
	useEffect(() => {
		setNewDirection(initialData);
	}, [selectedPlacesMap]);
	const handleDirectionAdd = async () => {
		if (newDirection.origin === "" || newDirection.destination === "")
			return;
		// Fetch the direction between the two places from google maps
		setLoading(true);
		const response = await mapApi.getDirectionsNew(newDirection);
		if (response.success && response.data.routes) {
			console.log("Directions: ", response.data.routes);
			const routes = response.data.routes;
			const newDirectionInfo = [...directionInformation];
			const all_routes = [];
			routes.forEach((route) => {
				// const legs = [];
				// route.legs.forEach((leg) => {
				// 	const steps = [];
				// 	console.log("Steps: ", route.legs[0].steps);
				// 	leg.steps.forEach((step) => {
				// 		console.log(step);
				// 		if (step.navigationInstruction)
				// 			steps.push(step.navigationInstruction.instructions);
				// 	});
				// 	legs.push({
				// 		steps,
				// 		localizedValues: leg.localizedValues,
				// 	});
				// });
				// console.log("Legs: ", legs);
				all_routes.push({
					label: route.description,
					duration: route.localizedValues.staticDuration.text,
					distance: route.localizedValues.distance.text,
					legs: route.legs,
					optimizedIntermediateWaypointIndex:
						route.optimizedIntermediateWaypointIndex,
				});
			});
			const o = newDirection.origin;
			const d = newDirection.destination;

			newDirectionInfo.push({
				origin: newDirection.origin,
				destination: newDirection.destination,
				intermediates: newDirection.intermediates,
				travelMode: newDirection.travelMode,
				optimizeWaypointOrder: newDirection.optimizeWaypointOrder,
				transitPreferences: newDirection.transitPreferences,
				routeModifiers: {
					avoidTolls: ["DRIVE", "TWO_WHEELER"].includes(
						newDirection.travelMode
					)
						? newDirection.routeModifiers.avoidTolls
						: false,
					avoidHighways: ["DRIVE", "TWO_WHEELER"].includes(
						newDirection.travelMode
					)
						? newDirection.routeModifiers.avoidHighways
						: false,
					avoidFerries: ["DRIVE", "TWO_WHEELER"].includes(
						newDirection.travelMode
					)
						? newDirection.routeModifiers.avoidFerries
						: false,
				},
				routes: all_routes,
				showSteps: false,
			});

			// if (newDirectionInfo[o])
			// 	newDirectionInfo[o][d] = {
			// 		...newDirectionInfo[o][d],
			// 		[newDirection.travelMode]: {

			// 			routes: all_routes,
			// 			showSteps: true,
			// 		},
			// 	};
			// else {
			// 	newDirectionInfo[o] = {
			// 		[d]: {
			// 			[newDirection.travelMode]: {
			// 				routes: all_routes,
			// 				showSteps: true,
			// 			},
			// 		},
			// 	};
			// }
			setDirectionInformation(newDirectionInfo);
		} else {
			showError("Couldn't find directions between the two places");
		}
		setLoading(false);
	};
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<PlaceSelectionField
					label="Origin"
					value={newDirection.origin}
					onChange={(event) => {
						setNewDirection((prev) => ({
							...prev,
							origin: event.target.value,
						}));
					}}
					handlePlaceAdd={handlePlaceAdd}
				/>
			</Grid>

			<Grid item xs={12}>
				<PlaceSelectionField
					label="Destination"
					value={newDirection.destination}
					onChange={(event) => {
						setNewDirection((prev) => ({
							...prev,
							destination: event.target.value,
						}));
					}}
					handlePlaceAdd={handlePlaceAdd}
				/>
			</Grid>

			<Grid item xs={12}>
				<TravelSelectionField
					mode={newDirection.travelMode}
					setMode={(value) =>
						setNewDirection((prev) => ({
							...prev,
							travelMode: value,
						}))
					}
				/>
			</Grid>

			{newDirection.travelMode !== "TRANSIT" && (
				<>
					<Grid item xs={12}>
						<FormControl fullWidth size="small" required>
							<InputLabel>Intermediates</InputLabel>
							<Select
								multiple
								value={newDirection.intermediates}
								onChange={(event) => {
									setNewDirection((prev) => ({
										...prev,
										intermediates: event.target.value,
									}));
								}}
								label={"Intermediates"}
								renderValue={(selected) =>
									!newDirection.optimizeWaypointOrder ? (
										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
												gap: 0.5,
												alignItems: "center",
											}}
										>
											{selected.map((value, index) => (
												<>
													<Typography variant="body2">
														{
															savedPlacesMap[
																value
															].displayName.text
														}
													</Typography>
													{index <
														selected.length - 1 && (
														<ArrowRightAlt />
													)}
												</>
											))}
										</Box>
									) : (
										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
												gap: 0.5,
											}}
										>
											{selected.map((value) => (
												<Chip
													key={value}
													label={
														savedPlacesMap[value]
															.displayName.text
													}
													size="small"
												/>
											))}
										</Box>
									)
								}
							>
								{Object.keys(selectedPlacesMap).map(
									(place_id) => (
										<MenuItem
											key={place_id}
											value={place_id}
										>
											{
												savedPlacesMap[place_id]
													.displayName.text
											}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
						<h6 className="px-2  text-sm">
							If your desired place is not listed here, you need
							to{" "}
							<a
								className="underline font-semibold cursor-pointer hover:text-blue-500"
								onClick={handlePlaceAdd}
							>
								add it
							</a>{" "}
							first.
						</h6>
					</Grid>
					<Box className="w-full p-3 pb-0 flex flex-row justify-start items-center gap-2">
						<Switch
							onChange={() => {
								setNewDirection((prev) => ({
									...prev,
									optimizeWaypointOrder:
										!prev.optimizeWaypointOrder,
								}));
							}}
							checked={newDirection.optimizeWaypointOrder}
							size="small"
							disabled={newDirection.intermediates.length < 2}
						/>
						<h6 className="text-base">
							Optimize intermediates order
						</h6>
					</Box>
				</>
			)}

			{/* {(newDirection.travelMode === "transit" ||
				newDirection.travelMode === "driving") && (
				<Grid item xs={12}>
					<DepartureTimeField
						value={newDirection.departureTime}
						onChange={(newValue) => {
							setNewDirection((prev) => ({
								...prev,
								departureTime: newValue,
							}));
						}}
					/>
				</Grid>
			)} */}

			{/* {newDirection.from && newDirection.to && (
				<Grid item xs={12}>
					<iframe
						width="100%"
						height="450"
						// style="border:0"
						style={{
							border: 0,
						}}
						loading="lazy"
						allowfullscreen
						referrerPolicy="no-referrer-when-downgrade"
						src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&origin=place_id:${newDirection.from}&destination=place_id:${newDirection.to}&mode=${newDirection.travelMode}`}
					/>
				</Grid>
			)} */}

			{["DRIVE", "TWO_WHEELER"].includes(newDirection.travelMode) && (
				<Grid item xs={12}>
					<FormControl fullWidth size="small">
						<InputLabel>Avoid</InputLabel>
						<Select
							// input={<OutlinedInput label="Tag" />}
							value={Object.entries(newDirection.routeModifiers)
								.map(([key, value]) => (value ? key : null))
								.filter((x) => x)}
							onChange={(e) => {
								const newOptions = {
									...newDirection.routeModifiers,
								};
								Object.keys(avoidMap).forEach((key) => {
									newOptions[key] =
										e.target.value.includes(key);
								});
								setNewDirection((prev) => ({
									...prev,
									routeModifiers: newOptions,
								}));
							}}
							label={"Avoid"}
							multiple
							renderValue={(selected) => {
								if (selected.length === 0) {
									return <em>Any</em>; // Custom label for empty array
								}
								return selected
									.map((value) => avoidMap[value])
									.join(", ");
							}}
						>
							{Object.keys(avoidMap).map((key) => (
								<MenuItem key={key} value={key}>
									<Checkbox
										checked={
											newDirection.routeModifiers[key]
										}
									/>
									<ListItemText primary={avoidMap[key]} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			)}

			{newDirection.travelMode === "TRANSIT" && (
				<Grid item xs={12}>
					<FormControl fullWidth size="small">
						<InputLabel>Prefer</InputLabel>
						<Select
							// input={<OutlinedInput label="Tag" />}
							value={
								newDirection.transitPreferences
									.allowedTravelModes
							}
							onChange={(e) => {
								setNewDirection((prev) => ({
									...prev,
									transitPreferences: {
										allowedTravelModes: e.target.value,
									},
								}));
							}}
							label={"Prefer"}
							multiple
							renderValue={(selected) => {
								if (selected.length === 0) {
									return <em>Any</em>; // Custom label for empty array
								}
								return selected
									.map((value) => transitModeMap[value])
									.join(", ");
							}}
						>
							{Object.keys(transitModeMap).map((key) => (
								<MenuItem key={key} value={key}>
									<Checkbox
										checked={
											newDirection.transitPreferences.allowedTravelModes.indexOf(
												key
											) > -1
										}
									/>
									<ListItemText
										primary={transitModeMap[key]}
									/>
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			)}

			<Grid item xs={12}>
				<LoadingButton
					variant="contained"
					fullWidth
					onClick={handleDirectionAdd}
					loading={loading}
					loadingPosition="start"
					startIcon={<Add />}
				>
					Add alternative routes
				</LoadingButton>
			</Grid>
		</Grid>
	);
}
