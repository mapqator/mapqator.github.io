"use client";
import { Typography } from "@mui/material";
import DatasetSummary from "@/components/Tables/DatasetSummary";
import EvaluationSummary from "@/components/Tables/EvaluationSummary";

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
