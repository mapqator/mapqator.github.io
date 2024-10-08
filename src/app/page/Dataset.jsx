import React from "react";
import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DatasetPage({}) {
	const router = useRouter();
	const onEdit = () => {
		router.push("/home/question");
	};
	return (
		<Box sx={{ mt: 4, mb: 4 }}>
			<QuestionsContainer title="QnA Dataset Overview" onEdit={onEdit} />
		</Box>
	);
}
