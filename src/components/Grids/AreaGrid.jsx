import React, { useContext } from "react";
import AreaCard from "@/components/Cards/AreaCard";
import { Grid } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
export default function AreaGrid() {
	const { poisMap } = useContext(GlobalContext);
	return (
		<Grid container spacing={2}>
			{Object.keys(poisMap).map((place_id) =>
				poisMap[place_id].map((entry, index) => (
					<Grid item xs={12} sm={6} md={6} key={index}>
						<AreaCard {...{ entry, place_id, index }} />
					</Grid>
				))
			)}
		</Grid>
	);
}
