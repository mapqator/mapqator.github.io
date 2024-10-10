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
import {
	AddLocationAlt,
	Clear,
	Flag,
	KeyboardArrowRight,
	KeyboardDoubleArrowRight,
	NextPlanTwoTone,
	Place,
	RemoveRedEye,
	Route,
	Save,
	Send,
	Settings,
	ShareLocation,
} from "@mui/icons-material";

import DirectionForm from "./Forms/DirectionForm";
import NearbyGrid from "./Grids/NearbyGrid";
import NearbyForm from "./Forms/NearbyForm";
import AutocompleteSearchBox from "./InputFields/AutocompleteSearchBox";
import MapComponent from "./Embed/MapComponent";
import PlacesGrid from "./Grids/PlacesGrid";
import SavedPlacesGrid from "./Grids/SavedPlacesGrid";
import PlacesForm from "./Forms/PlacesForm";
import RouteSearchGrid from "./Grids/RouteSearchGrid";
import RouteSearchForm from "./Forms/RouteSearchForm";
import DirectionGrid from "./Grids/DirectionGrid";
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
					<Typography
						sx={{
							whiteSpace: "pre-line",
							paddingBottom: "8px",
						}}
					>
						{step.description}
					</Typography>
					{step.component
						? step.component
						: step.form && (
								<>
									<Divider />
									<Box>
										<Box className="mx-auto w-full p-5">
											{step.form}
										</Box>
										{step.grid && (
											<>
												<Divider />
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
									</Box>
									<Divider />
								</>
						  )}
					{/* {step.context !== undefined && (
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
					)} */}

					<Box sx={{ my: 1 }}>
						<div>
							<Button
								variant="contained"
								onClick={handleNext}
								sx={{ mt: 1, mr: 1 }}
								disabled={index === totalSteps - 1}
							>
								{index === 0 ? "Start" : "Continue"}
							</Button>
							{/* {index > 0 ? (
								<Button
									onClick={handleBack}
									sx={{ mt: 1, mr: 1 }}
								>
									Back
								</Button>
							) : (
								<LoadingButton
									onClick={async () => {
										setLoading(true);
										loadExample();
										setLoading(false);
									}}
									sx={{ mt: 1, mr: 1 }}
									loading={loading}
								>
									Start with Example
								</LoadingButton>
							)} */}
							{index > 0 && (
								<Button
									onClick={handleBack}
									sx={{ mt: 1, mr: 1 }}
								>
									Back
								</Button>
							)}
						</div>
					</Box>
				</div>
			</StepContent>
		</div>
	);
}
export default function ContextEditor({
	handleReset,
	onFinish,
	handleExample,
	activeStep,
	setActiveStep,
}) {
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		poisMap,
		distanceMatrix,
		setDistanceMatrix,
		directionInformation,
		setDirectionInformation,
		context,
		newDistance,
		setNewDistance,
		newNearbyPlaces,
		setNewNearbyPlaces,
		newDirection,
		setNewDirection,
		query,

		routePlacesMap,
		setRoutePlacesMap,
		newRoutePlaces,
		setNewRoutePlaces,
		savedPlacesMap,
	} = useContext(GlobalContext);

	const [locations, setLocations] = useState([]);

	const handleNext = () => {
		if (activeStep === steps.length - 1) onFinish();
		else setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const loadExample = () => {
		handleExample();
		handleNext();
	};

	const handlePlaceAdd = () => {
		setActiveStep(1);
	};

	useEffect(() => {
		const list = [];
		Object.keys(savedPlacesMap).map((place_id) => {
			const place = savedPlacesMap[place_id];
			if (!place.location) return;
			const lat = place.location.latitude;
			const lng = place.location.longitude;
			list.push({ lat, lng });
		});
		console.log(list);
		setLocations(list);
	}, [savedPlacesMap]);

	const steps = [
		{
			label: "Guidelines",
			description: `Welcome to the Context Generator! This tool helps you create rich, place-related contexts using Google Maps APIs. Here's how it works:

    		1. Add Places: Start by searching for and adding key locations to your context.
			2. Add Place Details: Add detailed information about a place.
			3. Explore Nearby Places: Discover nearby places and points of interest around your selected locations.
			4. Get Directions: Find routes between places or multi-stop routes.

			Let's begin!`,
			icon: <Flag />,
		},
		{
			label: "Search for Places",
			description: `Start by searching for a location. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			additional: "Places you have saved.",
			form: <AutocompleteSearchBox />,
			grid: Object.keys(savedPlacesMap).length > 0 && (
				<>
					<MapComponent locations={locations} />
					<SavedPlacesGrid
						{...{
							selectedPlacesMap,
							setSelectedPlacesMap,
							savedPlacesMap,
						}}
						mode="edit"
					/>
				</>
			),
		},
		{
			label: "Add details of Places",
			description: `Add full details of a place.`,
			icon: <AddLocationAlt />,
			additional: "Places you have added to the context.",
			form: <PlacesForm {...{ handlePlaceAdd }} />,
			grid: Object.keys(selectedPlacesMap).length > 0 && (
				<>
					<PlacesGrid
						{...{
							selectedPlacesMap,
							setSelectedPlacesMap,
							savedPlacesMap,
						}}
						mode="edit"
					/>
				</>
			),
			context: context.places,
		},
		{
			label: "Search for Nearby places",
			description: `Use the Nearby Search Tool to discover points of interest around your selected location. You just need to select a location and the type of poi you are looking for. 
			Additionally you can specify the order in which results are listed. Possible values are Prominence and Distance. When prominence is specified, the radius parameter is required. 
			You can choose a type from the given list or a custom type. It is recommended to choose from the given list for better result.`,
			additional:
				"List of places whose nearby pois are added to the context",
			// icon: <SiGooglenearby />,
			icon: <ShareLocation />,
			form: (
				<NearbyForm
					{...{ handlePlaceAdd, newNearbyPlaces, setNewNearbyPlaces }}
				/>
			),
			grid: Object.keys(nearbyPlacesMap).length > 0 && (
				<NearbyGrid
					{...{
						nearbyPlacesMap,
						setNearbyPlacesMap,
						savedPlacesMap,
						distanceMatrix,
						setDistanceMatrix,
					}}
					mode="edit"
				/>
			),
			context: context.nearby,
		},
		{
			label: "Compute Routes",
			description: `Utilize the Directions API to find routes between two points. Choose origin, destination and travel mode to find possible routes between them.`,
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <DirectionsIcon />,
			form: (
				<DirectionForm
					{...{ handlePlaceAdd, newDirection, setNewDirection }}
				/>
			),
			grid: Object.keys(directionInformation).length > 0 && (
				<DirectionGrid
					{...{
						directionInformation,
						setDirectionInformation,
						savedPlacesMap,
					}}
					mode="edit"
				/>
			),
			context: context.direction,
		},
		{
			label: "Search Along Route",
			description: `Utilize the Places API to find places along a route. Choose a route to find places along the route.`,
			additional:
				"List of origin - destination pairs whose alternative routes are added to the context",
			icon: <Route />,
			form: (
				<RouteSearchForm
					{...{ handlePlaceAdd, newRoutePlaces, setNewRoutePlaces }}
				/>
			),
			grid: Object.keys(routePlacesMap).length > 0 && (
				<RouteSearchGrid
					{...{
						routePlacesMap,
						setRoutePlacesMap,
						directionInformation,
						savedPlacesMap,
					}}
					mode="edit"
				/>
			),
			// context: context.direction,
		},
	];
	return (
		<>
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<ContextStep
							totalSteps={steps.length}
							{...{
								step,
								index,
								activeStep,
								setActiveStep,
								handleNext,
								handleBack,
								loadExample,
							}}
						/>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Paper square elevation={0} sx={{ p: 3 }}>
					<Typography>
						All steps completed - you&apos;re finished. <br></br>Now
						you can proceed to create a question based on the
						context you have generated.
					</Typography>
					<Button onClick={onFinish} sx={{ mt: 1, mr: 1 }}>
						Create Question
					</Button>
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Start new context
					</Button>
				</Paper>
			)}
			<Divider sx={{ my: 1 }} />
			<div className="flex">
				<Button
					onClick={() => {
						// if (
						// 	Object.keys(selectedPlacesMap).length +
						// 		Object.keys(nearbyPlacesMap).length +
						// 		Object.keys(poisMap).length +
						// 		Object.keys(directionInformation).length +
						// 		Object.keys(distanceMatrix).length ===
						// 	0
						// ) {
						// 	setActiveStep(0);
						// 	showError(
						// 		"Please add some place information first"
						// 	);
						// } else
						{
							onFinish();
						}
					}}
					variant="contained"
					sx={{ mt: 1, mr: 1 }}
					endIcon={<Send />}
				>
					Submit {query.id === undefined ? "" : "#" + query.id}
				</Button>
				<Button
					onClick={handleReset}
					sx={{ mt: 1, mr: 1 }}
					color="error"
					startIcon={<Clear />}
				>
					Clear
				</Button>
			</div>
		</>
	);
}