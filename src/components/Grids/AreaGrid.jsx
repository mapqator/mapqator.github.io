"use client";

import React, { useContext } from "react";
import AreaCard from "@/components/Cards/AreaCard";
import { Grid } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
export default function AreaGrid() {
	const {
		savedPlacesMap,
		setSavedPlacesMap,
		selectedPlacesMap,
		poisMap,
		setSelectedPlacesMap,
		setPoisMap,
	} = useContext(GlobalContext);
	return (
		<Grid container>
			{Object.keys(poisMap).map((place_id) =>
				poisMap[place_id].map((poi, index2) => (
					<AreaCard
						key={index2}
						selectedPlacesMap={selectedPlacesMap}
						savedPlacesMap={savedPlacesMap}
						setSavedPlacesMap={setSavedPlacesMap}
						poi={poi}
						poisMap={poisMap}
						setPoisMap={setPoisMap}
						index2={index2}
						place_id={place_id}
						setSelectedPlacesMap={setSelectedPlacesMap}
					/>
				))
			)}
		</Grid>
	);
}
