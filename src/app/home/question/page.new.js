"use client";
import React, { useContext, useEffect } from "react";
import {
	Box,
	Typography,
	Button,
	Paper,
	Divider,
	Container,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import { getUserName } from "@/api/base";
import QuestionForm from "@/components/Forms/QuestionForm";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { useAuth } from "@/contexts/AuthContext";
import { AppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";

export default function QuestionCreationPage() {
	const { setQuery, initQuery, setQueryStatus } = useContext(GlobalContext);

	const router = useRouter();

	const onFinish = () => {
		router.push("/home");
		setQueryStatus("saved");
	};

	const handleReset = () => {
		setQuery((prev) => ({
			...initQuery,
			context: prev.context,
			context_json: prev.context_json,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setQueryStatus("saved");
		onFinish();
	};

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Create a Question
				</Typography>
				<Typography variant="body1" paragraph>
					Select a category and write your location-based question
					below. You can view example questions for inspiration.
				</Typography>
				<QuestionForm
					handleSubmit={handleSubmit}
					handleReset={handleReset}
				/>
			</Box>
		</Container>
	);
}
