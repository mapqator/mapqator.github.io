"use client";

import React, { useContext, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	Card,
	CardContent,
	Typography,
	Chip,
	IconButton,
	Grid,
	Collapse,
	Box,
	Select,
	MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { AppContext } from "@/contexts/AppContext";

export default function PlaceCard({ placeId }) {
	const {
		// Getters
		selectedPlacesMap,
		distanceMatrix,
		directionInformation,
		nearbyPlacesMap,
		poisMap,
		// Setters
		setDistanceMatrix,
		setDirectionInformation,
		setNearbyPlacesMap,
		setSelectedPlacesMap,
		setPoisMap,
	} = useContext(GlobalContext);

	const { savedPlacesMap } = useContext(AppContext);

	const [expanded, setExpanded] = React.useState({});
	const handleExpandClick = (placeId) => {
		setExpanded({ ...expanded, [placeId]: !expanded[placeId] });
	};
	const handleAttributeChange = (placeId, newAttributes) => {
		setSelectedPlacesMap((prev) => ({
			...prev,
			[placeId]: {
				...prev[placeId],
				selectedAttributes: newAttributes,
			},
		}));
	};

	const deletePlaceFromDistanceMatrix = (place_id) => {
		const newDistanceMatrix = { ...distanceMatrix };
		delete newDistanceMatrix[place_id];
		Object.keys(newDistanceMatrix).forEach((key) => {
			delete newDistanceMatrix[key][place_id];
		});
		setDistanceMatrix(newDistanceMatrix);
	};

	const deletePlaceFromDirections = (place_id) => {
		const newDirectionInformation = { ...directionInformation };
		delete newDirectionInformation[place_id];

		Object.keys(newDirectionInformation).forEach((key) => {
			delete newDirectionInformation[key][place_id];
		});
		setDirectionInformation(newDirectionInformation);
	};

	const deletePlaceFromNearbyPlaces = (place_id) => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		delete newNearbyPlacesMap[place_id];
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	const deletePlaceFromPois = (place_id) => {
		const newPoisMap = { ...poisMap };
		delete newPoisMap[place_id];
		setPoisMap(newPoisMap);
	};

	const deletePlace = (place_id) => {
		deletePlaceFromDistanceMatrix(place_id);
		deletePlaceFromDirections(place_id);
		deletePlaceFromNearbyPlaces(place_id);
		deletePlaceFromPois(place_id);
		const newSelectedPlacesMap = { ...selectedPlacesMap };
		delete newSelectedPlacesMap[place_id];
		setSelectedPlacesMap(newSelectedPlacesMap);
	};
	return (
		<Card
			elevation={3}
			sx={{
				// height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<CardContent
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					onClick={() => handleExpandClick(placeId)}
					className="cursor-pointer"
				>
					<Typography variant="h6" component="div" noWrap>
						{savedPlacesMap[placeId].name}
					</Typography>
					<Typography color="textSecondary" gutterBottom noWrap>
						{savedPlacesMap[placeId].formatted_address}
					</Typography>

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							mt: 1,
						}}
					>
						<Typography variant="body2" sx={{ flexGrow: 1 }}>
							Selected Attributes:{" "}
							{
								selectedPlacesMap[placeId].selectedAttributes
									.length
							}
						</Typography>
						<IconButton
							sx={{
								transform: expanded[placeId]
									? "rotate(180deg)"
									: "rotate(0deg)",
								transition: "0.3s",
							}}
						>
							<ExpandMoreIcon />
						</IconButton>
					</Box>
				</Box>

				<Collapse in={expanded[placeId]} timeout="auto" unmountOnExit>
					<FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
						<InputLabel>Attributes</InputLabel>
						<Select
							multiple
							value={
								selectedPlacesMap[placeId].selectedAttributes
							}
							onChange={(e) =>
								handleAttributeChange(placeId, e.target.value)
							}
							renderValue={(selected) => (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.5,
									}}
								>
									{selected.map((value) => (
										<Chip
											key={value}
											label={value
												.replace(/_/g, " ") // Replace underscores with spaces
												.split(" ") // Split the string into an array of words
												.map(
													(word) =>
														word
															.charAt(0)
															.toUpperCase() +
														word.slice(1)
												) // Capitalize the first letter of each word
												.join(" ")}
											size="small"
										/>
									))}
								</Box>
							)}
							input={<OutlinedInput label="Attributes" />}
						>
							{selectedPlacesMap[placeId].attributes
								.filter(
									(attribute) =>
										attribute !== "last_updated" &&
										attribute !== "name" &&
										attribute !== "place_id"
								)
								.map((attribute) => (
									<MenuItem key={attribute} value={attribute}>
										{attribute
											.replace(/_/g, " ") // Replace underscores with spaces
											.split(" ") // Split the string into an array of words
											.map(
												(word) =>
													word
														.charAt(0)
														.toUpperCase() +
													word.slice(1)
											) // Capitalize the first letter of each word
											.join(" ")}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</Collapse>

				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						mt: "auto",
					}}
				>
					<IconButton onClick={() => deletePlace(placeId)}>
						<DeleteIcon color="error" />
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	);
}
