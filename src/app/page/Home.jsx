import { useEffect, useState } from "react";
import { Container } from "@mui/material";

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

export default function Home() {
	const [activeStep, setActiveStep] = useState(null);
	const [selected, setSelected] = useState("context");
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		const page = window.location.hash.substring(1);
		setSelected(page === "" || page === "onboard" ? "context" : page);
	}, []);

	useEffect(() => {
		const page = window.location.hash.substring(1);
		if (selected === "context" && activeStep === null) {
			// setActiveStep(page === "onboard" || page === "" ? 0 : 1);
			setActiveStep(0);
		}
	}, [selected]);

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }} className="min-h-screen">
			<Navbar {...{ selected, setSelected }} />
			<Toolbar />
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
				<></>
			)}

			{/* {isAuthenticated && <KeyStoreButton />} */}
			<KeyStoreButton />
		</Container>
	);
}
