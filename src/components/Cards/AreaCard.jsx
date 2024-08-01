import React, { useContext, useState } from "react";
import {
	IconButton,
	CardContent,
	Collapse,
	Typography,
	Box,
	Card,
	Chip,
	Divider,
} from "@mui/material";
import { Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import PoiList from "@/components/Lists/PoiList";
import Pluralize from "pluralize";
import { convertFromSnake } from "@/services/utils";

function AreaCardDetails({ entry, place_id, index }) {
	const { poisMap, setPoisMap } = useContext(GlobalContext);
	const handleTogglePlace = (e, poi_index) => {
		const newPoisMap = {
			...poisMap,
		};
		newPoisMap[place_id][index].places[poi_index].selected =
			e.target.checked;
		setPoisMap(newPoisMap);
	};
	return (
		<PoiList places={entry.places} handleTogglePlace={handleTogglePlace} />
	);
}

function AreaCardSummary({ entry, place_id, index, expanded }) {
	const { poisMap, setPoisMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				className="gap-1"
			>
				<Typography variant="h6" component="div">
					{savedPlacesMap[place_id]?.name}
				</Typography>

				<Box className="flex flex-col items-end">
					<IconButton
						onClick={() => {
							const newPoisMap = {
								...poisMap,
							};
							newPoisMap[place_id].splice(index, 1);
							if (newPoisMap[place_id].length === 0)
								delete newPoisMap[place_id];
							setPoisMap(newPoisMap);
						}}
						size="small"
					>
						<Delete color="error" />
					</IconButton>
				</Box>
			</Box>
			<Box display="flex" justifyContent="space-between">
				<Box display="flex" flexWrap="wrap" gap={1} mt={1}>
					<Chip
						label={Pluralize(
							convertFromSnake(entry.type),
							poisMap[place_id]
								? poisMap[place_id][index].places.filter(
										(place) => place.selected
								  ).length
								: 0,
							true
						)}
						color="primary"
						size="small"
					/>
					{/* <Chip
						label={
							(poisMap[place_id]
								? poisMap[place_id][index].places.filter(
										(place) => place.selected
								  ).length
								: 0) + " POIs"
						}
						color="secondary"
						size="small"
					/> */}
				</Box>
				<IconButton
					size="small"
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "0.3s",
					}}
				>
					<ExpandMore />
				</IconButton>
			</Box>
		</>
	);
}

export default function AreaCard({ entry, index, place_id, i }) {
	const [expanded, setExpanded] = useState(index === 0);
	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<AreaCardSummary {...{ entry, place_id, index, expanded }} />
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<AreaCardDetails {...{ entry, place_id, index }} />
			</Collapse>
		</Card>
	);
}
