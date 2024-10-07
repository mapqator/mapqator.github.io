import React, { useContext } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";

export default function PlaceDeleteButton({ placeId, isSelected }) {
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

	const { savedPlacesMap, setSavedPlacesMap } = useContext(AppContext);

	const deletePlaceFromDistanceMatrix = (place_id) => {
		const newDistanceMatrix = { ...distanceMatrix };
		delete newDistanceMatrix[place_id];
		Object.keys(newDistanceMatrix).forEach((key) => {
			delete newDistanceMatrix[key][place_id];
		});
		setDistanceMatrix(newDistanceMatrix);
	};

	const deletePlaceFromDirections = (place_id) => {
		setDirectionInformation((prev) =>
			prev.filter((direction) => direction.place_id !== place_id)
		);
	};

	const deletePlaceFromNearbyPlaces = (place_id) => {
		setNearbyPlacesMap((prev) =>
			prev.filter((entry) => entry.locationBias !== place_id)
		);
	};

	const deletePlaceFromPois = (place_id) => {
		const newPoisMap = { ...poisMap };
		delete newPoisMap[place_id];
		setPoisMap(newPoisMap);
	};

	const deletePlaceFromSaved = (place_id) => {
		const tmp = { ...savedPlacesMap };
		delete tmp[place_id];
		setSavedPlacesMap(tmp);
	};

	const deletePlace = (place_id) => {
		deletePlaceFromDistanceMatrix(place_id);
		deletePlaceFromDirections(place_id);
		deletePlaceFromNearbyPlaces(place_id);
		deletePlaceFromPois(place_id);
		const newSelectedPlacesMap = { ...selectedPlacesMap };
		delete newSelectedPlacesMap[place_id];
		setSelectedPlacesMap(newSelectedPlacesMap);
		if (!isSelected) deletePlaceFromSaved(place_id);
	};
	return (
		<IconButton onClick={() => deletePlace(placeId)}>
			<DeleteIcon color="error" />
		</IconButton>
	);
}
