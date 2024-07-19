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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Clear, Edit, Save } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import QueryCard from "@/components/Cards/QueryCard";
import MapApi from "@/api/mapApi";
import categories from "@/database/categories.json";
const queryApi = new QueryApi();
const mapApi = new MapApi();

const itemsPerPage = 10;
export default function DatasetPage({ onEdit }) {
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
			newQueries = queries.filter((item) =>
				item.classification.includes(selectedCategory)
			);
		}
		setPageCount(Math.ceil(newQueries.length / itemsPerPage));
		setData(newQueries.slice(start, end));
	}, [page, queries, selectedCategory]);

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
				<QueryCard
					key={entry.id}
					entry={entry}
					index={(page - 1) * itemsPerPage + index}
					onEdit={onEdit}
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
