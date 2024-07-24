import React, { useContext } from "react";
import {
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function CorrectAnswerEditor() {
	const { query, setQuery } = useContext(GlobalContext);
	return (
		<FormControl component="fieldset" sx={{ display: "block", mb: 2 }}>
			<Typography variant="h6" sx={{ mt: 2 }}>
				Correct Answer:
			</Typography>
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
	);
}
