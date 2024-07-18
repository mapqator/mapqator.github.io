"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Container,
	Typography,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Collapse,
	OutlinedInput,
	TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Clear, Edit, Save } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import MapApi from "@/api/mapApi";
const queryApi = new QueryApi();
const mapApi = new MapApi();

const QueryCard = ({ entry }) => {
	const {
		queries,
		setQueries,
		setSelectedPlacesMap,
		setDistanceMatrix,
		setNearbyPlacesMap,
		setCurrentInformation,
		setDirectionInformation,
		savedPlacesMap,
		setSavedPlacesMap,
		setContext,
		context,
		setContextJSON,
		contextJSON,
		query,
		setQuery,
		setPoisMap,
	} = useContext(GlobalContext);

	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = (id) => {
		setExpanded((prev) => !prev);
	};

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
							}}
						>
							<Typography sx={{ width: "40%" }}>
								Question #{entry.id}
							</Typography>
							<Box>
								<Chip
									label={entry.classification}
									color="primary"
								/>
							</Box>
						</Box>

						{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Category: {entry.classification}
								</Typography> */}
						{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Author: {entry.username || "Unknown"}
								</Typography> */}
						<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
							<FontAwesomeIcon icon={faUser} />
							{entry.username}
						</h2>
					</Box>
					<Typography sx={{ color: "text.primary", mt: 1 }}>
						{entry.question}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Context:
					</Typography>
					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
						{entry.context.split("\n").map(
							(line, index) =>
								(expanded[entry.id] || index < 5) && (
									<React.Fragment key={index}>
										{/* {line} */}
										<p
											key={index}
											className="w-full text-left"
											dangerouslySetInnerHTML={{
												__html: line,
											}}
										/>
										{/* <br /> */}
									</React.Fragment>
								)
						)}
						{entry.context.split("\n").length > 5 && (
							<Button
								onClick={() => toggleExpanded(entry.id)}
								sx={{ mt: 1, textTransform: "none" }}
							>
								{expanded[entry.id] ? "Show Less" : "Read More"}
							</Button>
						)}
					</Paper>
				</Box>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Options:
					</Typography>
					<List dense>
						{entry.answer.options.map(
							(option, index) =>
								option !== "" && (
									<ListItem key={index}>
										<ListItemText
											primary={
												"Option " +
												(index + 1) +
												": " +
												option
											}
											sx={{
												"& .MuiListItemText-primary": {
													fontWeight:
														option ===
														entry.correctAnswer
															? "bold"
															: "normal",
													color:
														option ===
														entry.correctAnswer
															? "success.main"
															: "inherit",
												},
											}}
										/>
										{index === entry.answer.correct && (
											<Chip
												label="Correct"
												color="success"
												size="small"
											/>
										)}
									</ListItem>
								)
						)}
					</List>
				</Box>
				{entry.evaluation.length > 0 && (
					<Box sx={{ mb: 2 }}>
						<Typography variant="h6" gutterBottom>
							LLM Answers:
						</Typography>
						<TableContainer component={Paper}>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell>Model</TableCell>
										<TableCell align="center">
											Answer
										</TableCell>
										<TableCell align="center">
											Correct?
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{entry.evaluation.map(
										(llmAnswer, index) => (
											<TableRow key={index}>
												<TableCell>
													{llmAnswer.model}
												</TableCell>
												<TableCell align="center">
													{llmAnswer.answer}
												</TableCell>
												<TableCell align="center">
													{llmAnswer.verdict ===
													"right" ? (
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
										)
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				)}

				<div className="flex flex-col gap-2 p-2 border-2 border-black rounded-md">
					<div className="flex flex-row justify-between">
						<h1 className="text-lg font-bold underline">
							Human Annotation
						</h1>
						<h2 className="text-lg font-semibold text-black px-1 flex flex-row gap-1 items-center">
							<FontAwesomeIcon icon={faUser} />
							{query.human.username}
						</h2>
					</div>
					<div className="flex flex-col gap-1">
						<div key={index} className="flex flex-col gap-2">
							<FormControl
								fullWidth
								className="input-field"
								variant="outlined"
								size="small"
							>
								<InputLabel
									htmlFor="outlined-adornment"
									className="input-label"
								>
									Correct Answer
								</InputLabel>
								<Select
									// multiple
									id="outlined-adornment"
									className="outlined-input"
									value={query.human.answer}
									onChange={(e) => {
										setQuery((prev) => ({
											...prev,
											human: {
												...prev.human,
												answer: e.target.value,
											},
										}));
									}}
									input={
										<OutlinedInput
											label={"Correct Answer"}
										/>
									}
								>
									<MenuItem value={0}>No answer</MenuItem>
									{query.answer.options.map(
										(value, index) => (
											<MenuItem
												key={index}
												value={index + 1}
											>
												{value}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
							<TextField
								value={query.human.explanation}
								onChange={(e) => {
									setQuery((prev) => ({
										...prev,
										human: {
											...prev.human,
											explanation: e.target.value,
										},
									}));
								}}
								fullWidth
								label="Explanation"
								size="small"
								multiline
							/>
							<div className="flex flex-row gap-2">
								<Button
									variant="contained"
									color="error"
									onClick={async () => {
										setQuery((prev) => ({
											...prev,
											human: {
												answer: null,
												explanation: "",
												username: prev.human.username,
											},
										}));
									}}
									startIcon={<Clear />}
								>
									Clear
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={async () => {
										console.log(query.id);
										const res = await queryApi.annotate(
											query.id,
											{
												answer: query.human.answer,
												explanation:
													query.human.explanation,
											}
										);
										console.log(res);
										if (res.success)
											setQuery((prev) => ({
												...prev,
												human: {
													...prev.human,
													username:
														res.data[0].username,
												},
											}));
									}}
									startIcon={<Save />}
								>
									Annotate
								</Button>
							</div>
						</div>
					</div>
				</div>

				<Box className="w-full flex justify-end">
					<Button
						variant="contained"
						color="primary"
						startIcon={<Edit />}
						onClick={async () => {
							for (let place_id in entry.context_json.places) {
								await handleSave(place_id);
							}
							setSelectedPlacesMap(
								entry.context_json.places ?? {}
							);
							setDistanceMatrix(
								entry.context_json.distance_matrix ?? {}
							);
							setDirectionInformation(
								entry.context_json.directions ?? {}
							);

							setNearbyPlacesMap(
								entry.context_json.nearby_places ?? {}
							);
							setCurrentInformation(
								entry.context_json.current_information
									? {
											time: entry.context_json
												.current_information.time
												? dayjs(
														entry.context_json
															.current_information
															.time
												  )
												: null,
											day: entry.context_json
												.current_information.day,
											location:
												entry.context_json
													.current_information
													.location,
									  }
									: {
											time: null,
											day: "",
											location: "",
									  }
							);
							setPoisMap(
								query.context_json.pois?.length > 0
									? query.context_json.pois
									: {}
							);
							setContext([]);
							setContextJSON({});
							setQuery(entry);
							onEdit();
						}}
					>
						Edit
					</Button>
				</Box>
			</AccordionDetails>
		</Accordion>
	);
};
export default function DatasetPage({ onEdit }) {
	const {
		queries,
		setQueries,
		setSelectedPlacesMap,
		setDistanceMatrix,
		setNearbyPlacesMap,
		setCurrentInformation,
		setDirectionInformation,
		savedPlacesMap,
		setSavedPlacesMap,
		setContext,
		context,
		setContextJSON,
		contextJSON,
		query,
		setQuery,
		setPoisMap,
	} = useContext(GlobalContext);
	const [filteredQueries, setFilteredQueries] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [expanded, setExpanded] = useState({});

	const toggleExpanded = (id) => {
		setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) return text;
		return text.substr(0, maxLength) + "...";
	};

	const handleSave = async (place_id) => {
		if (savedPlacesMap[place_id]) return;
		const res = await mapApi.getDetails(place_id);
		if (res.success) {
			const details = res.data.result;
			setSavedPlacesMap((prev) => ({
				...prev,
				[place_id]: details,
			}));
		} else {
			console.error("Error fetching data: ", res.error);
			return;
		}
	};

	const router = useRouter();

	useEffect(() => {
		setFilteredQueries(queries);
	}, []);

	const categories = [
		"All",
		...[
			"nearby_poi",
			"planning",
			"time_calculation",
			"routing",
			"location_finding",
			"opinion",
			"navigation",
		],
	];

	const handleCategoryChange = (event) => {
		const category = event.target.value;
		setSelectedCategory(category);
		if (category === "All") {
			setFilteredQueries(queries);
		} else {
			setFilteredQueries(
				queries.filter((item) => item.classification.includes(category))
			);
		}
	};

	return (
		<>
			<div className="flex flex-row justify-between items-center">
				<Typography variant="h4" gutterBottom component="h1">
					Dataset Overview
				</Typography>
				<Box sx={{ mb: 3 }}>
					<FormControl sx={{ minWidth: 200 }} size="small">
						<InputLabel id="category-select-label">
							Filter by Category
						</InputLabel>
						<Select
							labelId="category-select-label"
							id="category-select"
							value={selectedCategory}
							label="Filter by Category"
							onChange={handleCategoryChange}
						>
							{categories.map((category) => (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</div>

			{filteredQueries.map((entry, index) => (
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
									}}
								>
									<Typography sx={{ width: "40%" }}>
										Question #{entry.id}
									</Typography>
									<Box>
										<Chip
											label={entry.classification}
											color="primary"
										/>
									</Box>
								</Box>

								{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Category: {entry.classification}
								</Typography> */}
								{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Author: {entry.username || "Unknown"}
								</Typography> */}
								<h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
									<FontAwesomeIcon icon={faUser} />
									{entry.username}
								</h2>
							</Box>
							<Typography sx={{ color: "text.primary", mt: 1 }}>
								{entry.question}
							</Typography>
						</Box>
					</AccordionSummary>
					<AccordionDetails>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Context:
							</Typography>
							<Paper
								elevation={1}
								sx={{ p: 2, bgcolor: "grey.100" }}
							>
								{entry.context.split("\n").map(
									(line, index) =>
										(expanded[entry.id] || index < 5) && (
											<React.Fragment key={index}>
												{/* {line} */}
												<p
													key={index}
													className="w-full text-left"
													dangerouslySetInnerHTML={{
														__html: line,
													}}
												/>
												{/* <br /> */}
											</React.Fragment>
										)
								)}
								{entry.context.split("\n").length > 5 && (
									<Button
										onClick={() => toggleExpanded(entry.id)}
										sx={{ mt: 1, textTransform: "none" }}
									>
										{expanded[entry.id]
											? "Show Less"
											: "Read More"}
									</Button>
								)}
							</Paper>
						</Box>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Options:
							</Typography>
							<List dense>
								{entry.answer.options.map(
									(option, index) =>
										option !== "" && (
											<ListItem key={index}>
												<ListItemText
													primary={
														"Option " +
														(index + 1) +
														": " +
														option
													}
													sx={{
														"& .MuiListItemText-primary":
															{
																fontWeight:
																	option ===
																	entry.correctAnswer
																		? "bold"
																		: "normal",
																color:
																	option ===
																	entry.correctAnswer
																		? "success.main"
																		: "inherit",
															},
													}}
												/>
												{index ===
													entry.answer.correct && (
													<Chip
														label="Correct"
														color="success"
														size="small"
													/>
												)}
											</ListItem>
										)
								)}
							</List>
						</Box>
						{entry.evaluation.length > 0 && (
							<Box sx={{ mb: 2 }}>
								<Typography variant="h6" gutterBottom>
									LLM Answers:
								</Typography>
								<TableContainer component={Paper}>
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell>Model</TableCell>
												<TableCell align="center">
													Answer
												</TableCell>
												<TableCell align="center">
													Correct?
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{entry.evaluation.map(
												(llmAnswer, index) => (
													<TableRow key={index}>
														<TableCell>
															{llmAnswer.model}
														</TableCell>
														<TableCell align="center">
															{llmAnswer.answer}
														</TableCell>
														<TableCell align="center">
															{llmAnswer.verdict ===
															"right" ? (
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
												)
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						)}

						<div className="flex flex-col gap-2 p-2 border-2 border-black rounded-md">
							<div className="flex flex-row justify-between">
								<h1 className="text-lg font-bold underline">
									Human Annotation
								</h1>
								<h2 className="text-lg font-semibold text-black px-1 flex flex-row gap-1 items-center">
									<FontAwesomeIcon icon={faUser} />
									{entry.human.username}
								</h2>
							</div>
							<div className="flex flex-col gap-1">
								<div
									key={index}
									className="flex flex-col gap-2"
								>
									<FormControl
										fullWidth
										className="input-field"
										variant="outlined"
										size="small"
									>
										<InputLabel
											htmlFor="outlined-adornment"
											className="input-label"
										>
											Correct Answer
										</InputLabel>
										<Select
											// multiple
											id="outlined-adornment"
											className="outlined-input"
											value={entry.human.answer}
											onChange={(e) => {
												setQueries((prev) =>
													prev.map((query) =>
														query.id === entry.id
															? {
																	...query,
																	human: {
																		...query.human,
																		answer: e
																			.target
																			.value,
																	},
															  }
															: query
													)
												);
											}}
											input={
												<OutlinedInput
													label={"Correct Answer"}
												/>
											}
										>
											<MenuItem value={0}>
												No answer
											</MenuItem>
											{entry.answer.options.map(
												(value, index) => (
													<MenuItem
														key={index}
														value={index + 1}
													>
														{value}
													</MenuItem>
												)
											)}
										</Select>
									</FormControl>
									<TextField
										value={entry.human.explanation}
										onChange={(e) => {
											setQueries((prev) =>
												prev.map((query) =>
													query.id === entry.id
														? {
																...query,
																human: {
																	...query.human,
																	explanation:
																		e.target
																			.value,
																},
														  }
														: query
												)
											);
										}}
										fullWidth
										label="Explanation"
										size="small"
										multiline
									/>
									<div className="flex flex-row gap-2">
										<Button
											variant="contained"
											color="error"
											onClick={async () => {
												setQueries((prev) =>
													prev.map((query) =>
														query.id === entry.id
															? {
																	...query,
																	human: {
																		answer: null,
																		explanation:
																			"",
																		username:
																			query
																				.human
																				.username,
																	},
															  }
															: query
													)
												);
											}}
											startIcon={<Clear />}
										>
											Clear
										</Button>
										<Button
											variant="contained"
											color="primary"
											onClick={async () => {
												console.log(entry.id);
												const res =
													await queryApi.annotate(
														entry.id,
														{
															answer: entry.human
																.answer,
															explanation:
																entry.human
																	.explanation,
														}
													);
												console.log(res);
												if (res.success) {
													setQueries((prev) =>
														prev.map((query) =>
															query.id ===
															entry.id
																? {
																		...query,
																		human: {
																			...query.human,
																			username:
																				res
																					.data[0]
																					.username,
																		},
																  }
																: query
														)
													);
												}
											}}
											startIcon={<Save />}
										>
											Annotate
										</Button>
									</div>
								</div>
							</div>
						</div>

						<Box className="w-full flex justify-end mt-2">
							<Button
								variant="contained"
								color="primary"
								startIcon={<Edit />}
								onClick={async () => {
									for (let place_id in entry.context_json
										.places) {
										await handleSave(place_id);
									}
									setSelectedPlacesMap(
										entry.context_json.places ?? {}
									);
									setDistanceMatrix(
										entry.context_json.distance_matrix ?? {}
									);
									setDirectionInformation(
										entry.context_json.directions ?? {}
									);

									setNearbyPlacesMap(
										entry.context_json.nearby_places ?? {}
									);
									setCurrentInformation(
										entry.context_json.current_information
											? {
													time: entry.context_json
														.current_information
														.time
														? dayjs(
																entry
																	.context_json
																	.current_information
																	.time
														  )
														: null,
													day: entry.context_json
														.current_information
														.day,
													location:
														entry.context_json
															.current_information
															.location,
											  }
											: {
													time: null,
													day: "",
													location: "",
											  }
									);
									setPoisMap(
										query.context_json.pois?.length > 0
											? query.context_json.pois
											: {}
									);
									setContext([]);
									setContextJSON({});
									setQuery(entry);
									onEdit();
								}}
							>
								Edit
							</Button>
						</Box>
					</AccordionDetails>
				</Accordion>
			))}
		</>
	);
}
