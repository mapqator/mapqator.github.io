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
	InputLabel,
	Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import categories from "@/database/categories.json";

import { Clear, Save, WindowSharp } from "@mui/icons-material";
import { getUserName } from "@/api/base";

import { LoadingButton } from "@mui/lab";
import { showError, showSuccess } from "@/app/page";
const queryApi = new QueryApi();

export default function QuestionForm({ handleSubmit, handleReset }) {
	const { query, setQuery } = useContext(GlobalContext);

	const [loading, setLoading] = useState(false);
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

	return (
		<form
			onSubmit={async (e) => {
				setLoading(true);
				await handleSubmit(e);
				setLoading(false);
			}}
		>
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
			{/* <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
				Category:
			</Typography> */}
			<FormControl
				variant="outlined"
				className="w-[20rem]"
				sx={{ mt: 2 }}
				size="small"
				required
			>
				<InputLabel>Category</InputLabel>
				<Select
					required
					multiple
					label={"Category"}
					placeholder="Choose a category of the question"
					id="outlined-adornment"
					className="outlined-input"
					value={query.classification.split(",").filter(Boolean)}
					onChange={(e) => {
						setQuery((prev) => ({
							...prev,
							classification: e.target.value.join(","),
						}));
					}}
					renderValue={(selected) => (
						<Box
							sx={{
								display: "flex",
								flexWrap: "wrap",
								gap: 0.5,
							}}
						>
							{selected.map((value) => (
								<Chip key={value} label={value} size="small" />
							))}
						</Box>
					)}
				>
					{categories.map((value, index) => (
						<MenuItem key={index} value={value}>
							{value}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
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
				<LoadingButton
					type="submit"
					variant="contained"
					color="primary"
					startIcon={<Save />}
					loading={loading}
					loadingPosition="start"
				>
					{query.id === undefined
						? "Submit Question"
						: "Save #" + query.id}
				</LoadingButton>
				<Button
					onClick={() => {
						handleReset();
						window.scrollTo(0, 0);
					}}
					// variant="outlined"
					// size="small"
					startIcon={<Clear />}
					color="error"
				>
					Clear
				</Button>
			</Box>
		</form>
	);
}
