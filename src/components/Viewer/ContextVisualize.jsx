import { useContext, useEffect, useRef, useState } from "react";
import {
	Box,
	Typography,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Paper,
	Divider,
	CardContent,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextPreview from "@/components/Cards/ContextPreview";
import {
	Clear,
	Flag,
	KeyboardArrowRight,
	KeyboardDoubleArrowRight,
	NextPlanTwoTone,
	RemoveRedEye,
	Route,
	Save,
	Send,
	Settings,
} from "@mui/icons-material";
import ExploreIcon from "@mui/icons-material/Explore";
import ContextGeneratorService from "@/services/contextGeneratorService";
import ParamsForm from "@/components/Forms/ParamsForm";
import DirectionGrid from "@/components/Grids/DirectionGrid";
import DirectionForm from "@/components/Forms/DirectionForm";
import DistanceGrid from "@/components/Grids/DistanceGrid";
import DistanceForm from "@/components/Forms/DistanceForm";
import AreaGrid from "@/components/Grids/AreaGrid";
import AreaForm from "@/components/Forms/AreaForm";
import NearbyGrid from "@/components/Grids/NearbyGrid";
import NearbyForm from "@/components/Forms/NearbyForm";
import AutocompleteSearchBox from "@/components/InputFields/AutocompleteSearchBox";
import MapComponent from "@/components/GoogleMap/MapComponent";
import PlacesGrid from "@/components/Grids/PlacesGrid";
import { LoadingButton } from "@mui/lab";
import { setLoading } from "@/app/old-home/page";
import { showError } from "@/contexts/ToastProvider";
import RouteSearchGrid from "../Grids/RouteSearchGrid";

function ContextStep({
	step,
	index,
	totalSteps,
	activeStep,
	setActiveStep,
	handleNext,
	handleBack,
	loadExample,
}) {
	const [loading, setLoading] = useState(false);
	const stepRef = useRef(null);

	// useEffect(() => {
	// 	if (index === activeStep && stepRef.current) {
	// 		stepRef.current.scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "start",
	// 		});
	// 	}
	// }, [activeStep, index]);
	return (
		<div ref={stepRef}>
			<StepLabel
				icon={
					<div
						className={`cursor-pointer hover:text-blue-500 ${
							index === activeStep && "text-blue-500"
						}`}
					>
						{step.icon}
					</div>
				}
				onClick={() => {
					if (index !== activeStep) setActiveStep(index);
				}}
			>
				<Typography
					className={`cursor-pointer flex ${
						index === activeStep && "!text-blue-500 !font-semibold"
					}`}
				>
					{step.label}
				</Typography>
			</StepLabel>
			<StepContent>
				<div className="flex flex-col">
					{step.grid && (
						<>
							<Divider />
							{/* Already added
												</Divider> */}
							<Typography
								sx={{
									whiteSpace: "pre-line",
									paddingTop: "8px",
								}}
							>
								{step.additional}
							</Typography>
							<Box>{step.grid}</Box>
						</>
					)}
					{step.context !== undefined && (
						<div className="flex flex-col gap-2">
							<Typography
								sx={{
									whiteSpace: "pre-line",
								}}
							>
								Based on the information you add, a context will
								be generated below.
							</Typography>

							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								<ContextPreview context={step.context} />
							</Paper>
						</div>
					)}
				</div>
			</StepContent>
		</div>
	);
}

export default function ContextVisualize({
	savedPlacesMap,
	selectedPlacesMap,
	nearbyPlacesMap,
	routePlacesMap,
	directionInformation,
}) {
	console.log("SELECTED PLACES MAP", selectedPlacesMap);
	const steps = [
		{
			label: "Add details of Places",
			description: `Start by searching for a location. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			additional: "Places you have added to the context.",
			grid: selectedPlacesMap &&
				Object.keys(selectedPlacesMap).length > 0 && (
					<>
						{/* <MapComponent /> */}
						<PlacesGrid
							{...{
								savedPlacesMap,
								selectedPlacesMap,
							}}
						/>
					</>
				),
		},
		{
			label: "Search for Nearby places",
			additional:
				"List of places whose nearby pois are added to the context",
			icon: <PlaceIcon />,
			grid: nearbyPlacesMap &&
				Object.keys(nearbyPlacesMap).length > 0 && (
					<NearbyGrid
						{...{
							nearbyPlacesMap,
							savedPlacesMap,
						}}
					/>
				),
		},
		// {
		// 	label: "Get Distance Matrix",
		// 	additional:
		// 		"List of origin - destination pairs whose fastest route is added to the context",
		// 	icon: <MapIcon />,
		// 	grid: Object.keys(distanceMatrix).length > 0 && (
		// 		<DistanceGrid
		// 			{...{
		// 				distanceMatrix,
		// 				savedPlacesMap,
		// 			}}
		// 		/>
		// 	),
		// },
		{
			abel: "Compute Routes",
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <DirectionsIcon />,
			grid: directionInformation &&
				Object.keys(directionInformation).length > 0 && (
					<DirectionGrid
						{...{
							directionInformation,
							savedPlacesMap,
						}}
					/>
				),
		},
		{
			label: "Search Along Route",
			description: `Utilize the Places API to find places along a route. Choose a route to find places along the route.`,
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <Route />,
			grid: routePlacesMap && Object.keys(routePlacesMap).length > 0 && (
				<RouteSearchGrid
					{...{
						routePlacesMap,
						directionInformation,
						savedPlacesMap,
					}}
					mode="edit"
				/>
			),
		},
	];

	return steps.map(
		(step, index) =>
			step.grid && (
				<div key={index}>
					<Typography
						sx={{
							whiteSpace: "pre-line",
							paddingTop: "8px",
						}}
					>
						{step.additional}
					</Typography>
					<Box>{step.grid}</Box>
					{/* {index < steps.length - 1 && <Divider />} */}
				</div>
			)
	);
}
