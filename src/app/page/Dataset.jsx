import React from "react";
import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import { Box } from "@mui/material";

export default function DatasetPage({ onEdit }) {
	return (
		<Box sx={{ mt: 4, mb: 4 }}>
			<QuestionsContainer title="QnA Dataset Overview" onEdit={onEdit} />
		</Box>
	);
}
