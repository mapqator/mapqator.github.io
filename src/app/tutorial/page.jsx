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
import DatasetPage from "./dataset";
import EvaluationResultsPage from "./evaluation";
import { useRouter } from "next/navigation";

function Navbar({ selected, setSelected }) {
	const [baseUrl, setBaseUrl] = useState(
		process.env.REACT_APP_BASE_URL
			? process.env.REACT_APP_BASE_URL
			: process.env.NODE_ENV === "development"
			? ""
			: "https://mahirlabibdihan.github.io/mapquest"
	);
	const handleButtonClick = (buttonName) => {
		setSelected(buttonName);
	};
	const navItems = [
		{ name: "Context", key: "context-generator" },
		{ name: "Question", key: "question-creator" },
		{ name: "Dataset", key: "dataset" },
		{ name: "Evaluation", key: "evaluation" },
	];
	const router = useRouter();

	return (
		<AppBar position="static" sx={{ background: "white", mb: 4 }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box
					onClick={() => router.push("landing")}
					className="cursor-pointer flex-row items-center flex"
				>
					<Image
						src={`${baseUrl}/images/logo.png`}
						alt="MapQuest Logo"
						width={30}
						height={30}
					/>
					<div className="hidden lg:flex flex-col justify-center">
						<Typography
							variant="h6"
							component="div"
							sx={{ ml: 2, color: "#333", fontWeight: "bold" }}
						>
							MapQuest
						</Typography>
						<h6
							// sx={{ ml: 2, color: "#333", fontWeight: "bold" }}
							className="text-xs text-gray-500 ml-8 h-3"
							style={{
								fontSize: "0.6rem",
								transform: "translateY(-5px)",
							}}
						>
							by Mahir Labib Dihan
						</h6>
					</div>
				</Box>
				<Box>
					{navItems.map((item) => (
						<Button
							key={item.key}
							onClick={() => setSelected(item.key)}
							sx={{
								mx: 1,
								color:
									selected === item.key ? "#1976d2" : "#666",
								fontWeight:
									selected === item.key ? "bold" : "normal",
								"&:hover": {
									backgroundColor: "rgba(25, 118, 210, 0.04)",
								},
								transition: "all 0.3s",
								borderBottom:
									selected === item.key
										? "2px solid #1976d2"
										: "none",
								borderRadius: 0,
								paddingBottom: "6px",
							}}
						>
							{item.name}
						</Button>
					))}
				</Box>
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
					onFinish={() => {
						setSelected("question-creator");
						window.scrollTo(0, 0);
					}}
				/>
			) : selected === "question-creator" ? (
				<QuestionCreationPage
					handleContextEdit={() => {
						setSelected("context-generator");
						window.scrollTo(0, 0);
					}}
				/>
			) : selected === "dataset" ? (
				<DatasetPage
					onEdit={() => {
						setSelected("question-creator");
						window.scrollTo(0, 0);
					}}
				/>
			) : (
				<EvaluationResultsPage />
			)}
		</Container>
	);
}
