"use client";

import React, { useContext } from "react";
import NearbyCard from "@/components/Cards/NearbyCard";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Grid } from "@mui/material";

export default function NearbyGrid() {
	const { nearbyPlacesMap } = useContext(GlobalContext);
	return (
		<Grid container spacing={2}>
			{Object.keys(nearbyPlacesMap).map((place_id) =>
				nearbyPlacesMap[place_id].map((entry, index) => (
					<Grid item xs={12} sm={6} md={6} key={index}>
						<NearbyCard
							{...{
								place_id,
								index,
								entry,
							}}
						/>
					</Grid>
				))
			)}
		</Grid>
	);
}
