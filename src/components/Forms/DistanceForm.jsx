"use client";

import React, { useContext, useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import TravelSelectionField from "@/components/InputFields/TravelSelectionField.";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function DistanceForm() {
	const { selectedPlacesMap, distanceMatrix, setDistanceMatrix } =
		useContext(GlobalContext);
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
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<PlaceSelectionField
					label="Origins"
					multiple={true}
					onChange={(event) => {
						setNewDistance((prev) => ({
							...prev,
							from: event.target.value,
						}));
					}}
					value={newDistance.from}
				/>
			</Grid>

			<Grid item xs={12}>
				<PlaceSelectionField
					label="Destinations"
					multiple={true}
					value={newDistance.to}
					onChange={(event) => {
						setNewDistance((prev) => ({
							...prev,
							to: event.target.value,
						}));
					}}
				/>
			</Grid>

			<Grid item xs={12}>
				<TravelSelectionField
					mode={newDistance.travelMode}
					setMode={(value) =>
						setNewDistance((prev) => ({
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
					onClick={handleDistanceAdd}
					startIcon={<Add />}
					loading={loading}
					loadingPosition="start"
				>
					Add Distance and Duration
				</LoadingButton>
			</Grid>
		</Grid>
	);
}
