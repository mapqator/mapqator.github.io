"use client";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import gptApi from "@/api/gptApi";
import { motion, AnimatePresence } from "framer-motion";
import {
	Box,
	Card,
	CardContent,
	Typography,
	Chip,
	CircularProgress,
	Grid,
	Avatar,
	LinearProgress,
	Button,
	Container,
} from "@mui/material";
import ContextPreview from "@/components/Cards/ContextPreview";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import queryApi from "@/api/queryApi";
import { AppContext } from "@/contexts/AppContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import EditIcon from "@mui/icons-material/Edit";
import Confirmation from "@/components/Dialogs/Confirmation";
import geminiApi from "@/api/geminiApi";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const SaveQuery = ({ onSave, onDiscard }) => {
	const [showSnackbar, setShowSnackbar] = useState(false);

	const handleSave = () => {
		onSave();
		setShowSnackbar(true);
	};

	return (
		<Box className="mt-4 p-4 bg-blue-50 rounded-lg">
			<Typography variant="h6" gutterBottom>
				Save this query?
			</Typography>
			<Box display="flex" className="gap-2" mt={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSave}
					startIcon={<SaveIcon />}
				>
					Save
				</Button>
				<Button
					variant="outlined"
					color="error"
					onClick={onDiscard}
					startIcon={<DeleteIcon />}
				>
					Discard
				</Button>
			</Box>
		</Box>
	);
};

const LoginPrompt = ({ onLogin }) => {
	return (
		<Box className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
			<LockIcon className="text-gray-500 mb-2" fontSize="large" />
			<Typography variant="h6" gutterBottom>
				Want to save this query?
			</Typography>
			<Typography variant="body2" gutterBottom>
				Log in to save your query for future reference.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={onLogin}
				startIcon={<LockIcon />}
			>
				Log In to Save
			</Button>
		</Box>
	);
};
export default function LiveEvaluation() {
	const {
		query,
		initQuery,
		setQuery,
		context,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		directionInformation,
		distanceMatrix,
		currentInformation,
	} = useContext(GlobalContext);

	const { llmResults, setLlmResults } = useContext(GlobalContext);
	const { isAuthenticated } = useAuth();
	const { setEvaluationStatus, queryStatus } = useContext(GlobalContext);
	const { queries, setQueries, savedPlacesMap } = useContext(AppContext);

	useEffect(() => {
		if (queryStatus === "empty") {
			router.push("/home");
		}
	}, [queryStatus]);

	const router = useRouter();

	const handleLogin = () => {
		router.push(config.logoutRedirect);
	};

	const handleReset = () => {
		setQuery((prev) => ({
			...initQuery,
			context: prev.context,
			context_json: prev.context_json,
		}));
		setLlmResults({});
	};

	const handleSave = async () => {
		const newQuery = {
			...query,
			context: ContextGeneratorService.convertContextToText(context),
			context_json: {
				saved_places: savedPlacesMap,
				distance_matrix: distanceMatrix,
				places: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				current_information: currentInformation,
				pois: poisMap,
				directions: directionInformation,
			},
		};

		if (query.id === undefined) {
			const res = await queryApi.createQuery(newQuery);
			if (res.success) {
				// update the queries
				showSuccess("Query saved successfully");
				const newQueries = [...queries];
				newQueries.unshift(res.data[0]);
				setQueries(newQueries);
				handleReset();
				router.push("/home/my-dataset");
			} else {
				showError("Can't save this query");
				// window.scrollTo(0, 0);
			}
		} else {
			const res = await queryApi.updateQuery(query.id, newQuery);
			if (res.success) {
				setQueries((prev) =>
					prev.map((q) => (q.id === res.data[0].id ? res.data[0] : q))
				);
				// update the queries
				showSuccess("Query edited successfully");
				handleReset();
				router.push("/home/my-dataset");
			} else {
				showError("Can't update this query");
				// window.scrollTo(0, 0);
			}
		}
	};

	const handleDiscard = () => {
		console.log("Discarding query");
		// setShowSavePrompt(false);
		handleReset();
		router.push("/home");
	};

	const [open, setOpen] = useState(false);
	const handleEditQuestion = () => {
		router.push("/home/question");
	};

	return (
		<Container maxWidth="md">
			<Box className="h-full flex flex-col justify-center p-4 w-full pt-10">
				<Confirmation
					open={open}
					setOpen={setOpen}
					onConfirm={() => {
						handleDiscard();
					}}
					text="Your query and evaluation will be lost. Are you sure you want to discard?"
				/>

				<Card elevation={2} className="mb-4 w-full bg-green-50">
					<CardContent>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={2}
						>
							<Box display="flex" alignItems="center">
								<Avatar
									className="mr-2"
									sx={{ backgroundColor: "#22c55e" }}
								>
									<QuestionMarkIcon />
								</Avatar>
								<Typography variant="h6">Question</Typography>
							</Box>
							<Button
								variant="outlined"
								color="primary"
								startIcon={<EditIcon />}
								onClick={handleEditQuestion}
							>
								Edit
							</Button>
						</Box>
						<Typography
							variant="body1"
							gutterBottom
							className="font-bold"
						>
							{query.question}
						</Typography>
						<Grid container spacing={2} className="mt-2">
							{query.answer.options.map((option, index) => (
								<Grid item xs={12} sm={6} key={index}>
									<Card
										variant="outlined"
										className="bg-white"
									>
										<CardContent>
											<Typography variant="body2">
												Option {index + 1}: {option}
												{index ===
													query.answer.correct && (
													<CheckCircleIcon
														className="text-green-500 ml-2"
														fontSize="small"
													/>
												)}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</CardContent>
				</Card>

				<Card elevation={2} className="mb-4 w-full bg-blue-50">
					<CardContent>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
							mb={2}
						>
							<Box display="flex" alignItems="center">
								<Avatar
									className="mr-2"
									sx={{ backgroundColor: "#3b82f6" }}
								>
									<DescriptionIcon />
								</Avatar>
								<Typography variant="h6">
									Reference Information
								</Typography>
							</Box>
							<Button
								variant="outlined"
								color="primary"
								startIcon={<EditIcon />}
								onClick={() => router.push("/home/context")}
							>
								Edit
							</Button>
						</Box>
						<CollapsedContext
							context={ContextGeneratorService.convertContextToText(
								context
							)}
						/>
					</CardContent>
				</Card>
				{isAuthenticated ? (
					<SaveQuery onSave={handleSave} onDiscard={setOpen} />
				) : (
					<LoginPrompt onLogin={handleLogin} />
				)}
			</Box>
		</Container>
	);
}
