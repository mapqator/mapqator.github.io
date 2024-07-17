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
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";
// import { AreaIcon } from "@material-ui/icons";

import { AppBar, Toolbar } from "@mui/material";
import HybridSearch from "../HybridSearch";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceInformation from "../PlaceInformation";
import NearbyInformation from "../NearbyInformation";
import POI from "../POI";
import DistanceInformation from "../DistanceInformation";
import DirectionInformation from "../DirectionInformation";
import ContextPreview from "../ContextPreview";
import { Flag } from "@mui/icons-material";

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
			description: `This tutorial will guide you through the process of generating a context using Google Maps APIs. Users first need to add some places in the context. Then nearby pois, distance between places and alternative routes can be added. At each step, press "Continue" to move to the next step. Alternatively, click on the step icons to navigate to a specific step.`,
			icon: <Flag />,
		},
		{
			label: "Select a Location",
			description: `Start by searching for a location using the Places API. Type in a place name or address in the search bar below.`,
			icon: <SearchIcon />,
			component: (
				<div className="flex flex-col gap-2">
					<HybridSearch
						{...{
							savedPlacesMap,
							setSavedPlacesMap,
							selectedPlacesMap,
							setSelectedPlacesMap,
							setPoisMap,
						}}
					/>
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
				<NearbyInformation
					{...{
						savedPlacesMap,
						setSavedPlacesMap,
						selectedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
						setSelectedPlacesMap,
					}}
				/>
			),
		},
		{
			label: "Explore POIs in Area",
			description: `Leverage the Places API to find Points of Interest (POIs) within a specific area. Draw or select an area on the map to see POIs within that area.`,
			icon: <PlaceIcon />,
			component: (
				<POI
					{...{
						savedPlacesMap,
						setSavedPlacesMap,
						selectedPlacesMap,
						poisMap,
						setPoisMap,
						setSelectedPlacesMap,
					}}
				/>
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
				<DistanceInformation
					{...{
						selectedPlacesMap,
						savedPlacesMap,
						distanceMatrix,
						setDistanceMatrix,
					}}
				/>
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
							onClick={() => setActiveStep(index)}
							className="!cursor-pointer hover:!text-blue-500"
						>
							{step.label}
						</StepLabel>
						<StepContent>
							<div className="flex flex-col gap-2">
								<Typography>{step.description}</Typography>
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
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Edit
					</Button>
				</Paper>
			)}
		</>
	);
}
