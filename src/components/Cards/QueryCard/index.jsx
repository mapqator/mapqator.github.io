"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Annotation from "./Annotation";
import LLMAnswers from "./LLMAnswers";
import QueryEditButton from "@/components/Buttons/QueryEditButton";
import CollapsedContext from "./CollapsedContext";
import OptionsPreview from "./OptionsPreview";

export default function QueryCard({ entry, onEdit }) {
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		const invalid = entry.evaluation?.find(
			(e) =>
				e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
				e.verdict === "invalid"
		);
		if (invalid) {
			setFlag(true);
		} else {
			setFlag(entry.human.answer === 0);
		}
	}, [entry]);

	return (
		<Accordion key={entry.id} sx={{ mb: 2 }}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`panel${entry.id}-content`}
				id={`panel${entry.id}-header`}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
					}}
					className="gap-2"
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							width: "99%",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-start",
								width: "70%",
								flexGap: "1rem",
								alignItems: "center",
							}}
						>
							<Typography sx={{ width: "20%" }}>
								#{entry.id}
							</Typography>

							<Box>
								<Chip
									label={entry.classification}
									color="primary"
								/>
							</Box>
						</Box>

						<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
							<FontAwesomeIcon icon={faUser} />
							{entry.username}
						</h2>
					</Box>
					<div className="flex flex-row gap-4 justify-between items-start">
						<Typography
							sx={{
								color: "text.primary",
								mt: 1,
								whiteSpace: "pre-line",
							}}
						>
							{entry.question}
						</Typography>
						{flag && (
							<Chip
								label={"Invalid"}
								color="error"
								className="ml-auto"
							/>
						)}
					</div>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Context:
					</Typography>
					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
						<CollapsedContext context={entry.context} />
					</Paper>
				</Box>
				<OptionsPreview answer={entry.answer} />
				<LLMAnswers evaluation={entry.evaluation} />
				<Annotation query={entry} />
				<QueryEditButton {...{ onEdit }} query={entry} />
			</AccordionDetails>
		</Accordion>
	);
}
