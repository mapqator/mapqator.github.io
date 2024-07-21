"use client";
import { useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";

import { AppBar, Toolbar } from "@mui/material";
import ContextGenerator from "@/components/ContextGenerator";
import QuestionCreationPage from "@/components/QuestionCreator";
import DatasetPage from "@/components/Dataset";
import EvaluationResultsPage from "@/components/Evaluation";
import Navbar from "@/components/Navbar";

import { toast } from "react-toastify";
import GlobalContextProvider, { GlobalContext } from "@/contexts/GlobalContext";
import ParentProvider from "./wrapper";
export const showToast = (message, type) => {
	console.log(message, type);
	if (type === "success") toast.success(message, {});
	else if (type === "error") toast.error(message, {});
	else {
		toast.dark(message, {});
	}
};
export const showSuccess = (message, res) => {
	showToast(message, "success");
};
export const showError = (message) => {
	showToast(message, "error");
};

export const showMessage = (message, res) => {
	if (res === undefined) showToast("Couldn't connect to server", "error");
	else if (res.success) showToast(message);
	else showToast(res.error, "error");
};

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
		<GlobalContextProvider>
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
		</GlobalContextProvider>
	);
}
