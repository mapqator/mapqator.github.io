import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";

import { Toolbar } from "@mui/material";
import ContextGenerator from "./ContextGenerator";
import QuestionCreationPage from "./QuestionCreator";
import DatasetPage from "./Dataset";
import EvaluationResultsPage from "./Evaluation";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { getGoogleMapsApiKey } from "@/api/base";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";
import KeyStoreButton from "@/components/Buttons/KeyStoreButton";
import LeftSidebar from "@/components/LeftSidebar";
import config from "@/config/config";
import HomePage from "../features/page";
export default function Home() {
	const [activeStep, setActiveStep] = useState(null);
	const [selected, setSelected] = useState("home");
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const page = window.location.hash.substring(1);
		setSelected(page === "" || page === "onboard" ? "home" : page);
	}, []);

	useEffect(() => {
		const page = window.location.hash.substring(1);
		if (activeStep === null) {
			// setActiveStep(page === "onboard" || page === "" ? 0 : 1);
			setActiveStep(0);
		}
	}, [selected]);

	return (
		<Box sx={{ display: "flex" }}>
			<Box
				sx={{
					width: { xs: "0px", md: `calc(${config.drawerWidth}px)` },
				}}
			>
				<LeftSidebar {...{ selected, setSelected }} />
			</Box>

			<Container
				maxWidth="md"
				// sx={{ mt: 4, mb: 4 }}
				className="min-h-screen"
			>
				{/* <Navbar {...{ selected, setSelected }} /> */}
				<div className="md:hidden">
					<Toolbar />
				</div>
				{selected === "context" ? (
					<ContextGenerator
						onFinish={() => {
							setSelected("question");
							router.push("/#question");
							window.scrollTo(0, 0);
						}}
						{...{ activeStep, setActiveStep }}
					/>
				) : selected === "question" ? (
					<QuestionCreationPage
						handleContextEdit={() => {
							setSelected("context");
							router.push("/#context");
							window.scrollTo(0, 0);
						}}
					/>
				) : selected === "dataset" ? (
					<DatasetPage
						onEdit={() => {
							setSelected("question");
							router.push("/#question");
							window.scrollTo(0, 0);
						}}
					/>
				) : selected === "evaluation" ? (
					<EvaluationResultsPage />
				) : (
					selected === "home" && <HomePage {...{ setSelected }} />
				)}

				{/* {isAuthenticated && <KeyStoreButton />} */}
			</Container>
		</Box>
	);
}
