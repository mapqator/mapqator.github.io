"use client";
import { useState, useEffect, useContext } from "react";
import {
	Container,
	Typography,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";

// Mock evaluation data - replace with actual data
const mockEvaluationResults = [
	{
		model: "Phi-3",
		accuracy: 0.85,
		f1Score: 0.83,
		precision: 0.86,
		recall: 0.8,
		exampleResults: [
			{ questionId: 1, correctAnswer: true, modelAnswer: "324 meters" },
			{ questionId: 2, correctAnswer: false, modelAnswer: "250 billion" },
		],
	},
	{
		model: "Mistral",
		accuracy: 0.88,
		f1Score: 0.87,
		precision: 0.89,
		recall: 0.85,
		exampleResults: [
			{ questionId: 1, correctAnswer: true, modelAnswer: "324 meters" },
			{ questionId: 2, correctAnswer: true, modelAnswer: "390 billion" },
		],
	},
	{
		model: "Qwen2",
		accuracy: 0.82,
		f1Score: 0.81,
		precision: 0.83,
		recall: 0.79,
		exampleResults: [
			{ questionId: 1, correctAnswer: false, modelAnswer: "300 meters" },
			{ questionId: 2, correctAnswer: true, modelAnswer: "390 billion" },
		],
	},
];

export default function EvaluationResultsPage() {
	const [evaluationResults, setEvaluationResults] = useState([]);

	useEffect(() => {
		// In a real application, you would fetch evaluation results here
		setEvaluationResults(mockEvaluationResults);
	}, []);

	const [datasetSummary, setDatasetSummary] = useState({});
	const { queries, setQueries } = useContext(GlobalContext);

	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				valid_questions++;

				query.evaluation?.forEach((e) => {
					if (!tmp[e.model]) {
						tmp[e.model] = {
							correct: 0,
							invalid: 0,
							accuracy: 0,
							wrong: 0,
						};
					}
					if (e.verdict === "right") {
						tmp[e.model] = {
							...tmp[e.model],
							correct: tmp[e.model]?.correct
								? tmp[e.model].correct + 1
								: 1,
						};
					} else if (e.verdict == "invalid") {
						console.log("Invalid question");
						tmp[e.model] = {
							...tmp[e.model],
							invalid: tmp[e.model]?.invalid
								? tmp[e.model].invalid + 1
								: 1,
						};
					} else {
						tmp[e.model] = {
							...tmp[e.model],
							wrong: tmp[e.model]?.wrong
								? tmp[e.model].wrong + 1
								: 1,
						};
					}
					console.log(query.id, tmp[e.model], e.model);
					tmp[e.model].accuracy =
						(tmp[e.model].correct * 100.0) / valid_questions;
				});
			}
		});
		setEvaluationResults(tmp);
		// console.log(result);
	}, [queries]);

	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		let total_questions = 0;
		let questions_without_context = 0;
		let questions_with_answer = 0;

		queries.forEach((query) => {
			total_questions++;
			if (query.context === "") {
				questions_without_context++;
			}
			if (query.answer.correct !== -1) {
				questions_with_answer++;
			}
			if (query.context !== "" && query.answer.correct !== -1) {
				const invalid = query.evaluation?.find(
					(e) =>
						e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
						e.verdict === "invalid"
				);
				if (!invalid) valid_questions++;
			}
		});
		tmp["totalQuestions"] = total_questions;
		tmp["questionsWithoutContext"] = questions_without_context;
		tmp["questionsWithoutCorrectAnswer"] =
			total_questions - questions_with_answer;
		tmp["validQuestions"] = valid_questions;
		setDatasetSummary(tmp);
	}, [queries]);

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				LLM Evaluation Results
			</Typography>
			<TableContainer component={Paper} sx={{ mb: 4 }}>
				<Table>
					<TableHead>
						<TableRow
							sx={{
								fontWeight: "bold",
								backgroundColor: "black",
								color: "white",
							}}
						>
							<TableCell
								sx={{ fontWeight: "bold", color: "white" }}
							>
								{" "}
								Dataset Summary
							</TableCell>
							<TableCell
								align="right"
								sx={{ fontWeight: "bold", color: "white" }}
							>
								Count
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell>Total Questions</TableCell>
							<TableCell align="right">
								{datasetSummary.totalQuestions}
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>Questions Without Context</TableCell>
							<TableCell align="right">
								{datasetSummary.questionsWithoutContext}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								Questions Without Correct Answer
							</TableCell>
							<TableCell align="right">
								{datasetSummary.questionsWithoutCorrectAnswer}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Valid Questions</TableCell>
							<TableCell align="right">
								{datasetSummary.validQuestions}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
			<TableContainer component={Paper} sx={{ mb: 4 }}>
				<Table>
					<TableHead>
						<TableRow
							sx={{
								fontWeight: "bold",
								backgroundColor: "black",
								color: "white",
							}}
						>
							<TableCell
								component="th"
								scope="row"
								sx={{ fontWeight: "bold", color: "white" }}
							>
								Model
							</TableCell>
							<TableCell
								align="center"
								sx={{ fontWeight: "bold", color: "white" }}
							>
								Accuracy
							</TableCell>
							<TableCell
								align="center"
								sx={{ fontWeight: "bold", color: "white" }}
							>
								Correct
							</TableCell>
							<TableCell
								align="center"
								sx={{ fontWeight: "bold", color: "white" }}
							>
								Wrong
							</TableCell>
							<TableCell
								align="center"
								sx={{ fontWeight: "bold", color: "white" }}
							>
								No Answer
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(evaluationResults).map((model) => (
							<TableRow key={model}>
								<TableCell component="th" scope="row">
									{model}
								</TableCell>
								<TableCell align="center">
									{parseFloat(
										evaluationResults[model].accuracy
									).toFixed(2)}{" "}
									%
								</TableCell>
								<TableCell
									align="center"
									sx={{ color: "#22c55e" }}
								>
									{evaluationResults[model].correct}
								</TableCell>
								<TableCell
									align="center"
									sx={{ color: "#ef4444" }}
								>
									{evaluationResults[model].wrong}
								</TableCell>
								<TableCell align="center">
									{evaluationResults[model].invalid}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* <Typography variant="h5" gutterBottom>
				Example Results
			</Typography> */}

			{/* {evaluationResults.map((result) => (
				<Accordion key={result.model} sx={{ mb: 2 }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography>{result.model} Example Results</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{result.exampleResults.map((example) => (
							<Box key={example.questionId} sx={{ mb: 2 }}>
								<Typography variant="subtitle1">
									Question {example.questionId}
								</Typography>
								<Typography>
									Model Answer: {example.modelAnswer}
								</Typography>
								<Chip
									label={
										example.correctAnswer
											? "Correct"
											: "Incorrect"
									}
									color={
										example.correctAnswer
											? "success"
											: "error"
									}
									size="small"
									sx={{ mt: 1 }}
								/>
							</Box>
						))}
					</AccordionDetails>
				</Accordion>
			))} */}
		</>
	);
}
