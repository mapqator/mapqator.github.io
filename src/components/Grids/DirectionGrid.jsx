import React, { useContext } from "react";
import { Grid } from "@mui/material";
import DirectionCard from "@/components/Cards/NewDirectionCard";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function DirectionGrid({
	directionInformation,
	setDirectionInformation,
	savedPlacesMap,
	mode,
}) {
	return (
		<Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
			{directionInformation.map((direction, i) => (
				<Grid item xs={12} sm={12} md={12} key={i}>
					<DirectionCard
						direction={direction}
						index={i}
						{...{
							directionInformation,
							setDirectionInformation,
							savedPlacesMap,
							mode,
						}}
					/>
				</Grid>
			))}
			{/* {Object.keys(directionInformation).map((from_id, i) =>
				Object.keys(directionInformation[from_id]).map((to_id, j) => (
					<Grid
						item
						xs={12}
						sm={6}
						md={6}
						key={from_id + "-" + to_id}
					>
						<DirectionCard {...{ from_id, to_id }} index={i + j} />
					</Grid>
				))
			)} */}
		</Grid>
	);
}
