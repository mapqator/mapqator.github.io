"use client";
import { useContext, useEffect, useState } from "react";
import {
	Box,
	Container,
	Typography,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Paper,
	Card,
	Divider,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import { AutocompleteSearchBox } from "./Search/AutocompleteSearchBox";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceInformation from "./Search/PlaceCards";
import NearbyInfo from "./Nearby";
import DiscoverArea from "./Area";
import CalculateDistance from "./Distance";
import GetDirections from "./Direction";
import ContextViewer from "./ContextPreview";
import { Flag, RemoveRedEye, Settings } from "@mui/icons-material";
import ExploreIcon from "@mui/icons-material/Explore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Parameters } from "./Parameters/params";
import MapComponent from "./Search/MapComponent";
import PlaceSearch from "./Search";
import ContextGeneratorService from "@/services/contextGeneratorService";

export default function ContextGenerator({
	onFinish,
	activeStep,
	setActiveStep,
}) {
	const {
		savedPlacesMap,
		setSavedPlacesMap,
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
		context,
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

	const steps = [
		{
			label: "Guidelines",
			description: `Welcome to the Context Generator! This tool helps you create rich, place-related contexts using Google Maps APIs. Here's how it works:

    		1. Add Places: Start by searching for and adding key locations to your context.
			2. Explore Nearby Places: Discover nearby places and points of interest around your selected locations.
			3. Discover Area POIs: Find points of interest within a larger area, like a city or neighborhood.
			3. Get Directions & Distances: Find routes between places and calculate distances.
			4. Generate Context: Review and finalize your place-related information.

			Use the "Continue" button to move through each step, or click on the step icons to jump to a specific step. Let's begin!`,
			icon: <Flag />,
		},
		{
			label: "Add Places",
			description: `Start by searching for a location using the Places API. Type in a place name or address in the search bar below. While typing, saved places matching the search query will be shown. On pressing enter, google places API will be queried and the results will be shown.`,
			icon: <SearchIcon />,
			component: <PlaceSearch />,
			context: context.places,
		},
		{
			label: "Explore Nearby Places",
			description: `Use the Nearby Search API to discover points of interest around your selected location. Click on the "Nearby" button and choose a category.
			You can choose a type from the given list or a custom type. Custom type's results are unpredictable.`,
			icon: <PlaceIcon />,
			component: (
				<>
					<Divider />
					<Box className="w-full md:w-[30rem] mx-auto">
						<NearbyInfo
							{...{
								savedPlacesMap,
								setSavedPlacesMap,
								selectedPlacesMap,
								nearbyPlacesMap,
								setNearbyPlacesMap,
								setSelectedPlacesMap,
							}}
						/>
					</Box>
					<Divider />
				</>
			),
			context: context.nearby,
		},
		{
			label: "Discover Area POIs",
			description: `Explore various Points of Interest (POIs) within a larger area using the Places API. Select a region like a city or neighborhood, then choose a category (e.g., restaurants, museums, parks) to see POIs within that area.`,
			icon: <ExploreIcon />,
			component: (
				// <Card className="p-3" raised>
				<>
					<Divider />
					<Box className="w-full md:w-[30rem] mx-auto">
						<DiscoverArea
							{...{
								savedPlacesMap,
								setSavedPlacesMap,
								selectedPlacesMap,
								poisMap,
								setPoisMap,
								setSelectedPlacesMap,
							}}
						/>
					</Box>
					<Divider />
				</>

				// </Card>
			),
			context: context.area,
		},
		{
			label: "Calculate Distances",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Select several places and click "Calculate Distances".`,
			icon: <MapIcon />,
			component: (
				<>
					<Divider />
					<Box className="w-full md:w-[30rem] mx-auto">
						<CalculateDistance
							{...{
								selectedPlacesMap,
								savedPlacesMap,
								distanceMatrix,
								setDistanceMatrix,
							}}
						/>
					</Box>
					<Divider />
				</>
			),
			context: context.distance,
		},
		{
			label: "Get Directions",
			description: `Utilize the Directions API to find routes between two points. Click on two places on the map to set start and end points.`,
			icon: <DirectionsIcon />,
			component: (
				<>
					<Divider />
					<Box className="w-full md:w-[30rem] mx-auto">
						<GetDirections
							{...{
								selectedPlacesMap,
								savedPlacesMap,
								directionInformation,
								setDirectionInformation,
							}}
						/>
					</Box>
					<Divider />
				</>
			),
			context: context.direction,
		},
		{
			label: "Set Context Parameters",
			description: `Set the time, day, and location that should be used as a basis for answering questions. This will help provide more accurate and context-specific responses.`,
			icon: <Settings />,
			component: (
				<>
					<Divider />
					<Box className="w-full md:w-[30rem] mx-auto">
						<Parameters
							{...{
								selectedPlacesMap,
								currentInformation,
								setCurrentInformation,
								savedPlacesMap,
							}}
						/>
					</Box>
					<Divider />
				</>
			),
			context: context.params,
		},
		{
			label: "Preview Full Context",
			description: `Review the information gathered and click on "Finish" when you are done.`,
			icon: <RemoveRedEye />,
			component: (
				<>
					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
						<ContextViewer
							context={
								context.places +
								"\n" +
								context.nearby +
								"\n" +
								context.area +
								"\n" +
								context.distance +
								"\n" +
								context.direction +
								"\n" +
								context.params
							}
						/>
					</Paper>
				</>
			),
		},
	];
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

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
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepLabel
							icon={step.icon}
							onClick={() => {
								if (index !== activeStep) setActiveStep(index);
								// else setActiveStep(-1);
							}}
							className="!cursor-pointer hover:!text-blue-500"
						>
							{step.label}
						</StepLabel>
						<StepContent>
							<div className="flex flex-col gap-2">
								<Typography
									sx={{
										whiteSpace: "pre-line", // This CSS property will make newlines render as expected
									}}
								>
									{steps[activeStep]?.description}
								</Typography>
								{step.component}
								{step.context !== undefined && (
									<>
										<Typography
											sx={{
												whiteSpace: "pre-line", // This CSS property will make newlines render as expected
											}}
										>
											Based on the information you add, a
											context will be generated below.
										</Typography>

										<Paper
											elevation={1}
											sx={{ p: 2, bgcolor: "grey.100" }}
										>
											<ContextViewer
												context={step.context}
											/>
										</Paper>
									</>
								)}

								<Box sx={{ mb: 2 }}>
									<div>
										<Button
											variant="contained"
											onClick={handleNext}
											sx={{ mt: 1, mr: 1 }}
											// disabled={
											// 	index === steps.length - 1
											// }
										>
											{index === steps.length - 1
												? "Finish"
												: index === 0
												? "Start"
												: "Continue"}
											{/* {"Continue"} */}
										</Button>
										{index > 0 && (
											<Button
												// disabled={index === 0}
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
						Reset
					</Button>
				</Paper>
			)}
		</>
	);
}
