import React, { useEffect } from "react";
import {
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Grid,
	Card,
	CardContent,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const MCQAnswer = ({ answer }) => (
	<Box sx={{ mb: 2 }}>
		<Typography variant="h6" gutterBottom>
			Options:
		</Typography>
		<Grid container spacing={2} className="mt-2">
			{answer.options.map((option, index) => (
				<Grid item xs={12} sm={6} key={index}>
					<Card variant="outlined" className="bg-white h-full">
						<CardContent className="h-full">
							<Typography variant="body2">
								Option {index + 1}: {option}
								{index === answer.correct && (
									<CheckCircle
										className="text-green-500 ml-2"
										fontSize="small"
									/>
								)}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	</Box>
);

const ShortAnswer = ({ answer }) => (
	<Box sx={{ mb: 2 }}>
		<Typography variant="h6" gutterBottom>
			Correct Answer:
		</Typography>
		<Card variant="outlined" className="bg-white h-full">
			<CardContent className="h-full">
				<Typography variant="body2">{answer.correct}</Typography>
			</CardContent>
		</Card>
	</Box>
);

// Answer type strategy
const answerTypes = {
	mcq: MCQAnswer,
	short: ShortAnswer,
};
export default function OptionsPreview({ answer }) {
	const AnswerComponent =
		answerTypes[answer.type] || (() => <div>Unsupported answer type</div>);
	return <AnswerComponent answer={answer} />;
}
