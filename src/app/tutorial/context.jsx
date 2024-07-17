"use client";
import { useContext, useState } from "react";
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
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";
// import { AreaIcon } from "@material-ui/icons";

import { AppBar, Toolbar } from "@mui/material";
import HybridSearch, { AutocompleteSearchBox } from "../HybridSearch";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceInformation from "../PlaceInformation";
import NearbyInformation, { NearbyInfo } from "../NearbyInformation";
import POI, { DiscoverArea } from "../POI";
import DistanceInformation, { CalculateDistance } from "../DistanceInformation";
import DirectionInformation from "../DirectionInformation";
import ContextPreview from "../ContextPreview";
import { Flag } from "@mui/icons-material";
import ExploreIcon from "@mui/icons-material/Explore";

export default function ContextGenerator({ onFinish }) {
	const [activeStep, setActiveStep] = useState(0);
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
		contextJSON,
		setContextJSON,
		context,
		setContext,
	} = useContext(GlobalContext);
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
			description: `Start by searching for a location using the Places API. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			component: (
				<div className="flex flex-col gap-2">
					<Card className="p-3">
						<AutocompleteSearchBox
							{...{
								savedPlacesMap,
								setSavedPlacesMap,
								selectedPlacesMap,
								setSelectedPlacesMap,
								setPoisMap,
							}}
						/>
					</Card>

					<PlaceInformation
						{...{
							selectedPlacesMap,
							setSelectedPlacesMap,
							savedPlacesMap,
							distanceMatrix,
							setDistanceMatrix,
							directionInformation,
							setDirectionInformation,
							nearbyPlacesMap,
							setNearbyPlacesMap,
							poisMap,
							setPoisMap,
						}}
					/>
				</div>
			),
		},
		{
			label: "Explore Nearby Places",
			description: `Use the Nearby Search API to discover points of interest around your selected location. Click on the "Nearby" button and choose a category.`,
			icon: <PlaceIcon />,
			component: (
				<Card className="p-3">
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
				</Card>
			),
		},
		{
			label: "Discover Area POIs",
			description: `Explore various Points of Interest (POIs) within a larger area using the Places API. Select a region like a city or neighborhood, then choose a category (e.g., restaurants, museums, parks) to see POIs within that area.`,
			icon: <ExploreIcon />,
			component: (
				<Card className="p-3">
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
				</Card>
			),
		},
		{
			label: "Get Directions",
			description: `Utilize the Directions API to find routes between two points. Click on two places on the map to set start and end points.`,
			icon: <DirectionsIcon />,
			component: (
				<DirectionInformation
					{...{
						selectedPlacesMap,
						savedPlacesMap,
						directionInformation,
						setDirectionInformation,
					}}
				/>
			),
		},
		{
			label: "Calculate Distances",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Select several places and click "Calculate Distances".`,
			icon: <MapIcon />,
			component: (
				<Card className="p-3">
					<CalculateDistance
						{...{
							selectedPlacesMap,
							savedPlacesMap,
							distanceMatrix,
							setDistanceMatrix,
						}}
					/>
				</Card>
			),
		},
		{
			label: "Generate Context",
			description: `Review the information gathered and click "Generate Context" to create a rich, location-based context for your QnA dataset.`,
			icon: <SearchIcon />,
			component: (
				<ContextPreview
					{...{
						setContextJSON,
						context,
						setContext,
						savedPlacesMap,
						selectedPlacesMap,
						distanceMatrix,
						nearbyPlacesMap,
					}}
				/>
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
		setActiveStep(0);
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
							optional={
								index === steps.length - 1 ? (
									<Typography variant="caption">
										Last step
									</Typography>
								) : null
							}
							icon={step.icon}
							onClick={() => {
								if (index !== activeStep) setActiveStep(index);
								else setActiveStep(-1);
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
					{/* <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Edit
					</Button> */}
				</Paper>
			)}
		</>
	);
}
