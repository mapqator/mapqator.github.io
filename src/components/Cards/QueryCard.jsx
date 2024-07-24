import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	Paper,
	Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Annotation from "@/components/Forms/Annotation";
import LLMAnswers from "../Tables/LLMAnswers";
import QueryEditButton from "@/components/Buttons/QueryEditButton";
import CollapsedContext from "./CollapsedContext";
import OptionsPreview from "../Lists/OptionsPreview";
import { getUserName } from "@/api/base";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import { Delete } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";

export default function QueryCard({ entry, onEdit }) {
	const [flag, setFlag] = useState(false);
	const { setQueries } = useContext(GlobalContext);
	const { isAuthenticated } = useAuth();

	const handleDelete = async () => {
		if (isAuthenticated) {
			const res = await queryApi.deleteQuery(entry.id);
			if (res.success) {
				setQueries((prev) => prev.filter((q) => q.id !== entry.id));
				showSuccess("Query deleted successfully");
			} else {
				showError("Can't delete query");
			}
		} else {
			setQueries((prev) => prev.filter((q) => q.id !== entry.id));
			showSuccess("Query deleted successfully");
		}
	};

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

							<Box className="flex gap-2">
								{entry.classification
									.split(",")
									.map((label, index) => (
										<Chip
											label={label}
											key={index}
											color="primary"
										/>
									))}
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
				{/* Only creator can edit his question */}
				{(entry.username === getUserName() ||
					getUserName() === "admin") && (
					<div className="w-full flex flex-row justify-end gap-2 mt-2">
						<Button
							// variant="contained"
							color="error"
							startIcon={<Delete />}
							onClick={() => handleDelete()}
						>
							Delete
						</Button>
						<QueryEditButton {...{ onEdit }} query={entry} />
					</div>
				)}
			</AccordionDetails>
		</Accordion>
	);
}
