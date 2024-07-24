"use client";

import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	Card,
	CardContent,
	Typography,
	Chip,
	IconButton,
	Collapse,
	Box,
	Select,
	MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import { convertFromSnake } from "@/services/utils";

export default function PlaceDeleteButton({ placeId }) {
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
		<IconButton onClick={() => deletePlace(placeId)}>
			<DeleteIcon color="error" />
		</IconButton>
	);
}
