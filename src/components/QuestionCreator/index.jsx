"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Select,
	MenuItem,
	IconButton,
	Paper,
	InputAdornment,
	Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import MyQuestions from "./MyQuestions";
import categories from "@/database/categories.json";
import { jwtDecode } from "jwt-decode";
import { getTokenFromLocalStorage } from "@/api/base";
import { Clear, Save } from "@mui/icons-material";
const queryApi = new QueryApi();

export default function QuestionCreationPage({ handleContextEdit }) {
	const {
		context,
		query,
		setQuery,
		queries,
		setQueries,
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		currentInformation,
		poisMap,
		directionInformation,
		initQuery,
	} = useContext(GlobalContext);
	const [expanded, setExpanded] = useState(false);

	const getUserName = () => {
		const token = getTokenFromLocalStorage();
		if (!token) return "Anonymous";
		return jwtDecode(token).username;
	};
	useEffect(() => {
		setQuery((prev) => ({
			...prev,
			context: [
				...context.places,
				...context.nearby,
				...context.area,
				...context.distance,
				...context.direction,
				...context.params,
			].reduce((acc, e) => acc + e + "\n", ""),
			context_json: {
				distance_matrix: distanceMatrix,
				places: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				current_information: currentInformation,
				pois: poisMap,
				directions: directionInformation,
			},
		}));
	}, [context]);

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
		if (query.answer.correct === index) {
			setQuery((prev) => ({
				...prev,
				answer: {
					...prev.answer,
					correct: -1,
				},
			}));
		}
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
			const newQueries = [...queries];
			newQueries.unshift({ ...query, id: 0, username: getUserName() });
			setQueries(newQueries);

			const res = await queryApi.createQuery(query);
			if (res.success) {
				// update the queries
				// showSuccess("Query saved successfully", res);
			} else {
				// showToast("Can't save this query", "error");
			}
		} else {
			setQueries((prev) =>
				prev.map((q) => (q.id === query.id ? query : q))
			);

			const res = await queryApi.updateQuery(query.id, query);
			if (res.success) {
				// update the queries
				// showSuccess("Query edited successfully", res);
			}
		}

		console.log("Here comes reset");
		setQuery(initQuery);
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
									<p
										key={index}
										className="w-full text-left"
										dangerouslySetInnerHTML={{
											__html: line,
										}}
									/>
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
				<FormControl fullWidth variant="outlined">
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
					>
						{categories.map((value, index) => (
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
							autoComplete="off"
							label={`Option ${index + 1}`}
							value={option}
							onChange={(e) =>
								handleOptionChange(index, e.target.value)
							}
							required
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => removeOption(index)}
											sx={{ ml: 1 }}
										>
											<DeleteIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
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
					<RadioGroup
						value={query.answer.correct}
						onChange={(e) => {
							console.log(e.target.value, typeof e.target.value);
							setQuery((prev) => ({
								...prev,
								answer: {
									...prev.answer,
									correct: parseInt(e.target.value),
								},
							}));
						}}
					>
						<FormControlLabel
							key={-1}
							value={-1}
							control={<Radio />}
							label={`None`}
						/>
						{query.answer.options.map((option, index) => (
							<FormControlLabel
								key={index}
								value={index}
								control={<Radio />}
								label={`Option ${index + 1}`}
							/>
						))}
					</RadioGroup>
				</FormControl>

				<Box className="flex flex-row gap-4">
					<Button
						type="submit"
						variant="contained"
						color="primary"
						startIcon={<Save />}
					>
						{query.id === undefined
							? "Submit Question"
							: "Save #" + query.id}
					</Button>
					<Button
						onClick={() =>
							setQuery((prev) => ({
								...initQuery,
								context: prev.context,
								context_json: prev.context_json,
							}))
						}
						variant="outlined"
						size="small"
						startIcon={<Clear />}
						color="error"
					>
						Clear
					</Button>
				</Box>
			</form>

			{queries.length > 0 && (
				<>
					<Divider sx={{ my: 4 }} />
					<MyQuestions />
				</>
			)}
		</>
	);
}
