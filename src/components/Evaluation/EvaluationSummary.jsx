"use client";
import { useState, useEffect, useContext } from "react";
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
export default function EvaluationSummary() {
	const [evaluationResults, setEvaluationResults] = useState({});
	const { queries } = useContext(GlobalContext);
	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				valid_questions++;

				query.evaluation?.forEach((e) => {
					if (!tmp[e.model]) {
						tmp[e.model] = {
							correct: 0,
							invalid: 0,
							accuracy: 0,
							wrong: 0,
						};
					}
					if (e.verdict === "right") {
						tmp[e.model] = {
							...tmp[e.model],
							correct: tmp[e.model]?.correct
								? tmp[e.model].correct + 1
								: 1,
						};
					} else if (e.verdict == "invalid") {
						console.log("Invalid question");
						tmp[e.model] = {
							...tmp[e.model],
							invalid: tmp[e.model]?.invalid
								? tmp[e.model].invalid + 1
								: 1,
						};
					} else {
						tmp[e.model] = {
							...tmp[e.model],
							wrong: tmp[e.model]?.wrong
								? tmp[e.model].wrong + 1
								: 1,
						};
					}
					console.log(query.id, tmp[e.model], e.model);
					tmp[e.model].accuracy =
						(tmp[e.model].correct * 100.0) / valid_questions;
				});
			}
		});
		setEvaluationResults(tmp);
		// console.log(result);
	}, [queries]);
	return (
		<TableContainer component={Paper} sx={{ mb: 4 }}>
			<Table>
				<TableHead>
					<TableRow
						sx={{
							fontWeight: "bold",
							backgroundColor: "black",
							color: "white",
						}}
					>
						<TableCell
							component="th"
							scope="row"
							sx={{ fontWeight: "bold", color: "white" }}
						>
							Model
						</TableCell>
						<TableCell
							align="center"
							sx={{ fontWeight: "bold", color: "white" }}
						>
							Accuracy
						</TableCell>
						<TableCell
							align="center"
							sx={{ fontWeight: "bold", color: "white" }}
						>
							Correct
						</TableCell>
						<TableCell
							align="center"
							sx={{ fontWeight: "bold", color: "white" }}
						>
							Wrong
						</TableCell>
						<TableCell
							align="center"
							sx={{ fontWeight: "bold", color: "white" }}
						>
							No Answer
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(evaluationResults).map((model) => (
						<TableRow key={model}>
							<TableCell component="th" scope="row">
								{model}
							</TableCell>
							<TableCell align="center">
								{parseFloat(
									evaluationResults[model].accuracy
								).toFixed(2)}{" "}
								%
							</TableCell>
							<TableCell
								align="center"
								sx={{ color: "#22c55e", fontWeight: "bold" }}
							>
								{evaluationResults[model].correct}
							</TableCell>
							<TableCell align="center" sx={{ color: "#ef4444" }}>
								{evaluationResults[model].wrong}
							</TableCell>
							<TableCell align="center">
								{evaluationResults[model].invalid}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}