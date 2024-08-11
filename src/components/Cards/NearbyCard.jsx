import React, { useContext, useState } from "react";
import {
	IconButton,
	Typography,
	Card,
	CardContent,
	Box,
	Collapse,
	Chip,
	Divider,
} from "@mui/material";
import { Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import PoiList from "@/components/Lists/PoiList";
import Pluralize from "pluralize";
import { convertFromSnake } from "@/services/utils";

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

function NearbyCardDetails({ index, place_id, entry }) {
	const { nearbyPlacesMap, setNearbyPlacesMap } = useContext(GlobalContext);
	const handleTogglePlace = (e, poi_index) => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		newNearbyPlacesMap[place_id][index].places[poi_index].selected =
			e.target.checked;
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	return (
		<PoiList places={entry.places} handleTogglePlace={handleTogglePlace} />
	);
}
function NearbyCardSummary({ index, place_id, entry, expanded }) {
	const { selectedPlacesMap, nearbyPlacesMap, setNearbyPlacesMap } =
		useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);

	const handleDelete = () => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		newNearbyPlacesMap[place_id].splice(index, 1);
		if (newNearbyPlacesMap[place_id].length === 0)
			delete newNearbyPlacesMap[place_id];
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="start"
				className="gap-1"
			>
				<Typography variant="h6" component="div">
					{savedPlacesMap[place_id].displayName.text}
				</Typography>
				<Box className="flex flex-col items-end justify-start">
					<IconButton onClick={handleDelete} size="small">
						<Delete color="error" />
					</IconButton>
				</Box>
			</Box>
			<Box display="flex" justifyContent="space-between">
				<Box
					display="flex"
					flexDirection={"column"}
					flexWrap="wrap"
					gap={1}
					mt={1}
				>
					<div className="flex gap-2">
						<Chip
							label={Pluralize(
								convertFromSnake(entry.type),
								nearbyPlacesMap[place_id]
									? nearbyPlacesMap[place_id][
											index
									  ].places.filter((place) => place.selected)
											.length
									: 0,
								true
							)}
							color="primary"
							size="small"
						/>
						{entry.rankBy === "DISTANCE" && (
							<Chip
								label={"Rankby " + entry.rankBy}
								color="success"
								size="small"
							/>
						)}
						{entry.minRating > 0 && (
							<Chip
								label={"Rating ≥ " + entry.minRating}
								color="secondary"
								size="small"
							/>
						)}
					</div>
					<div className="flex gap-2">
						{entry.priceLevels.length > 0 && (
							<Chip
								label={
									"Prices: " +
									entry.priceLevels
										.map((p) => priceMap[p])
										.join(", ")
								}
								color="primary"
								size="small"
							/>
						)}
					</div>
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
export default function NearbyCard({ index, place_id, entry, i }) {
	const [expanded, setExpanded] = useState(i === 0);

	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<NearbyCardSummary {...{ index, place_id, entry, expanded }} />
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<NearbyCardDetails {...{ index, place_id, entry }} />
			</Collapse>
		</Card>
	);
}
