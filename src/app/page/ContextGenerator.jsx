import { useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import ContextStepper from "@/components/Steppers/ContextStepper";
import { AppContext } from "@/contexts/AppContext";

export default function ContextGenerator({
	onFinish,
	activeStep,
	setActiveStep,
}) {
	const {
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

	const { savedPlacesMap } = useContext(AppContext);

	const {
		exampleSelectedPlacesMap,
		exampleNearbyPlacesMap,
		examplePoisMap,
		exampleDistanceMatrix,
		exampleDirectionInformation,
		exampleCurrentInformation,
	} = useContext(GlobalContext);

	const {
		initSelectedPlacesMap,
		initNearbyPlacesMap,
		initPoisMap,
		initDistanceMatrix,
		initDirectionInformation,
		initCurrentInformation,
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
		setPoisMap(initPoisMap);
		setDistanceMatrix(initDistanceMatrix);
		setNearbyPlacesMap(initNearbyPlacesMap);
		setCurrentInformation(initCurrentInformation);
		setDirectionInformation(initDirectionInformation);
		setSelectedPlacesMap(initSelectedPlacesMap);
		setActiveStep(1);
		setContext([]);
	};

	// const handleStart = () => {
	// 	setSelectedPlacesMap(exampleSelectedPlacesMap);
	// 	setNearbyPlacesMap(exampleNearbyPlacesMap);
	// 	setPoisMap(examplePoisMap);
	// 	setDistanceMatrix(exampleDistanceMatrix);
	// 	setDirectionInformation(exampleDirectionInformation);
	// 	setCurrentInformation(exampleCurrentInformation);
	// };

	const handleExample = () => {
		setSelectedPlacesMap(exampleSelectedPlacesMap);
		setNearbyPlacesMap(exampleNearbyPlacesMap);
		setPoisMap(examplePoisMap);
		setDistanceMatrix(exampleDistanceMatrix);
		setDirectionInformation(exampleDirectionInformation);
		setCurrentInformation(exampleCurrentInformation);
	};

	useEffect(() => {
		handleExample();
	}, []);

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Create a Context Using Google Maps APIs
			</Typography>
			<ContextStepper
				{...{
					handleReset,
					onFinish,
					handleExample,
					activeStep,
					setActiveStep,
				}}
			/>
		</>
	);
}
