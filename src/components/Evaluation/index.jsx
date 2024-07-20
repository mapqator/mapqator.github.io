"use client";
import { Typography } from "@mui/material";
import DatasetSummary from "./DatasetSummary";
import EvaluationSummary from "./EvaluationSummary";

export default function EvaluationResultsPage() {
	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				LLM Evaluation Results
			</Typography>
			<DatasetSummary />
			<EvaluationSummary />
		</>
	);
}
