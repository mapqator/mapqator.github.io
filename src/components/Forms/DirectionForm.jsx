"use client";

import React, { useContext, useEffect, useState } from "react";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import { Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import TravelSelectionField from "@/components/InputFields/TravelSelectionField.";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function DirectionForm() {
	const { selectedPlacesMap, directionInformation, setDirectionInformation } =
		useContext(GlobalContext);
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
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<PlaceSelectionField
					label="Origins"
					value={newDirection.from}
					onChange={(event) => {
						setNewDirection((prev) => ({
							...prev,
							from: event.target.value,
						}));
					}}
				/>
			</Grid>

			<Grid item xs={12}>
				<PlaceSelectionField
					label="Destinations"
					value={newDirection.to}
					onChange={(event) => {
						setNewDirection((prev) => ({
							...prev,
							to: event.target.value,
						}));
					}}
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

			<Grid item xs={12}>
				<LoadingButton
					variant="contained"
					fullWidth
					onClick={handleDirectionAdd}
					loading={loading}
					loadingPosition="start"
					startIcon={<Add />}
				>
					Find alternative routes
				</LoadingButton>
			</Grid>
		</Grid>
	);
}
