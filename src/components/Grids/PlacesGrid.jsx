import React, { useContext } from "react";
import { Grid } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceCard from "@/components/Cards/PlaceCard";

export default function PlaceInformation() {
	const { selectedPlacesMap } = useContext(GlobalContext);

	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{Object.keys(selectedPlacesMap)
				.reverse()
				.map((placeId, index) => (
					<Grid item xs={12} sm={6} md={6} key={placeId}>
						<PlaceCard placeId={placeId} index={index} />
					</Grid>
				))}
		</Grid>
	);
}
