import React, { useContext } from "react";
import { Box, Button, Typography, TextField, Paper } from "@mui/material";
import { Send } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import CategorySelectionField from "../InputFields/CategorySelectionField";

const exampleQuestions = {
	poi: [
		"What is the name of the tallest building in New York City?",
		"How many restaurants are within a 1-mile radius of Central Park?",
		"What are the opening hours of the Louvre Museum in Paris?",
	],
	routing: [
		"What's the fastest route from Los Angeles to San Francisco?",
		"How long does it take to walk from the Eiffel Tower to the Arc de Triomphe?",
		"What's the most scenic drive between Seattle and Portland?",
	],
	trip: [
		"Plan a 3-day trip to Rome, including major attractions and restaurants.",
		"What's the best route for a road trip from New York to Miami, including notable stops?",
		"Create an itinerary for a day trip to London, covering key landmarks and lunch spots.",
	],
};

export default function QuestionForm({ handleSubmit }) {
	const { query, setQuery } = useContext(GlobalContext);

	const handleCategoryChange = (event) => {
		setQuery({ ...query, category: event.target.value, question: "" });
	};

	const handleQuestionChange = (event) => {
		setQuery({ ...query, question: event.target.value });
	};

	// const onSubmit = (e) => {
	// 	e.preventDefault();
	// 	handleSubmit(query);
	// 	setQuery({ ...query, question: "" });
	// };

	return (
		<Box
			sx={{ maxWidth: 600, margin: "auto", mt: 4 }}
			className="flex flex-col gap-4"
		>
			<CategorySelectionField
				value={query.classification}
				onChange={handleCategoryChange}
			/>

			{query.classification && (
				<Paper elevation={3} sx={{ p: 2, mt: 2, mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Example questions for {query.classification}:
					</Typography>
					<ul>
						{exampleQuestions[query.classification].map(
							(q, index) => (
								<li key={index}>{q}</li>
							)
						)}
					</ul>
				</Paper>
			)}

			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					multiline
					rows={3}
					variant="outlined"
					// label="Question"
					placeholder="Type your question here..."
					value={query.question}
					onChange={handleQuestionChange}
					sx={{ mb: 2 }}
				/>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					endIcon={<Send />}
					disabled={!query.question.trim()}
				>
					Submit Question
				</Button>
			</form>
		</Box>
	);
}
