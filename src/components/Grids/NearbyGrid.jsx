"use client";

import React, { useContext } from "react";
import NearbyCard from "@/components/Cards/NearbyCard";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Grid } from "@mui/material";

export default function NearbyGrid() {
	const {
		// Getters
		savedPlacesMap,
		selectedPlacesMap,
		nearbyPlacesMap,
		// Setters
		setNearbyPlacesMap,
		setSavedPlacesMap,
		setSelectedPlacesMap,
	} = useContext(GlobalContext);
	return (
		<Grid container>
			{Object.keys(nearbyPlacesMap).map((place_id) =>
				nearbyPlacesMap[place_id].map((e, index2) => (
					<NearbyCard
						key={index2}
						{...{
							index2,
							selectedPlacesMap,
							savedPlacesMap,
							setSavedPlacesMap,
							nearbyPlacesMap,
							setNearbyPlacesMap,
							place_id,
							setSelectedPlacesMap,
							e,
						}}
					/>
				))
			)}
		</Grid>
	);
}
