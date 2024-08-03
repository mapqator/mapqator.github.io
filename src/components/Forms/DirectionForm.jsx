import React, { useContext, useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
import { Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import TravelSelectionField from "@/components/InputFields/TravelSelectionField.";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";
import DepartureTimeField from "../InputFields/DepartureTimeField";
import dayjs from "dayjs";

export default function DirectionForm({ handlePlaceAdd }) {
	const { selectedPlacesMap, directionInformation, setDirectionInformation } =
		useContext(GlobalContext);
	const [newDirection, setNewDirection] = useState({
		from: "",
		to: "",
		travelMode: "walking",
		departureTime: {
			type: "now",
			date: dayjs(),
			time: dayjs(),
			departureTimestamp: new Date(),
		},
	});
	const [loading, setLoading] = useState(false);
	// { from, to, mode, routes: [{label, duration, distance, steps:[]}]}
	useEffect(() => {
		setNewDirection({
			from: "",
			to: "",
			travelMode: "walking",
			departureTime: {
				type: "now",
				time: new Date(),
				date: new Date(),
				departureTimestamp: new Date(),
			},
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
						showSteps: true,
					},
				};
			else {
				newDirectionInfo[newDirection.from] = {
					[newDirection.to]: {
						[newDirection.travelMode]: {
							routes: all_routes,
							showSteps: true,
						},
					},
				};
			}
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
					value={newDirection.from}
					onChange={(event) => {
						setNewDirection((prev) => ({
							...prev,
							from: event.target.value,
						}));
					}}
					handlePlaceAdd={handlePlaceAdd}
				/>
			</Grid>

			<Grid item xs={12}>
				<PlaceSelectionField
					label="Destination"
					value={newDirection.to}
					onChange={(event) => {
						setNewDirection((prev) => ({
							...prev,
							to: event.target.value,
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
			{newDirection.from && newDirection.to && (
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
