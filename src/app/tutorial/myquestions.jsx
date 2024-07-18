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
	Pagination,
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
import { jwtDecode } from "jwt-decode";
import { getTokenFromLocalStorage } from "@/api/base";

const QueryCard = ({ entry, index, onEdit }) => {
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
	const [flag, setFlag] = useState(false);
	const [expanded, setExpanded] = useState(false);
	const [state, setState] = useState(entry);
	const [contextExpanded, setContextExpanded] = useState(false);
	const toggleExpanded = (id) => {
		setExpanded((prev) => !prev);
	};
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

						{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Category: {state.classification}
								</Typography> */}
						{/* <Typography
									sx={{
										color: "text.secondary",
										fontSize: "0.875rem",
									}}
								>
									Author: {state.username || "Unknown"}
								</Typography> */}
						<div className="flex flex-row gap-2 w-[50%] justify-end">
							{flag && (
								<Box sx={{ width: "20%" }}>
									<Chip label={"Invalid"} color="error" />
								</Box>
							)}
							{/* <h2 className="text-base font-semibold px-1 flex flex-row gap-1 items-center">
								<FontAwesomeIcon icon={faUser} />
								{state.username}
							</h2> */}
						</div>
					</Box>
					<Typography sx={{ color: "text.primary", mt: 1 }}>
						{state.question}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Context:
					</Typography>
					<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
						{state.context.split("\n").map(
							(line, index) =>
								(contextExpanded || index < 5) && (
									<React.Fragment key={index}>
										<p
											key={index}
											className="w-full text-left"
											dangerouslySetInnerHTML={{
												__html: line,
											}}
										/>
									</React.Fragment>
								)
						)}
						{state.context.split("\n").length > 5 && (
							<Button
								onClick={() =>
									setContextExpanded((prev) => !prev)
								}
								sx={{ mt: 1, textTransform: "none" }}
							>
								{expanded[state.id] ? "Show Less" : "Read More"}
							</Button>
						)}
					</Paper>
				</Box>
				<Box sx={{ mb: 2 }}>
					<Typography variant="h6" gutterBottom>
						Options:
					</Typography>
					<List dense>
						{state.answer.options.map(
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
														state.correctAnswer
															? "bold"
															: "normal",
													color:
														option ===
														state.correctAnswer
															? "success.main"
															: "inherit",
												},
											}}
										/>
										{index === state.answer.correct && (
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
									{state.evaluation.map(
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

				<Box className="w-full flex justify-end mt-2">
					<Button
						variant="contained"
						color="primary"
						startIcon={<Edit />}
						onClick={async () => {
							for (let place_id in state.context_json.places) {
								await handleSave(place_id);
							}
							setSelectedPlacesMap(
								state.context_json.places ?? {}
							);
							setDistanceMatrix(
								state.context_json.distance_matrix ?? {}
							);
							setDirectionInformation(
								state.context_json.directions ?? {}
							);

							setNearbyPlacesMap(
								state.context_json.nearby_places ?? {}
							);
							setCurrentInformation(
								state.context_json.current_information
									? {
											time: state.context_json
												.current_information.time
												? dayjs(
														state.context_json
															.current_information
															.time
												  )
												: null,
											day: state.context_json
												.current_information.day,
											location:
												state.context_json
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
							setQuery(state);
							window.scrollTo(0, 0);
						}}
					>
						Edit
					</Button>
				</Box>
			</AccordionDetails>
		</Accordion>
	);
};

const itemsPerPage = 10;
export default function MyQuestions() {
	const { queries, savedPlacesMap, setSavedPlacesMap } =
		useContext(GlobalContext);
	const [filteredQueries, setFilteredQueries] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [expanded, setExpanded] = useState({});

	const handlePagination = (event, value) => {
		setPage(value);
	};

	useEffect(() => {
		handleCategoryChange({ target: { value: selectedCategory } });
	}, [queries]);

	const categories = [
		"All",
		...[
			"nearby_poi",
			"planning",
			"time_calculation",
			"routing",
			"location_finding",
			"opinion",
		],
	];

	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);

	useEffect(() => {
		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		let newQueries;
		if (selectedCategory === "All") {
			newQueries = queries;
		} else {
			newQueries = queries.filter(
				(item) =>
					item.classification.includes(selectedCategory) &&
					item.username ===
						jwtDecode(getTokenFromLocalStorage()).email
			);
		}
		setFilteredQueries(newQueries);
		setPageCount(Math.ceil(newQueries.length / itemsPerPage));
		setData(newQueries.slice(start, end));
	}, [page, queries, selectedCategory]);

	const handleCategoryChange = async (event) => {
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
					My Questions
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
							onChange={() => setSelectedCategory(category)}
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

			{data.map((entry, index) => (
				<QueryCard
					key={entry.id}
					entry={entry}
					index={(page - 1) * itemsPerPage + index}
				/>
			))}
			<div className="flex justify-center bottom-0 left-0 right-0 pt-4">
				<Pagination
					size="medium"
					count={pageCount}
					color="primary"
					onChange={handlePagination}
					siblingCount={1}
					page={page}
				/>
			</div>
		</>
	);
}
