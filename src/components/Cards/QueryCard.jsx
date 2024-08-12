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
	IconButton,
	Card,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import Annotation from "@/components/Forms/Annotation";
import LLMAnswers from "../Tables/LLMAnswers";
import QueryEditButton from "@/components/Buttons/QueryEditButton";
import CollapsedContext from "./CollapsedContext";
import OptionsPreview from "../Lists/OptionsPreview";
import { getUserName } from "@/api/base";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import { Delete, Save, GetApp, Rule } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import categories from "@/database/categories.json";
import { convertFromSnake } from "@/services/utils";
import { AppContext } from "@/contexts/AppContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import ContextVisualize from "../Viewer/ContextVisualize";

export default function QueryCard({ entry, onEdit, isPersonal, mode, index }) {
	const [flag, setFlag] = useState(false);
	const { setQueries } = useContext(AppContext);
	const { isAuthenticated } = useAuth();
	const [expanded, setExpanded] = useState(index === 0);
	const [context, setContext] = useState();
	// const [category, setCategory] = useState(entry.classification);

	const handleDelete = async () => {
		if (isAuthenticated) {
			const res = await queryApi.deleteNewQuery(entry.id);
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

	// useEffect(() => {
	// 	const invalid = entry.evaluation?.find(
	// 		(e) =>
	// 			e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
	// 			e.verdict === "invalid"
	// 	);
	// 	if (invalid) {
	// 		setFlag(true);
	// 	} else {
	// 		setFlag(entry.human.answer === 0);
	// 	}
	// }, [entry]);

	const toggleAccordion = () => setExpanded(!expanded);

	const handleDownloadQuery = () => {
		const jsonString = JSON.stringify(entry, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = `query_${entry.id}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	useEffect(() => {
		const raw = {
			places: ContextGeneratorService.getPlacesContext(
				entry.context_json.places,
				entry.context_json.saved_places
			),
			nearby: ContextGeneratorService.getNearbyContext(
				entry.context_json.nearby_places,
				entry.context_json.saved_places
			),
			distance: ContextGeneratorService.getDistanceContext(
				entry.context_json.distance_matrix,
				entry.context_json.saved_places
			),
			direction: ContextGeneratorService.getDirectionContext(
				entry.context_json.directions,
				entry.context_json.saved_places
			),
		};
		setContext(ContextGeneratorService.convertContextToText(raw));
	}, []);

	return (
		<Card elevation={2}>
			<div
				className="p-4 cursor-pointer flex flex-row"
				onClick={toggleAccordion}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						width: "95%",
					}}
					className="gap-2"
				>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "flex-start",
								width: "70%",
								alignItems: "center",
							}}
							className="gap-2"
						>
							<Typography sx={{ width: "3rem" }}>
								#{entry.id}
							</Typography>

							{/* <Box className="flex gap-2">
								{entry.classification
									.split(",")
									.map((label, index) => (
										<Chip
											label={convertFromSnake(label)}
											key={index}
											color="primary"
										/>
									))}
							</Box> */}
						</Box>

						{/* <h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
							<FontAwesomeIcon icon={faUser} />
							{entry.username}
						</h2> */}
					</Box>
					<div className="flex flex-row gap-4 justify-between items-start w-full">
						<div className="flex-grow min-w-0">
							<h6
								className={`mt-2 ${
									expanded
										? "whitespace-pre-line"
										: "truncate"
								}`}
							>
								{entry.name}
							</h6>
						</div>
						{flag && (
							<Chip
								label={"Invalid"}
								color="error"
								className="ml-auto"
							/>
						)}
					</div>
				</Box>
				<Box className="my-auto">
					<IconButton
						edge="end"
						className="ml-auto my-auto"
						size="small"
						sx={{
							transform: expanded
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "0.3s",
						}}
					>
						<ExpandMoreIcon />
					</IconButton>
				</Box>
			</div>
			{expanded && (
				<div className="p-4 bg-white">
					{context && (
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Context:
							</Typography>
							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								<CollapsedContext context={context} />
							</Paper>
						</Box>
					)}
					<Box sx={{ mb: 2 }}>
						<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
							<ContextVisualize
								savedPlacesMap={entry.context_json.saved_places}
								selectedPlacesMap={entry.context_json.places}
								nearbyPlacesMap={
									entry.context_json.nearby_places
								}
								distanceMatrix={
									entry.context_json.distance_matrix
								}
								directionInformation={
									entry.context_json.directions
								}
							/>
						</Paper>
					</Box>

					<div className="flex flex-col gap-4">
						{entry.questions.map((question, i) => (
							<div key={i}>
								<Typography variant="h6" gutterBottom>
									Question {i + 1}:
								</Typography>
								<Paper
									elevation={1}
									sx={{ p: 2, bgcolor: "grey.100" }}
								>
									<Box sx={{ mb: 2 }}>
										<h6
											className={`${"whitespace-pre-line"}`}
										>
											{question.title}
										</h6>
									</Box>
									<OptionsPreview answer={question.answer} />
									<LLMAnswers entry={entry} index={i} />
								</Paper>
							</div>
						))}
					</div>

					{/* <OptionsPreview answer={entry.answer} /> */}

					{/* {!isPersonal && mode !== "explore" && (
						<Annotation query={entry} />
					)} */}

					{/* Only creator can edit his question */}
				</div>
			)}
			{(entry.username === getUserName() ||
				getUserName() === "admin") && (
				<div className="w-full flex flex-row justify-end gap-2 p-2">
					{getUserName() === "admin" && (
						<div className="flex flex-row gap-2 mr-auto">
							{/* <FormControl
										variant="outlined"
										className="w-[20rem]"
										size="small"
										required
									>
										<InputLabel>Category</InputLabel>
										<Select
											required
											label={"Category"}
											placeholder="Choose a category of the question"
											id="outlined-adornment"
											className="outlined-input"
											value={category}
											onChange={(e) => {
												setCategory(e.target.value);
											}}
										>
											{categories.map((value, index) => (
												<MenuItem
													key={index}
													value={value}
												>
													{convertFromSnake(value)}
												</MenuItem>
											))}
										</Select>
									</FormControl> */}
							<Button
								variant="contained"
								color="primary"
								size="small"
								onClick={async () => {
									const result =
										await queryApi.updateCategory(
											entry.id,
											category
										);
									if (result.success) {
										setQueries((prev) =>
											prev.map((q) =>
												q.id === entry.id
													? {
															...entry,
															classification:
																category,
													  }
													: q
											)
										);
										showSuccess(
											"Category updated successfully"
										);
									}
								}}
								startIcon={<Save />}
							>
								Save
							</Button>
						</div>
					)}

					{mode === "explore" ? (
						<>
							<QueryEditButton {...{ onEdit }} query={entry} />
						</>
					) : (
						<>
							{/* <Button
								color="primary"
								startIcon={<GetApp />}
								onClick={handleDownloadQuery}
							>
								Download Query
							</Button> */}
							<Button
								color="primary"
								startIcon={<Rule />}
								onClick={async () => {
									const res =
										await queryApi.submitForEvaluation(
											entry.id,
											context
										);
									if (res.success) {
										showSuccess(
											"Query submitted for evaluation"
										);
										console.log(res.data[0]);
										// Update the query with the evaluation
										setQueries((prev) =>
											prev.map((q) =>
												q.id === entry.id
													? {
															...entry,
															evaluation:
																res.data[0],
													  }
													: q
											)
										);
									} else {
										showError(
											"Can't submit query for evaluation"
										);
									}
								}}
							>
								Evaluate
							</Button>
							<Button
								// variant="contained"
								color="error"
								startIcon={<Delete />}
								onClick={() => handleDelete()}
							>
								Delete
							</Button>
							<QueryEditButton {...{ onEdit }} query={entry} />
						</>
					)}
				</div>
			)}
		</Card>
	);
}
// export default function QueryCard({ entry, onEdit }) {
// 	const [flag, setFlag] = useState(false);
// 	const { setQueries } = useContext(AppContext);
// 	const { isAuthenticated } = useAuth();
// 	const [expanded, setExpanded] = useState(false);
// 	const [category, setCategory] = useState(entry.classification);

// 	const handleDelete = async () => {
// 		if (isAuthenticated) {
// 			const res = await queryApi.deleteQuery(entry.id);
// 			if (res.success) {
// 				setQueries((prev) => prev.filter((q) => q.id !== entry.id));
// 				showSuccess("Query deleted successfully");
// 			} else {
// 				showError("Can't delete query");
// 			}
// 		} else {
// 			setQueries((prev) => prev.filter((q) => q.id !== entry.id));
// 			showSuccess("Query deleted successfully");
// 		}
// 	};

// 	useEffect(() => {
// 		const invalid = entry.evaluation?.find(
// 			(e) =>
// 				e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
// 				e.verdict === "invalid"
// 		);
// 		if (invalid) {
// 			setFlag(true);
// 		} else {
// 			setFlag(entry.human.answer === 0);
// 		}
// 	}, [entry]);

// 	return (
// 		<Accordion key={entry.id} sx={{ mb: 2 }}>
// 			<AccordionSummary
// 				expandIcon={<ExpandMoreIcon />}
// 				aria-controls={`panel${entry.id}-content`}
// 				id={`panel${entry.id}-header`}
// 				onClick={() => setExpanded((prev) => !prev)}
// 			>
// 				<Box
// 					sx={{
// 						display: "flex",
// 						flexDirection: "column",
// 						width: "100%",
// 					}}
// 					className="gap-2"
// 				>
// 					<Box
// 						sx={{
// 							display: "flex",
// 							justifyContent: "space-between",
// 							width: "99%",
// 						}}
// 					>
// 						<Box
// 							sx={{
// 								display: "flex",
// 								justifyContent: "flex-start",
// 								width: "70%",
// 								flexGap: "1rem",
// 								alignItems: "center",
// 							}}
// 						>
// 							<Typography sx={{ width: "20%" }}>
// 								#{entry.id}
// 							</Typography>

// 							<Box className="flex gap-2">
// 								{entry.classification
// 									.split(",")
// 									.map((label, index) => (
// 										<Chip
// 											label={convertFromSnake(label)}
// 											key={index}
// 											color="primary"
// 										/>
// 									))}
// 							</Box>
// 						</Box>

// 						<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
// 							<FontAwesomeIcon icon={faUser} />
// 							{entry.username}
// 						</h2>
// 					</Box>
// 					<div className="flex flex-row gap-4 justify-between items-start w-full">
// 						<div className="flex-grow min-w-0">
// 							<h6
// 								className={`mt-2 ${
// 									expanded
// 										? "whitespace-pre-line"
// 										: "truncate"
// 								}`}
// 							>
// 								{entry.question}
// 							</h6>
// 						</div>
// 						{flag && (
// 							<Chip
// 								label={"Invalid"}
// 								color="error"
// 								className="ml-auto"
// 							/>
// 						)}
// 					</div>
// 				</Box>
// 			</AccordionSummary>
// 			<AccordionDetails>
// 				<Box sx={{ mb: 2 }}>
// 					<Typography variant="h6" gutterBottom>
// 						Context:
// 					</Typography>
// 					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
// 						<CollapsedContext context={entry.context} />
// 					</Paper>
// 				</Box>
// 				<OptionsPreview answer={entry.answer} />
// 				<LLMAnswers evaluation={entry.evaluation} />
// 				<Annotation query={entry} />
// 				{/* Only creator can edit his question */}
// 				{(entry.username === getUserName() ||
// 					getUserName() === "admin") && (
// 					<div className="w-full flex flex-row justify-end gap-2 mt-2">
// 						{getUserName() === "admin" && (
// 							<div className="flex flex-row gap-2 mr-auto">
// 								<FormControl
// 									variant="outlined"
// 									className="w-[20rem]"
// 									size="small"
// 									required
// 								>
// 									<InputLabel>Category</InputLabel>
// 									<Select
// 										required
// 										multiple
// 										label={"Category"}
// 										placeholder="Choose a category of the question"
// 										id="outlined-adornment"
// 										className="outlined-input"
// 										value={category
// 											.split(",")
// 											.filter(Boolean)}
// 										onChange={(e) => {
// 											setCategory(
// 												e.target.value.join(",")
// 											);
// 										}}
// 										renderValue={(selected) => (
// 											<Box
// 												sx={{
// 													display: "flex",
// 													flexWrap: "wrap",
// 													gap: 0.5,
// 												}}
// 											>
// 												{selected.map((value) => (
// 													<Chip
// 														key={value}
// 														label={convertFromSnake(
// 															value
// 														)}
// 														size="small"
// 													/>
// 												))}
// 											</Box>
// 										)}
// 									>
// 										{categories.map((value, index) => (
// 											<MenuItem key={index} value={value}>
// 												{convertFromSnake(value)}
// 											</MenuItem>
// 										))}
// 									</Select>
// 								</FormControl>
// 								<Button
// 									variant="contained"
// 									color="primary"
// 									size="small"
// 									onClick={async () => {
// 										const result =
// 											await queryApi.updateCategory(
// 												entry.id,
// 												category
// 											);
// 										if (result.success) {
// 											setQueries((prev) =>
// 												prev.map((q) =>
// 													q.id === entry.id
// 														? {
// 																...entry,
// 																classification:
// 																	category,
// 														  }
// 														: q
// 												)
// 											);
// 											showSuccess(
// 												"Category updated successfully"
// 											);
// 										}
// 									}}
// 									startIcon={<Save />}
// 								>
// 									Save
// 								</Button>
// 							</div>
// 						)}

// 						<Button
// 							// variant="contained"
// 							color="error"
// 							startIcon={<Delete />}
// 							onClick={() => handleDelete()}
// 						>
// 							Delete
// 						</Button>
// 						<QueryEditButton {...{ onEdit }} query={entry} />
// 					</div>
// 				)}
// 			</AccordionDetails>
// 		</Accordion>
// 	);
// }
