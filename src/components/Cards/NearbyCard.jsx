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

const priceMap = {
	PRICE_LEVEL_INEXPENSIVE: "Inexpensive",
	PRICE_LEVEL_MODERATE: "Moderate",
	PRICE_LEVEL_EXPENSIVE: "Expensive",
	PRICE_LEVEL_VERY_EXPENSIVE: "Very Expensive",
};

function NearbyCardDetails({
	index,
	place_id,
	entry,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
	mode,
	savedPlacesMap,
}) {
	const handleTogglePlace = (e, poi_index) => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		newNearbyPlacesMap[place_id][index].places[poi_index].selected =
			e.target.checked;
		setNearbyPlacesMap(newNearbyPlacesMap);
	};
	const [travelMode, setTravelMode] = useState("WALK");
	const [loading, setLoading] = useState(false);
	const { setNewDistance, setActiveStep } = useContext(GlobalContext);
	const handleDistanceAdd = async () => {
		setLoading(true);
		const origins = [place_id];
		const destinations = entry.places
			.filter((place) => place.selected)
			.map((place) => place.place_id);
		const response = await mapApi.getDistanceNew({
			origins,
			destinations,
			travelMode,
		});
		if (response.success) {
			const elements = response.data;
			const newDistanceMatrix = { ...distanceMatrix };
			for (const route of elements) {
				const {
					originIndex,
					destinationIndex,
					condition,
					localizedValues,
				} = route;

				if (
					origins[originIndex] === destinations[destinationIndex] ||
					condition === "ROUTE_NOT_FOUND"
				) {
					continue;
				}
				const distance = localizedValues.distance.text;
				const duration = localizedValues.staticDuration.text;
				const o = origins[originIndex];
				const d = destinations[destinationIndex];
				if (newDistanceMatrix[o])
					newDistanceMatrix[o][d] = {
						...newDistanceMatrix[o][d],
						[travelMode]: {
							duration,
							distance,
						},
					};
				else {
					newDistanceMatrix[o] = {
						[d]: {
							[travelMode]: {
								duration,
								distance,
							},
						},
					};
				}
			}
			setDistanceMatrix(newDistanceMatrix);
		} else {
			showError("Couldn't find the distance between the places");
		}
		setLoading(false);
	};

	return (
		<>
			<PoiList
				places={entry.places}
				handleTogglePlace={handleTogglePlace}
				mode={mode}
				locationBias={place_id}
			/>
			{mode === "edit" && (
				<div className="flex flex-col gap-4 p-4">
					<Typography variant="body2">
						Add travel time from{" "}
						{savedPlacesMap[place_id].displayName.text} to nearby{" "}
						{Pluralize(entry.type)}
					</Typography>
					{/* <TravelSelectionField
						mode={travelMode}
						setMode={(value) => setTravelMode(value)}
					/> */}
					<LoadingButton
						variant="contained"
						fullWidth
						onClick={() => {
							setNewDistance({
								origins: [place_id],
								destinations: entry.places
									.filter((place) => place.selected)
									.map((place) => place.place_id),
								travelMode: "WALK",
							});
							setActiveStep(4);
						}}
						startIcon={<Add />}
						loading={loading}
						loadingPosition="start"
					>
						Add Travel Time
					</LoadingButton>
				</div>
			)}
		</>
	);
}
function NearbyCardSummary({
	index,
	place_id,
	entry,
	expanded,
	mode,
	nearbyPlacesMap,
	setNearbyPlacesMap,

	savedPlacesMap,
}) {
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
				{mode === "edit" && (
					<Box className="flex flex-col items-end justify-start">
						<IconButton onClick={handleDelete} size="small">
							<Delete color="error" />
						</IconButton>
					</Box>
				)}
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
export default function NearbyCard({
	index,
	place_id,
	entry,
	i,
	mode,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	savedPlacesMap,
	distanceMatrix,
	setDistanceMatrix,
}) {
	const [expanded, setExpanded] = useState(false);
	useEffect(() => {
		setExpanded(i === 0);
	}, [i]);

	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<NearbyCardSummary
					{...{
						index,
						place_id,
						entry,
						expanded,
						savedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
						mode,
					}}
				/>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<NearbyCardDetails
					{...{
						index,
						place_id,
						entry,
						nearbyPlacesMap,
						setNearbyPlacesMap,
						mode,
						distanceMatrix,
						setDistanceMatrix,
						savedPlacesMap,
					}}
				/>
			</Collapse>
		</Card>
	);
}
