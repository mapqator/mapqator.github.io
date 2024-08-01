import React, { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import DistanceCard from "@/components/Cards/DistanceCard";
import { Grid } from "@mui/material";

export default function DistanceGrid() {
	const { distanceMatrix } = useContext(GlobalContext);
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{Object.keys(distanceMatrix).map((from_id, i) =>
				Object.keys(distanceMatrix[from_id]).map((to_id, j) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={6}
						key={from_id + "-" + to_id}
					>
						<DistanceCard {...{ from_id, to_id }} index={i + j} />
					</Grid>
				))
			)}
		</Grid>
	);
}
