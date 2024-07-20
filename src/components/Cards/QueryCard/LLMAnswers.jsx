import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Paper,
	Chip,
} from "@mui/material";

export default function LLMAnswers({ evaluation }) {
	return (
		<>
			{evaluation?.length > 0 && (
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						LLM Answers:
					</Typography>
					<TableContainer component={Paper}>
						<Table size="small">
							<TableHead>
								<TableRow
									sx={{
										fontWeight: "bold",
										backgroundColor: "black",
										color: "white",
									}}
								>
									<TableCell
										sx={{
											width: "30%",
											fontWeight: "bold",
											color: "white",
										}}
									>
										Model
									</TableCell>
									<TableCell
										align="center"
										sx={{
											width: "60%",
											fontWeight: "bold",
											color: "white",
										}}
									>
										Answer
									</TableCell>
									<TableCell
										align="center"
										sx={{
											width: "10%",
											fontWeight: "bold",
											color: "white",
										}}
									>
										Correct?
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{evaluation.map((llmAnswer, index) => (
									<TableRow key={index}>
										<TableCell>{llmAnswer.model}</TableCell>
										<TableCell align="center">
											{llmAnswer.answer}
										</TableCell>
										<TableCell align="center">
											{llmAnswer.verdict === "right" ? (
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
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			)}
		</>
	);
}
