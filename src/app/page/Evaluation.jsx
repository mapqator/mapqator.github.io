import { Box, Typography } from "@mui/material";
import DatasetSummary from "@/components/Tables/DatasetSummary";
import EvaluationSummary from "@/components/Tables/EvaluationSummary";

export default function EvaluationResultsPage() {
	return (
		<Box sx={{ mt: 4, mb: 4 }}>
			<h1 className="text-3xl md:text-4xl font-normal pb-5">
				Queries Evaluated by LLMs
			</h1>
			<DatasetSummary />
			<EvaluationSummary />
		</Box>
	);
}
