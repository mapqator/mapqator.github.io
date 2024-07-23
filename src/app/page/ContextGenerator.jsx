"use client";
import { useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import ContextStepper from "@/components/Steppers/ContextStepper";

export default function ContextGenerator({
	onFinish,
	activeStep,
	setActiveStep,
}) {
	const {
		savedPlacesMap,
		selectedPlacesMap,
		setSelectedPlacesMap,
		distanceMatrix,
		setDistanceMatrix,
		directionInformation,
		setDirectionInformation,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		poisMap,
		setPoisMap,
		setContext,
		currentInformation,
		setCurrentInformation,
	} = useContext(GlobalContext);

	useEffect(() => {
		setContext({
			places: ContextGeneratorService.getPlacesContext(
				selectedPlacesMap,
				savedPlacesMap
			),
			nearby: ContextGeneratorService.getNearbyContext(
				nearbyPlacesMap,
				savedPlacesMap
			),
			area: ContextGeneratorService.getAreaContext(
				poisMap,
				savedPlacesMap
			),
			distance: ContextGeneratorService.getDistanceContext(
				distanceMatrix,
				savedPlacesMap
			),
			direction: ContextGeneratorService.getDirectionContext(
				directionInformation,
				savedPlacesMap
			),
			params: ContextGeneratorService.getParamsContext(
				currentInformation,
				savedPlacesMap
			),
		});
	}, [
		savedPlacesMap,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		distanceMatrix,
		directionInformation,
		currentInformation,
	]);

	const handleReset = () => {
		setPoisMap({});
		setDistanceMatrix({});
		setNearbyPlacesMap({});
		setContext([]);
		setCurrentInformation({
			time: null,
			day: "",
			location: "",
		});
		setDirectionInformation({});
		setSelectedPlacesMap({});
		setActiveStep(1);
	};
	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Create a Context Using Google Maps APIs
			</Typography>
			<ContextStepper
				{...{ handleReset, onFinish, activeStep, setActiveStep }}
			/>
		</>
	);
}
