"use client";
import { useState, useEffect } from "react";
import {
	Container,
	Typography,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Mock data - replace this with actual data fetching logic
const mockDataset = [
	{
		id: 1,
		context:
			"Paris, the capital of France, is known for its iconic Eiffel Tower, which stands at 324 meters tall. The city is also home to world-renowned museums like the Louvre, which houses the Mona Lisa.",
		question: "What is the height of the Eiffel Tower?",
		options: ["300 meters", "324 meters", "350 meters", "400 meters"],
		correctAnswer: "324 meters",
		category: "Landmarks",
	},
	{
		id: 2,
		context:
			"The Amazon rainforest, spanning across several South American countries, is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and is home to an estimated 390 billion individual trees.",
		question:
			"Approximately how many individual trees are estimated to be in the Amazon rainforest?",
		options: ["100 billion", "250 billion", "390 billion", "500 billion"],
		correctAnswer: "390 billion",
		category: "Geography",
	},
	// Add more mock data as needed
];

export default function DatasetPage() {
	const [dataset, setDataset] = useState([]);
	const [filteredDataset, setFilteredDataset] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [datasetSummary, setDatasetSummary] = useState({});

	useEffect(() => {
		// In a real application, you would fetch data here
		setDataset(mockDataset);
		setFilteredDataset(mockDataset);
		// Calculate dataset summary
		const summary = {
			totalQuestions: mockDataset.length,
			validQuestions: mockDataset.filter(
				(item) =>
					item.context &&
					item.question &&
					item.options &&
					item.correctAnswer
			).length,
			questionsWithoutContext: mockDataset.filter((item) => !item.context)
				.length,
			questionsWithoutCorrectAnswer: mockDataset.filter(
				(item) => !item.correctAnswer
			).length,
			invalidQuestions: mockDataset.filter(
				(item) =>
					!item.context ||
					!item.question ||
					!item.options ||
					!item.correctAnswer
			).length,
		};
		setDatasetSummary(summary);
	}, []);

	const categories = [
		"All",
		...new Set(dataset.map((item) => item.category)),
	];

	const handleCategoryChange = (event) => {
		const category = event.target.value;
		setSelectedCategory(category);
		if (category === "All") {
			setFilteredDataset(dataset);
		} else {
			setFilteredDataset(
				dataset.filter((item) => item.category === category)
			);
		}
	};

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Dataset Overview
			</Typography>
			<TableContainer component={Paper} sx={{ mb: 4 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Dataset Summary</TableCell>
							<TableCell align="right">Count</TableCell>
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
							<TableCell>Valid Questions</TableCell>
							<TableCell align="right">
								{datasetSummary.validQuestions}
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
							<TableCell>Invalid Questions</TableCell>
							<TableCell align="right">
								{datasetSummary.invalidQuestions}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>

			<Box sx={{ mb: 3 }}>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id="category-select-label">
						Filter by Category
					</InputLabel>
					<Select
						labelId="category-select-label"
						id="category-select"
						value={selectedCategory}
						label="Filter by Category"
						onChange={handleCategoryChange}
					>
						{categories.map((category) => (
							<MenuItem key={category} value={category}>
								{category}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{filteredDataset.map((entry) => (
				<Accordion key={entry.id} sx={{ mb: 2 }}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={`panel${entry.id}-content`}
						id={`panel${entry.id}-header`}
					>
						<Typography sx={{ width: "33%", flexShrink: 0 }}>
							Question {entry.id}
						</Typography>
						<Typography sx={{ color: "text.secondary" }}>
							{entry.question}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Context:
							</Typography>
							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								<Typography variant="body2">
									{entry.context}
								</Typography>
							</Paper>
						</Box>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Options:
							</Typography>
							<List dense>
								{entry.options.map((option, index) => (
									<ListItem key={index}>
										<ListItemText
											primary={option}
											sx={{
												"& .MuiListItemText-primary": {
													fontWeight:
														option ===
														entry.correctAnswer
															? "bold"
															: "normal",
													color:
														option ===
														entry.correctAnswer
															? "success.main"
															: "inherit",
												},
											}}
										/>
										{option === entry.correctAnswer && (
											<Chip
												label="Correct"
												color="success"
												size="small"
											/>
										)}
									</ListItem>
								))}
							</List>
						</Box>
						<Box>
							<Chip label={entry.category} color="primary" />
						</Box>
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
}
