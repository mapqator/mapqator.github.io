import { Typography } from "@mui/material";
import DatasetSummary from "@/components/Tables/DatasetSummary";
import EvaluationSummary from "@/components/Tables/EvaluationSummary";

export default function EvaluationResultsPage() {
	return (
		<>
			<h1 className="text-3xl md:text-4xl font-normal pb-5">
				LLM Evaluation Results
			</h1>
			<DatasetSummary />
			<EvaluationSummary />
		</>
	);
}
