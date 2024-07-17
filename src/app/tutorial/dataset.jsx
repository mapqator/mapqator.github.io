"use client";
import React, { useState, useEffect, useContext } from "react";
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
	Button,
	Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
const queryApi = new QueryApi();
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
		llmAnswers: [
			{ llm: "Phi-3", answer: "324 meters" },
			{ llm: "Mistral", answer: "324 meters" },
			{ llm: "Qwen2", answer: "300 meters" },
		],
	},
	{
		id: 2,
		context:
			"The Amazon rainforest, spanning across several South American countries, is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and is home to an estimated 390 billion individual trees.The Amazon rainforest, spanning across several South American countries, is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and is home to an estimated 390 billion individual trees.The Amazon rainforest, spanning across several South American countries, is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and is home to an estimated 390 billion individual trees.The Amazon rainforest, spanning across several South American countries, is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and is home to an estimated 390 billion individual trees.The Amazon rainforest, spanning across several South American countries, is the world's largest tropical rainforest. It covers approximately 5.5 million square kilometers and is home to an estimated 390 billion individual trees.",
		question:
			"Approximately how many individual trees are estimated to be in the Amazon rainforest?",
		options: ["100 billion", "250 billion", "390 billion", "500 billion"],
		correctAnswer: "390 billion",
		category: "Geography",
		llmAnswers: [
			{ llm: "Phi-3", answer: "324 meters" },
			{ llm: "Mistral", answer: "324 meters" },
			{ llm: "Qwen2", answer: "300 meters" },
		],
	},
	// Add more mock data as needed
];

export default function DatasetPage() {
	const [dataset, setDataset] = useState([]);
	const { queries, setQueries } = useContext(GlobalContext);
	const [filteredQueries, setFilteredQueries] = useState([]);
	const [filteredDataset, setFilteredDataset] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [datasetSummary, setDatasetSummary] = useState({});

	const [expanded, setExpanded] = useState({});

	const toggleExpanded = (id) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) return text;
		return text.substr(0, maxLength) + "...";
	};

	// useEffect(() => {
	// 	// In a real application, you would fetch data here
	// 	setDataset(mockDataset);
	// 	setFilteredDataset(mockDataset);
	// 	// Calculate dataset summary
	// 	const summary = {
	// 		totalQuestions: mockDataset.length,
	// 		validQuestions: mockDataset.filter(
	// 			(item) =>
	// 				item.context &&
	// 				item.question &&
	// 				item.options &&
	// 				item.correctAnswer
	// 		).length,
	// 		questionsWithoutContext: mockDataset.filter((item) => !item.context)
	// 			.length,
	// 		questionsWithoutCorrectAnswer: mockDataset.filter(
	// 			(item) => !item.correctAnswer
	// 		).length,
	// 		invalidQuestions: mockDataset.filter(
	// 			(item) =>
	// 				!item.context ||
	// 				!item.question ||
	// 				!item.options ||
	// 				!item.correctAnswer
	// 		).length,
	// 	};
	// 	setDatasetSummary(summary);
	// }, []);

	useEffect(() => {
		setFilteredQueries(queries);
	}, []);

	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		let total_questions = 0;
		let questions_without_context = 0;
		let questions_with_answer = 0;

		queries.forEach((query) => {
			total_questions++;
			if (query.context === "") {
				questions_without_context++;
			}
			if (query.answer.correct !== -1) {
				questions_with_answer++;
			}
			if (query.context !== "" && query.answer.correct !== -1) {
				const invalid = query.evaluation?.find(
					(e) =>
						e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
						e.verdict === "invalid"
				);
				if (!invalid) valid_questions++;
			}
		});
		tmp["totalQuestions"] = total_questions;
		tmp["questionsWithoutContext"] = questions_without_context;
		tmp["questionsWithoutCorrectAnswer"] =
			total_questions - questions_with_answer;
		tmp["validQuestions"] = valid_questions;
		setDatasetSummary(tmp);
	}, [queries]);

	const categories = [
		"All",
		...[
			"nearby_poi",
			"planning",
			"time_calculation",
			"routing",
			"location_finding",
			"opinion",
			"navigation",
		],
	];

	const handleCategoryChange = (event) => {
		const category = event.target.value;
		setSelectedCategory(category);
		if (category === "All") {
			setFilteredQueries(queries);
		} else {
			setFilteredQueries(
				queries.filter((item) => item.classification.includes(category))
			);
		}
	};

	return (
		<>
			<div className="flex flex-row justify-between items-center">
				<Typography variant="h4" gutterBottom component="h1">
					Dataset Overview
				</Typography>
				<Box sx={{ mb: 3 }}>
					<FormControl sx={{ minWidth: 200 }} size="small">
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
			</div>

			{/* <TableContainer component={Paper} sx={{ mb: 4 }}>
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
							<TableCell>Valid Questions</TableCell>
							<TableCell align="right">
								{datasetSummary.validQuestions}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer> */}

			{filteredQueries.map((entry) => (
				<Accordion key={entry.id} sx={{ mb: 2 }}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={`panel${entry.id}-content`}
						id={`panel${entry.id}-header`}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								width: "100%",
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									width: "99%",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "flex-start",
										width: "50%",
									}}
								>
									<Typography sx={{ width: "40%" }}>
										Question #{entry.id}
									</Typography>
									<Box>
										<Chip
											label={entry.classification}
											color="primary"
										/>
									</Box>
								</Box>

								{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Category: {entry.classification}
								</Typography> */}
								{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Author: {entry.username || "Unknown"}
								</Typography> */}
								<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
									<FontAwesomeIcon icon={faUser} />
									{entry.username}
								</h2>
							</Box>
							<Typography sx={{ color: "text.primary", mt: 1 }}>
								{entry.question}
							</Typography>
						</Box>
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
								{entry.context.split("\n").map(
									(line, index) =>
										(expanded[entry.id] || index < 5) && (
											<React.Fragment key={index}>
												{/* {line} */}
												<p
													key={index}
													className="w-full text-left"
													dangerouslySetInnerHTML={{
														__html: line,
													}}
												/>
												{/* <br /> */}
											</React.Fragment>
										)
								)}
								{/* <Typography variant="body2">
									{
										expanded[entry.id]
											? entry.context
											: truncateText(entry.context, 200) // Adjust 200 to your preferred initial length
									}
								</Typography> */}
								{/* <Collapse
									in={expanded[entry.id]}
									collapsedSize={100}
								>
									<Typography variant="body2">
										{entry.context}
									</Typography>
								</Collapse> */}
								<Button
									onClick={() => toggleExpanded(entry.id)}
									sx={{ mt: 1, textTransform: "none" }}
								>
									{expanded[entry.id]
										? "Show Less"
										: "Read More"}
								</Button>
							</Paper>
						</Box>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Options:
							</Typography>
							<List dense>
								{entry.answer.options.map(
									(option, index) =>
										option !== "" && (
											<ListItem key={index}>
												<ListItemText
													primary={
														"Option " +
														(index + 1) +
														": " +
														option
													}
													sx={{
														"& .MuiListItemText-primary":
															{
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
												{index ===
													entry.answer.correct && (
													<Chip
														label="Correct"
														color="success"
														size="small"
													/>
												)}
											</ListItem>
										)
								)}
							</List>
						</Box>
						{entry.evaluation.length > 0 && (
							<Box sx={{ mb: 2 }}>
								<Typography variant="h6" gutterBottom>
									LLM Answers:
								</Typography>
								<TableContainer component={Paper}>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell>Model</TableCell>
												<TableCell align="center">
													Answer
												</TableCell>
												<TableCell align="center">
													Correct?
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{entry.evaluation.map(
												(llmAnswer, index) => (
													<TableRow key={index}>
														<TableCell>
															{llmAnswer.model}
														</TableCell>
														<TableCell align="center">
															{llmAnswer.answer}
														</TableCell>
														<TableCell align="center">
															{llmAnswer.verdict ===
															"right" ? (
																<Chip
																	label="Correct"
																	color="success"
																	size="small"
																/>
															) : (
																<Chip
																	label="Incorrect"
																	color="error"
																	size="small"
																/>
															)}
														</TableCell>
													</TableRow>
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						)}

						{/* <Box>
							<Chip
								label={entry.classification}
								color="primary"
							/>
						</Box> */}
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
}
