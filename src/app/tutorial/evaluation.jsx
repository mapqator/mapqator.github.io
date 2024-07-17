"use client";
import { useState, useEffect } from "react";
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

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				LLM Evaluation Results
			</Typography>

			<TableContainer component={Paper} sx={{ mb: 4 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Model</TableCell>
							<TableCell align="right">Accuracy</TableCell>
							<TableCell align="right">F1 Score</TableCell>
							<TableCell align="right">Precision</TableCell>
							<TableCell align="right">Recall</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{evaluationResults.map((result) => (
							<TableRow key={result.model}>
								<TableCell component="th" scope="row">
									{result.model}
								</TableCell>
								<TableCell align="right">
									{result.accuracy.toFixed(2)}
								</TableCell>
								<TableCell align="right">
									{result.f1Score.toFixed(2)}
								</TableCell>
								<TableCell align="right">
									{result.precision.toFixed(2)}
								</TableCell>
								<TableCell align="right">
									{result.recall.toFixed(2)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Typography variant="h5" gutterBottom>
				Example Results
			</Typography>

			{evaluationResults.map((result) => (
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
			))}
		</>
	);
}
