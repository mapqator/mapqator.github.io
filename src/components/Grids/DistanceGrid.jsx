import React, { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import DistanceCard from "@/components/Cards/DistanceCard";
import { Grid } from "@mui/material";

export default function DistanceGrid() {
	const { distanceMatrix } = useContext(GlobalContext);
	return (
		<Grid container spacing={2}>
			{Object.keys(distanceMatrix).map((from_id) =>
				Object.keys(distanceMatrix[from_id]).map((to_id) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={6}
						key={from_id + "-" + to_id}
					>
						<DistanceCard from_id={from_id} to_id={to_id} />
					</Grid>
				))
			)}
		</Grid>
	);
}
