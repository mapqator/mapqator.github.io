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
import categories from "@/database/categories.json";

import { Clear, Save, WindowSharp } from "@mui/icons-material";
import { getUserName } from "@/api/base";
import { showToast } from "@/app/console/home";
const queryApi = new QueryApi();

export default function QuestionForm() {
	const { query, setQuery, initQuery, queries, setQueries } =
		useContext(GlobalContext);
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
		const tmpQuery = query;
		const prevQueries = [...queries];
		setQuery(initQuery);

		if (tmpQuery.id === undefined) {
			const newQueries = [...queries];
			newQueries.unshift({ ...tmpQuery, id: 0, username: getUserName() });
			setQueries(newQueries);

			const res = await queryApi.createQuery(tmpQuery);
			if (res.success) {
				// update the queries
				// showSuccess("Query saved successfully", res);
				setQueries((prev) =>
					prev.map((q) => (q.id === 0 ? res.data[0] : q))
				);
			} else {
				// showToast("Can't save this query", "error");
				showToast("Can't save this query", "error");
				setQuery(tmpQuery);
				setQueries(prevQueries);
				window.scrollTo(0, 0);
			}
		} else {
			setQueries((prev) =>
				prev.map((q) => (q.id === tmpQuery.id ? tmpQuery : q))
			);

			const res = await queryApi.updateQuery(tmpQuery.id, tmpQuery);
			if (res.success) {
				setQueries((prev) =>
					prev.map((q) => (q.id === res.data[0].id ? res.data[0] : q))
				);
				// update the queries
				// showSuccess("Query edited successfully", res);
			} else {
				showToast("Can't update this query", "error");
				setQuery(tmpQuery);
				setQueries(prevQueries);
				window.scrollTo(0, 0);
			}
		}

		console.log("Here comes reset");
	};
	return (
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
										<DeleteIcon color="error" />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</Box>
			))}
			<Button startIcon={<AddIcon />} onClick={addOption} sx={{ mb: 2 }}>
				Add Option
			</Button>

			<Typography variant="h6" sx={{ mt: 2 }}>
				Correct Answer:
			</Typography>
			<FormControl component="fieldset" sx={{ display: "block", mb: 2 }}>
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
	);
}
