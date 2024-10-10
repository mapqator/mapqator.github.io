import React, { useContext } from "react";
import {
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	TextField,
	Box,
	Select,
	MenuItem,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";

const MCQAnswer = ({ value, options, onChange }) => (
	<RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
		<FormControlLabel
			key={-1}
			value={-1}
			control={<Radio />}
			label="None"
		/>
		{options.map((option, index) => (
			<FormControlLabel
				key={index}
				value={index}
				control={<Radio />}
				label={`Option ${index + 1}`}
			/>
		))}
	</RadioGroup>
);

const ShortAnswer = ({ value, onChange }) => (
	<TextField
		fullWidth
		variant="outlined"
		value={value || ""}
		onChange={(e) => onChange(e.target.value)}
		placeholder="Enter the correct answer"
		sx={{ mt: 1 }}
		multiline
	/>
);

// Answer type strategy
const answerTypes = {
	mcq: MCQAnswer,
	short: ShortAnswer,
};

const getDefaultValue = (type) => {
	switch (type) {
		case "mcq":
			return -1;
		case "short":
			return "";
		default:
			return null;
	}
};

export default function CorrectAnswerEditor({ index }) {
	const { query, setQuery } = useContext(GlobalContext);

	const AnswerComponent =
		answerTypes[query.questions[index].answer.type] ||
		(() => <div>Unsupported answer type</div>);

	const handleChange = (newValue) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].answer.correct = newValue;
			return newQuery;
		});
	};

	const handleTypeChange = (newType) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			newQuery.questions[index].answer.type = newType;
			newQuery.questions[index].answer.correct = getDefaultValue(newType);
			return newQuery;
		});
	};

	return (
		<FormControl component="fieldset" sx={{ display: "block", mb: 2 }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					mb: 2,
					justifyContent: "space-between",
				}}
			>
				<Typography variant="h6" sx={{ mr: 2 }}>
					Correct Answer:
				</Typography>
				<Select
					value={query.questions[index].answer.type}
					onChange={(e) => handleTypeChange(e.target.value)}
					sx={{ minWidth: 200 }}
					size="small"
				>
					<MenuItem value="mcq">Multiple Choice</MenuItem>
					<MenuItem value="short">Short Answer</MenuItem>
				</Select>
			</Box>

			{/* <Typography variant="h6" sx={{ mt: 2 }}>
				Correct Answer:
			</Typography> */}
			<AnswerComponent
				value={query.questions[index].answer.correct}
				options={query.questions[index].answer.options}
				onChange={handleChange}
			/>
		</FormControl>
	);
}
