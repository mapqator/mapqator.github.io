"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Pagination,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { getUserName } from "@/api/base";
import categories from "@/database/categories.json";
import QueryCard from "@/components/Cards/QueryCard";
const itemsPerPage = 10;
export default function QuestionsContainer({ title, isPersonal, onEdit }) {
	const { queries } = useContext(GlobalContext);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const allCategories = ["All", ...categories];
	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);

	const handlePagination = (event, value) => {
		setPage(value);
	};

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
					(!isPersonal || item.username === getUserName())
			);
		}
		setPageCount(Math.ceil(newQueries.length / itemsPerPage));
		setData(newQueries.slice(start, end));
	}, [page, queries, selectedCategory]);
	return (
		<>
			<div className="flex flex-row justify-between items-center">
				<Typography variant="h4" gutterBottom component="h1">
					{title}
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
							onChange={(e) => {
								setSelectedCategory(e.target.value);
							}}
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

			{data.map((entry) => (
				<QueryCard key={entry.id} entry={entry} onEdit={onEdit} />
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
