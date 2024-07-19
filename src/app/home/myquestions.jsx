"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import { jwtDecode } from "jwt-decode";
import { getTokenFromLocalStorage } from "@/api/base";
import QueryEditButton from "./QueryEditButton";
import LLMAnswers from "./LLMAnswers";
import OptionsPreview from "./OptionsPreview";
import CollapsedContext from "./CollapsedContext";
import categories from "./categories.json";
const QueryCard = ({ entry	 }) => {
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
						{flag && (
							<Box sx={{ width: "20%" }}>
								<Chip label={"Invalid"} color="error" />
							</Box>
						)}
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
				<QueryEditButton onEdit={() => window.scrollTo(0, 0)} />
			</AccordionDetails>
		</Accordion>
	);
};

const itemsPerPage = 10;
export default function MyQuestions() {
	const { queries } = useContext(GlobalContext);
	const [selectedCategory, setSelectedCategory] = useState("All");

	const handlePagination = (event, value) => {
		setPage(value);
	};

	const allCategories = ["All", ...categories];
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
		setPageCount(Math.ceil(newQueries.length / itemsPerPage));
		setData(newQueries.slice(start, end));
	}, [page, queries, selectedCategory]);

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
							{allCategories.map((category) => (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</div>

			{data.map((entry, index) => (
				<QueryCard key={entry.id} entry={entry} />
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
