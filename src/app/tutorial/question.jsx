"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Select,
	MenuItem,
	IconButton,
	Paper,
	OutlinedInput,
	InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
const queryApi = new QueryApi();

export default function QuestionCreationPage({ handleContextEdit }) {
	const { context, contextJSON, query, setQuery, queries, setQueries } =
		useContext(GlobalContext);
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [category, setCategory] = useState("");
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		console.log("Context updated", context);
		setQuery((prev) => ({
			...prev,
			context: context.reduce((acc, e) => acc + e + "\n", ""),
			context_json: contextJSON,
		}));
	}, [context]);
	// Assume this context is passed from the previous page
	// const context = "This is the generated context based on the map data...";

	const handleOptionChange = (index, value) => {
		setQuery((prev) => {
			const options = [...prev.answer.options];
			options[index] = value;
			return {
				...prev,
				answer: {
					...prev.answer,
					options,
				},
			};
		});
	};

	const addOption = () => {
		setQuery((prev) => ({
			...prev,
			answer: {
				...prev.answer,
				options: [...prev.answer.options, ""],
			},
		}));
	};

	const removeOption = (index) => {
		setQuery((prev) => {
			const options = [...prev.answer.options];
			options.splice(index, 1);
			return {
				...prev,
				answer: {
					...prev.answer,
					options,
				},
			};
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (query.id === undefined) {
			const res = await queryApi.createQuery(query);
			if (res.success) {
				// update the queries
				const newQueries = [...queries];
				// push front
				newQueries.unshift(res.data[0]);
				setQueries(newQueries);
				// showSuccess("Query saved successfully", res);
			} else {
				// showToast("Can't save this query", "error");
			}
		} else {
			const res = await queryApi.updateQuery(query.id, query);
			if (res.success) {
				// update the queries
				setQueries((prevQueries) =>
					prevQueries.map((q) =>
						q.id === res.data[0].id ? res.data[0] : q
					)
				);
				// showSuccess("Query edited successfully", res);
			}
		}

		setQuery({
			question: "",
			answer: {
				type: "mcq",
				options: ["", "", "", ""],
				correct: -1,
			},
			context: "",
			context_json: {},
			context_gpt: "",
			classification: "",
		});
	};

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Create MCQ Question based on Context
			</Typography>
			<Paper elevation={3} sx={{ p: 3, mb: 4 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography variant="h6">Context:</Typography>
					<Button
						startIcon={<EditIcon />}
						onClick={handleContextEdit}
					>
						Edit Context
					</Button>
				</Box>
				<Box>
					{query.context.split("\n").map(
						(line, index) =>
							(expanded || index < 5) && (
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
					{query.context.split("\n").length > 5 && (
						<Button
							onClick={() => setExpanded((prev) => !prev)}
							sx={{ mt: 1, textTransform: "none" }}
						>
							{expanded ? "Show Less" : "Read More"}
						</Button>
					)}
				</Box>
			</Paper>
			<form onSubmit={handleSubmit}>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Question:
				</Typography>
				<TextField
					fullWidth
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
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Category:
				</Typography>
				<FormControl
					fullWidth
					variant="outlined"
					// size="small"
					sx={{ mb: 2 }}
				>
					{/* <FormLabel
						htmlFor="outlined-adornment"
						className="input-label"
					>
						Category
					</FormLabel> */}
					<Select
						multiple
						id="outlined-adornment"
						className="outlined-input"
						value={query.classification.split(",").filter(Boolean)}
						onChange={(e) => {
							setQuery((prev) => ({
								...prev,
								classification: e.target.value.join(","),
							}));
						}}
						// input={<OutlinedInput label={"Category"} />}
					>
						{[
							"nearby_poi",
							"planning",
							"time_calculation",
							"routing",
							"location_finding",
							"opinion",
							"navigation",
						].map((value, index) => (
							<MenuItem key={index} value={value}>
								{value}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Options:
				</Typography>
				{query.answer.options.map((option, index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							alignItems: "center",
							mb: 2,
						}}
					>
						<TextField
							fullWidth
							label={`Option ${index + 1}`}
							value={option}
							onChange={(e) =>
								handleOptionChange(index, e.target.value)
							}
							required
						/>
						<IconButton
							onClick={() => removeOption(index)}
							sx={{ ml: 1 }}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				))}
				<Button
					startIcon={<AddIcon />}
					onClick={addOption}
					sx={{ mb: 2 }}
				>
					Add Option
				</Button>

				<Typography variant="h6" sx={{ mt: 2 }}>
					Correct Answer:
				</Typography>
				<FormControl
					component="fieldset"
					sx={{ display: "block", mb: 2 }}
				>
					{/* <FormLabel component="legend">Correct Answer</FormLabel> */}
					<RadioGroup
						value={query.answer.correct}
						onChange={(e) =>
							setQuery((prev) => ({
								...prev,
								answer: {
									...prev.answer,
									correct: e.target.value,
								},
							}))
						}
					>
						{options.map((option, index) => (
							<FormControlLabel
								key={index}
								value={index}
								control={<Radio />}
								label={`Option ${index + 1}`}
							/>
						))}
					</RadioGroup>
				</FormControl>

				<Button type="submit" variant="contained" color="primary">
					Submit Question
				</Button>
			</form>
		</>
	);
}
