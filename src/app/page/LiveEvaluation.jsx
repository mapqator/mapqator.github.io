import gptApi from "@/api/gptApi";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import {
	Chip,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";

export default function LiveEvaluation() {
	const { query, context } = useContext(GlobalContext);
	const [gpt, setGpt] = useState({
		answer: null,
		verdict: null,
	});

	const extract = (s) => {
		for (let char of s) {
			if (/\d/.test(char)) {
				return char;
			}
		}
		return null;
	};

	const evaluateGPT = async () => {
		const res = await gptApi.askGPTLive(
			ContextGeneratorService.convertContextToText(context),
			query
		);
		if (res.success) {
			const option = extract(res.data);
			console.log(res.data);
			try {
				if (parseInt(option) - 1 === query.answer.correct) {
					setGpt({
						answer: option,
						verdict: "right",
					});
				} else if (parseInt(option) === 0) {
					setGpt({
						answer: res.data,
						verdict: "wrong",
					});
				} else {
					setGpt({
						answer: option,
						verdict: "wrong",
					});
				}
			} catch {
				// Invalid response
				setGpt({
					answer: res.data,
					verdict: "wrong",
				});
			}
		}
	};

	useEffect(() => {
		evaluateGPT();
	}, [query, context]);

	return (
		<div className="h-full flex md:items-center p-2 pt-5">
			<div className="flex flex-col items-center mx-auto">
				<TableContainer component={Paper}>
					<Table size="small">
						<TableHead>
							<TableRow
								sx={{
									fontWeight: "bold",
									color: "black",
								}}
								className="bg-gray-200"
							>
								<TableCell
									sx={{
										width: "30%",
										fontWeight: "bold",
									}}
								>
									Model
								</TableCell>
								<TableCell
									align="center"
									sx={{
										width: "60%",
										fontWeight: "bold",
									}}
								>
									Answer
								</TableCell>
								<TableCell
									align="center"
									sx={{
										width: "10%",
										fontWeight: "bold",
									}}
								>
									Correct?
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{[
								{
									model: "GPT 4",
									answer: gpt.answer,
									verdict: gpt.verdict,
								},
							].map((llmAnswer, index) => (
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
			</div>
		</div>
	);
}
