import React, { useContext } from "react";
import { Grid } from "@mui/material";
import DirectionCard from "@/components/Cards/DirectionCard";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function DirectionGrid() {
	const { directionInformation } = useContext(GlobalContext);

	return (
		<Grid container>
			{Object.keys(directionInformation).map((from_id) =>
				Object.keys(directionInformation[from_id]).map((to_id) => (
					<DirectionCard
						from_id={from_id}
						to_id={to_id}
						key={from_id + "-" + to_id}
					/>
				))
			)}
		</Grid>
	);
}
