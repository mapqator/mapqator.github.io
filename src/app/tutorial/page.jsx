"use client";
import { useState } from "react";
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
import ContextGenerator from "./context";
import QuestionCreationPage from "./question";

function Navbar({ selected, setSelected }) {
	const handleButtonClick = (buttonName) => {
		setSelected(buttonName);
	};

	return (
		<AppBar position="static" sx={{ background: "white", mb: 4 }}>
			<Toolbar>
				<Typography
					variant="h6"
					component="div"
					sx={{ flexGrow: 1, color: "black" }}
					className="flex flex-row gap-2 items-center"
				>
					<Image
						src={`${
							process.env.REACT_APP_BASE_URL ?? ""
						}/images/logo.png`}
						alt="Google Maps Logo"
						width={30}
						height={30}
					/>
					MapQuest
				</Typography>
				<Button
					style={{
						color:
							selected === "context-generator" ? "blue" : "black",
					}}
					onClick={() => handleButtonClick("context-generator")}
					href="#context-generator"
				>
					Context
				</Button>
				<Button
					style={{
						color:
							selected === "question-creator" ? "blue" : "black",
					}}
					onClick={() => handleButtonClick("question-creator")}
					href="#question-creator"
				>
					Question
				</Button>
				<Button
					style={{ color: selected === "dataset" ? "blue" : "black" }}
					onClick={() => handleButtonClick("dataset")}
					href="#dataset"
				>
					Dataset
				</Button>
				<Button
					style={{
						color: selected === "evaluation" ? "blue" : "black",
					}}
					onClick={() => handleButtonClick("evaluation")}
					href="#evaluation"
				>
					Evaluation
				</Button>
			</Toolbar>
		</AppBar>
	);
}

export default function PageComponent() {
	const [activeStep, setActiveStep] = useState(0);
	const [selected, setSelected] = useState("context-generator");
	const steps = [
		{
			label: "Select a Location",
			description: `Start by searching for a location using the Places API. Type in a place name or address in the search bar above the map.`,
			icon: <SearchIcon />,
		},
		{
			label: "Explore Nearby Places",
			description: `Use the Nearby Search API to discover points of interest around your selected location. Click on the "Nearby" button and choose a category.`,
			icon: <PlaceIcon />,
		},
		{
			label: "Explore POIs in Area",
			description: `Leverage the Places API to find Points of Interest (POIs) within a specific area. Draw or select an area on the map to see POIs within that area.`,
			icon: <PlaceIcon />,
		},
		{
			label: "Get Directions",
			description: `Utilize the Directions API to find routes between two points. Click on two places on the map to set start and end points.`,
			icon: <DirectionsIcon />,
		},
		{
			label: "Calculate Distances",
			description: `Use the Distance Matrix API to get travel distances and times between multiple locations. Select several places and click "Calculate Distances".`,
			icon: <MapIcon />,
		},
		{
			label: "Generate Context",
			description: `Review the information gathered and click "Generate Context" to create a rich, location-based context for your QnA dataset.`,
			icon: <SearchIcon />,
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
		<Container
			maxWidth="md"
			sx={{ mt: 4, mb: 4 }}
			// className="gap-5 flex flex-col"
		>
			<Navbar {...{ selected, setSelected }} />
			{selected === "context-generator" ? (
				<ContextGenerator
					onFinish={() => setSelected("question-creator")}
				/>
			) : (
				<QuestionCreationPage
					handleContextEdit={() => setSelected("context-generator")}
				/>
			)}
		</Container>
	);
}
