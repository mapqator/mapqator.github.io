export default function LLMAnswers({ state }) {
	return (
		<>
			{state.evaluation.length > 0 && (
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						LLM Answers:
					</Typography>
					<TableContainer component={Paper}>
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell sx={{ width: "30%" }}>
										Model
									</TableCell>
									<TableCell
										align="center"
										sx={{ width: "60%" }}
									>
										Answer
									</TableCell>
									<TableCell
										align="center"
										sx={{ width: "10%" }}
									>
										Correct?
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{state.evaluation.map((llmAnswer, index) => (
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
