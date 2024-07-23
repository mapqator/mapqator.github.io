"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function OptionsEditor() {
	const { query, setQuery } = useContext(GlobalContext);
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
		<FormControl component="fieldset" fullWidth>
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
			<Box>
				<Button
					startIcon={<AddIcon />}
					onClick={addOption}
					sx={{ mb: 2 }}
				>
					Add Option
				</Button>
			</Box>
		</FormControl>
	);
}
