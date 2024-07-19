"use client";

import React, { useContext, useEffect } from "react";
import { CardContent } from "@mui/material";
import NearbyCard from "./NearbyCard";
import NearbyForm from "./NearbyForm";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function NearbyInfo({}) {
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
		// <Card raised>
		<CardContent>
			{Object.keys(nearbyPlacesMap).map((place_id, index1) => (
				<div key={index1} className="flex flex-col gap-1 ">
					{nearbyPlacesMap[place_id].map((e, index2) => (
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
					))}
				</div>
			))}
			<NearbyForm />
		</CardContent>
		// </Card>
	);
}
