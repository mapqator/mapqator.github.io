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
} from "@mui/material";
import ContextPreview from "@/components/Cards/ContextPreview";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import DescriptionIcon from "@mui/icons-material/Description";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const llmApis = {
	gpt4: gptApi.askGPTLive,
	gpt3: gptApi.askGPTLive,
	// Add more LLMs here
};

export default function LiveEvaluation() {
	const { query, context } = useContext(GlobalContext);
	const [stage, setStage] = useState(0);
	const [llmResults, setLlmResults] = useState({});
	const [isProcessing, setIsProcessing] = useState(false);

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

	const evaluateLLM = async (llmName, llmFunction) => {
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
				[llmName]: { option, explanation, verdict },
			}));
		}
	};

	useEffect(() => {
		const runEvaluation = async () => {
			setStage(0);
			setLlmResults({});
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setStage(1);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setStage(2);
			setIsProcessing(true);
			const evaluationPromises = Object.entries(llmApis).map(
				([name, func]) => evaluateLLM(name, func)
			);
			await Promise.all(evaluationPromises);
			setIsProcessing(false);
			setStage(3);
		};

		runEvaluation();
	}, [query, context]);

	return (
		<Box className="h-full flex flex-col justify-center p-4 w-full pt-10">
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
						<Box display="flex" alignItems="center" mb={2}>
							<Avatar className="bg-blue-500 mr-2">
								<DescriptionIcon />
							</Avatar>
							<Typography variant="h6">Context</Typography>
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
							<Box display="flex" alignItems="center" mb={2}>
								<Avatar className="bg-green-500 mr-2">
									<QuestionMarkIcon />
								</Avatar>
								<Typography variant="h6">Question</Typography>
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

				{stage >= 3 && (
					<motion.div
						initial={{ x: -50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Card elevation={3} className="mb-4 bg-purple-50">
							<CardContent>
								<Box display="flex" alignItems="center" mb={2}>
									<Avatar className="bg-purple-500 mr-2">
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
				)}

				{Object.entries(llmResults).map(([llmName, result], index) => (
					<motion.div
						key={llmName}
						initial={{ x: -50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: index * 0.2 }}
					>
						<Card elevation={3} className="mb-4 bg-yellow-50">
							<CardContent>
								<Box display="flex" alignItems="center" mb={2}>
									<Avatar className="bg-yellow-500 mr-2">
										<SmartToyIcon />
									</Avatar>
									<Typography variant="h6">
										{llmName} Answer
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
			</motion.div>
		</Box>
	);
}
