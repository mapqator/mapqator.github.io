"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
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
	const [state, setState] = useState(entry);
	useEffect(() => {
		setState(entry);
	}, [entry]);
	useEffect(() => {
		const invalid = state.evaluation?.find(
			(e) =>
				e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
				e.verdict === "invalid"
		);
		console.log(state.human);
		if (invalid) {
			setFlag(true);
		} else {
			setFlag(state.human.answer === 0);
		}
	}, [entry]);
	return (
		<Accordion key={state.id} sx={{ mb: 2 }}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`panel${state.id}-content`}
				id={`panel${state.id}-header`}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "100%",
					}}
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
								width: "50%",
								flexGap: "1rem",
							}}
						>
							<Typography sx={{ width: "40%" }}>
								Question #{state.id}
							</Typography>

							<Box>
								<Chip
									label={state.classification}
									color="primary"
								/>
							</Box>
						</Box>

						<div className="flex flex-row gap-2 w-[50%] justify-end">
							{flag && (
								<Box sx={{ width: "20%" }}>
									<Chip label={"Invalid"} color="error" />
								</Box>
							)}
							<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
								<FontAwesomeIcon icon={faUser} />
								{state.username}
							</h2>
						</div>
					</Box>
					<Typography sx={{ color: "text.primary", mt: 1 }}>
						{state.question}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<CollapsedContext context={state.context} />
				<OptionsPreview answer={state.answer} />
				<LLMAnswers evaluation={state.evaluation} />
				<Annotation {...{ state, setState }} />
				<QueryEditButton {...{ onEdit }} />
			</AccordionDetails>
		</Accordion>
	);
}
