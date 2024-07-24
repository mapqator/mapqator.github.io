import { useEffect, useState } from "react";
import { Container } from "@mui/material";

import { Toolbar } from "@mui/material";
import ContextGenerator from "./ContextGenerator";
import QuestionCreationPage from "./QuestionCreator";
import DatasetPage from "./Dataset";
import EvaluationResultsPage from "./Evaluation";
import Navbar from "@/components/Navbar";

export default function Home() {
	const [activeStep, setActiveStep] = useState(null);
	const [selected, setSelected] = useState("context");

	useEffect(() => {
		const page = window.location.hash.substring(1);
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
