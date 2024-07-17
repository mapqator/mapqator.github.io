"use client";
import { useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function QuestionCreationPage({ handleContextEdit }) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", "", "", ""]);
	const [correctAnswer, setCorrectAnswer] = useState("");
	const [category, setCategory] = useState("");

	// Assume this context is passed from the previous page
	const context = "This is the generated context based on the map data...";

	const handleOptionChange = (index, value) => {
		const newOptions = [...options];
		newOptions[index] = value;
		setOptions(newOptions);
	};

	const addOption = () => {
		setOptions([...options, ""]);
	};

	const removeOption = (index) => {
		const newOptions = options.filter((_, i) => i !== index);
		setOptions(newOptions);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		// Here you would typically send the question data to your backend
		console.log({ question, options, correctAnswer, category });
		// Reset form or navigate to next step
	};

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Create MCQ Question
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
				<Typography variant="body1">{context}</Typography>
			</Paper>
			<form onSubmit={handleSubmit}>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Question:
				</Typography>
				<TextField
					fullWidth
					label="Question"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					multiline
					required
				/>
				<Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
					Options:
				</Typography>
				{options.map((option, index) => (
					<Box
						key={index}
						sx={{ display: "flex", alignItems: "center", mb: 2 }}
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
				<FormControl
					component="fieldset"
					sx={{ display: "block", mb: 2 }}
				>
					<FormLabel component="legend">Correct Answer</FormLabel>
					<RadioGroup
						value={correctAnswer}
						onChange={(e) => setCorrectAnswer(e.target.value)}
					>
						{options.map((option, index) => (
							<FormControlLabel
								key={index}
								value={option}
								control={<Radio />}
								label={`Option ${index + 1}`}
							/>
						))}
					</RadioGroup>
				</FormControl>
				<FormControl fullWidth sx={{ mb: 2 }}>
					<FormLabel>Category</FormLabel>
					<Select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						required
					>
						<MenuItem value="geography">Geography</MenuItem>
						<MenuItem value="history">History</MenuItem>
						<MenuItem value="culture">Culture</MenuItem>
						<MenuItem value="landmarks">Landmarks</MenuItem>
						{/* Add more categories as needed */}
					</Select>
				</FormControl>
				<Button type="submit" variant="contained" color="primary">
					Submit Question
				</Button>
			</form>
		</>
	);
}
