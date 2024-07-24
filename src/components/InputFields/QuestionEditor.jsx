import React, { useContext } from "react";
import { Typography, TextField, FormControl } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function QuestionEditor() {
	const { query, setQuery } = useContext(GlobalContext);
	return (
		<FormControl fullWidth>
			<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
				Question:
			</Typography>
			<TextField
				fullWidth
				placeholder="Write a question based on context..."
				// label="Question"
				value={query.question}
				onChange={(e) =>
					setQuery((prev) => ({
						...prev,
						question: e.target.value,
					}))
				}
				multiline
				required
				minRows={4}
			/>
		</FormControl>
	);
}
