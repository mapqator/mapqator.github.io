"use client";
import { useEffect, useState } from "react";
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
		{ name: "Context", key: "context" },
		{ name: "Question", key: "question" },
		{ name: "Dataset", key: "dataset" },
		{ name: "Evaluation", key: "evaluation" },
	];
	const router = useRouter();

	return (
		<AppBar position="fixed" sx={{ background: "white", mb: 4 }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box
					onClick={() => router.push("landing")}
					className="cursor-pointer flex-row items-center flex w-1/6"
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
				<Box className="w-1/6 hidden md:flex"></Box>
			</Toolbar>
		</AppBar>
	);
}

export default function PageComponent() {
	const [activeStep, setActiveStep] = useState(0);
	const [selected, setSelected] = useState("context-generator");

	useEffect(() => {
		const page = window.location.hash.substring(1);
		setSelected(page === "" ? "context" : page);
	}, [window.location.hash]);

	return (
		<Container
			maxWidth="md"
			sx={{ mt: 4, mb: 4 }}
			// className="gap-5 flex flex-col"
		>
			<Navbar {...{ selected, setSelected }} />
			<Toolbar />
			{selected === "context" || selected === "" ? (
				<ContextGenerator
					onFinish={() => {
						setSelected("question");
						window.scrollTo(0, 0);
					}}
				/>
			) : selected === "question" ? (
				<QuestionCreationPage
					handleContextEdit={() => {
						setSelected("context");
						window.scrollTo(0, 0);
					}}
				/>
			) : selected === "dataset" ? (
				<DatasetPage
					onEdit={() => {
						setSelected("question");
						window.scrollTo(0, 0);
					}}
				/>
			) : selected === "evaluation" ? (
				<EvaluationResultsPage />
			) : (
				<></>
			)}
		</Container>
	);
}
