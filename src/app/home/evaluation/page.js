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
} from "@mui/material";
import ContextPreview from "@/components/Cards/ContextPreview";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LoginPrompt from "@/components/LoginPrompts";
import { useAuth } from "@/contexts/AuthContext";
import SaveQuery from "@/components/SaveQuery";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import queryApi from "@/api/queryApi";
import { AppContext } from "@/contexts/AppContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import EditIcon from "@mui/icons-material/Edit";
import Confirmation from "@/components/Dialogs/Confirmation";

const llmApis = {
	gpt4: {
		id: 6,
		name: "GPT-4",
		func: gptApi.askGPTLive,
	},
	gpt3: {
		id: 7,
		name: "GPT-3.5",
		func: gptApi.askGPTLive,
	},
	// Add more LLMs here
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
	const [stage, setStage] = useState(0);
	const { llmResults, setLlmResults } = useContext(GlobalContext);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showLoginPrompt, setShowLoginPrompt] = useState(false);
	const { isAuthenticated } = useAuth();
	const { setEvaluationStatus, queryStatus } = useContext(GlobalContext);
	const { queries, setQueries, savedPlacesMap } = useContext(AppContext);

	useEffect(() => {
		if (queryStatus === "empty") {
			router.push("/home");
		}
	}, [queryStatus]);

	const extract = (s) => {
		for (let char of s) {
			if (/\d/.test(char)) {
				return char;
			}
		}
		return null;
	};

	const extractSubstringInParentheses = (s) => {
		const match = s.match(/\(([^)]+)\)/);
		return match ? match[1] : null;
	};

	const evaluateLLM = async (llm, llmFunction) => {
		const res = await llmFunction(
			ContextGeneratorService.convertContextToText(context),
			query
		);
		if (res.success) {
			const option = extract(res.data);
			const explanation = extractSubstringInParentheses(res.data);
			const verdict =
				parseInt(option) - 1 === query.answer.correct
					? "right"
					: "wrong";
			setLlmResults((prev) => ({
				...prev,
				[llm]: { answer: res.data, option, explanation, verdict },
			}));
		}
	};

	const router = useRouter();

	const handleLogin = () => {
		router.push(config.logoutRedirect);
	};

	const runEvaluation = async () => {
		setStage(0);
		if (Object.keys(llmResults).length === 0) {
			setLlmResults({});
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setStage(1);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setStage(2);
			setIsProcessing(true);
			const evaluationPromises = Object.entries(llmApis).map(
				([name, entry]) => evaluateLLM(name, entry.func)
			);
			await Promise.all(evaluationPromises);
			setIsProcessing(false);
		}
		setStage(3);
		setShowLoginPrompt(true);
		setEvaluationStatus("evaluated");
	};

	useEffect(() => {
		runEvaluation();
	}, [query, context]);

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
			evaluation: Object.entries(llmResults).map(([llm, result]) => ({
				model_id: llmApis[llm].id,
				answer: result.answer,
				verdict: result.verdict,
			})),
		};

		if (query.id === undefined) {
			const res = await queryApi.createQueryWithEvaluation(newQuery);
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
			const res = await queryApi.updateQueryWithEvaluation(
				query.id,
				newQuery
			);
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
		<Box className="h-full flex flex-col justify-center p-4 w-full pt-10">
			<Confirmation
				open={open}
				setOpen={setOpen}
				onConfirm={() => {
					handleDiscard();
				}}
				text="Your query and evaluation will be lost. Are you sure you want to discard?"
			/>
			<LinearProgress
				variant="determinate"
				value={(stage / 3) * 100}
				className="mb-4"
			/>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<Card elevation={3} className="mb-4 w-full bg-blue-50">
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
								<Typography variant="h6">Context</Typography>
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

				<motion.div
					animate={{
						y: stage >= 1 ? 0 : 50,
						opacity: stage >= 1 ? 1 : 0,
					}}
					transition={{ duration: 0.5 }}
				>
					<Card elevation={3} className="mb-4 w-full bg-green-50">
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
									<Typography variant="h6">
										Question
									</Typography>
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
														query.answer
															.correct && (
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
				</motion.div>

				<AnimatePresence>
					{isProcessing && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
							transition={{ duration: 0.5 }}
							className="flex justify-center mb-4"
						>
							<CircularProgress />
						</motion.div>
					)}
				</AnimatePresence>

				{/* {stage >= 3 && (
					<motion.div
						initial={{ x: -50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Card elevation={3} className="mb-4 bg-purple-50">
							<CardContent>
								<Box display="flex" alignItems="center" mb={2}>
									<Avatar
										className="bg-purple-500 mr-2"
										sx={{ backgroundColor: "#a855f7" }}
									>
										<CheckCircleIcon />
									</Avatar>
									<Typography variant="h6">
										Ground Truth
									</Typography>
								</Box>
								<Typography
									variant="body1"
									className="font-bold"
									gutterBottom
								>
									Option {query.answer.correct + 1}:{" "}
									{query.answer.options[query.answer.correct]}
								</Typography>
								<Chip
									label="Correct Answer"
									color="secondary"
									size="small"
									className="mt-2"
								/>
							</CardContent>
						</Card>
					</motion.div>
				)} */}

				{Object.entries(llmResults).map(([llm, result], index) => (
					<motion.div
						key={llm}
						initial={{ x: -50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: index * 0.2 }}
					>
						<Card elevation={3} className="mb-4 bg-yellow-500">
							<CardContent>
								<Box display="flex" alignItems="center" mb={2}>
									<Avatar
										className="bg-yellow-500 mr-2"
										sx={{ backgroundColor: "#eab308" }}
									>
										<SmartToyIcon />
									</Avatar>
									<Typography variant="h6">
										{llmApis[llm].name} Answer
									</Typography>
								</Box>
								<Typography
									variant="body1"
									className="font-bold"
									gutterBottom
								>
									Option {result.option}:{" "}
									{query.answer.options[result.option - 1]}
								</Typography>
								<Box display="flex" alignItems="center" mt={1}>
									{result.verdict === "right" ? (
										<CheckCircleIcon className="text-green-500 mr-2" />
									) : (
										<CancelIcon className="text-red-500 mr-2" />
									)}
									<Chip
										label={
											result.verdict === "right"
												? "Correct"
												: "Incorrect"
										}
										color={
											result.verdict === "right"
												? "success"
												: "error"
										}
										size="small"
									/>
								</Box>
							</CardContent>
						</Card>
					</motion.div>
				))}

				{showLoginPrompt && (
					<motion.div
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						{isAuthenticated ? (
							<SaveQuery
								onSave={handleSave}
								onDiscard={setOpen}
							/>
						) : (
							<LoginPrompt onLogin={handleLogin} />
						)}
					</motion.div>
				)}
			</motion.div>
		</Box>
	);
}
