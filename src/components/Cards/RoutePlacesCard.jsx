import React, { useContext, useEffect, useState } from "react";
import {
	IconButton,
	Typography,
	Card,
	CardContent,
	Box,
	Collapse,
	Chip,
	Divider,
	Grid,
	Paper,
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import PoiList from "@/components/Lists/PoiList";
import Pluralize from "pluralize";
import { convertFromSnake } from "@/services/utils";
import TravelSelectionField from "../InputFields/TravelSelectionField.";
import { LoadingButton } from "@mui/lab";
import mapApi from "@/api/mapApi";
import MapComponent from "../GoogleMap/MapComponent";
import RoutePlacesComponent from "../GoogleMap/RoutePlacesComponent";

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

function RoutePlacesDetails({
	index,
	entry,
	routePlacesMap,
	setRoutePlacesMap,
	mode,
	savedPlacesMap,
}) {
	return (
		<>
			<PoiList
				places={entry.places}
				// handleTogglePlace={handleTogglePlace}
				mode={mode}
				// locationBias={place_id}
			/>
		</>
	);
}
function RoutePlacesSummary({
	index,
	entry,
	expanded,
	mode,
	routePlacesMap,
	setRoutePlacesMap,
	savedPlacesMap,
}) {
	// const handleDelete = () => {
	// 	const newNearbyPlacesMap = { ...routePlacesMap };
	// 	newNearbyPlacesMap[place_id].splice(index, 1);
	// 	if (newNearbyPlacesMap[place_id].length === 0)
	// 		delete newNearbyPlacesMap[place_id];
	// 	setRoutePlacesMap(newNearbyPlacesMap);
	// };
	// console.log("Nearby:", routePlacesMap[place_id][index]);
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="start"
				className="gap-1"
			>
				{/* <Typography variant="h6" component="div">
					{savedPlacesMap[place_id].displayName?.text}
				</Typography> */}
				{/* {mode === "edit" && (
					<Box className="flex flex-col items-end justify-start">
						<IconButton onClick={handleDelete} size="small">
							<Delete color="error" />
						</IconButton>
					</Box>
				)} */}
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
								routePlacesMap[index].places.length,
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
export default function RoutePlacesCard({
	index,
	routePlacesMap,
	setRoutePlacesMap,
	savedPlacesMap,
	mode,
	entry,
}) {
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		setExpanded(index === 0);
	}, [index]);

	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<RoutePlacesSummary
					{...{
						index,
						entry,
						expanded,
						savedPlacesMap,
						routePlacesMap,
						setRoutePlacesMap,
						mode,
					}}
				/>
			</CardContent>
			<Collapse in={expanded} timeout="auto">
				{/* <Divider /> */}
				<Grid container spacing={2} className="px-4 mb-4">
					<Grid item xs={12} md={6}>
						<Paper elevation={2}>
							<Box>
								<Typography
									variant="h6"
									className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
								>
									{Pluralize(convertFromSnake(entry.type))}{" "}
									Along Route
								</Typography>
							</Box>
							<Box className="h-[320px] overflow-auto">
								<RoutePlacesDetails
									{...{
										index,
										entry,
										routePlacesMap,
										setRoutePlacesMap,
										mode,
										savedPlacesMap,
									}}
								/>
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper elevation={2}>
							<Box>
								<Typography
									variant="h6"
									className="font-bold bg-zinc-200 p-2 text-center border-b-2 border-black"
								>
									Map View
								</Typography>
							</Box>
							<RoutePlacesComponent
								places={entry.places}
								height={"320px"}
								zoom={14}
								encodedPolyline={
									entry.routes[0].polyline.encodedPolyline
								}
							/>
						</Paper>
					</Grid>
				</Grid>
			</Collapse>
		</Card>
	);
}
