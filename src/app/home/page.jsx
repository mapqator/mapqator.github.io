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
import Navbar from "./Navbar";

export default function PageComponent() {
	const [activeStep, setActiveStep] = useState(null);
	const [selected, setSelected] = useState("context-generator");

	useEffect(() => {
		const page = window.location.hash.substring(1);
		console.log(
			"Hi" + (page === "" || page === "onboard" ? "context" : page)
		);
		setSelected(page === "" || page === "onboard" ? "context" : page);
	}, []);

	useEffect(() => {
		if (selected === "context" && activeStep === null) {
			setActiveStep(
				window.location.hash.substring(1) === "onboard" ? 0 : 1
			);
		}
	}, [selected]);

	return (
		<Container
			maxWidth="md"
			sx={{ mt: 4, mb: 4 }}
			// className="gap-5 flex flex-col"
		>
			<Navbar {...{ selected, setSelected }} />
			<Toolbar />
			{selected === "context" ? (
				<ContextGenerator
					onFinish={() => {
						setSelected("question");
						window.scrollTo(0, 0);
					}}
					{...{ activeStep, setActiveStep }}
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
