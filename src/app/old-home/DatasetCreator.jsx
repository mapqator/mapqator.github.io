"use client";

import React, { useEffect, useState } from "react";
import queryApi from "@/api/queryApi";
import FormControl from "@mui/material/FormControl";
import {
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	IconButton,
	Button,
	TextField,
	Pagination,
	Select,
	OutlinedInput,
	MenuItem,
	InputLabel,
} from "@mui/material";
import QueryCard from "./QueryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import QueryForm from "./QueryForm";
import Evaluation from "./Evaluation";
import DatasetInformation from "./DatasetInformation";
import { showSuccess, showToast } from "./home";
import { LoadingButton } from "@mui/lab";
import { Refresh } from "@mui/icons-material";
import categories from "./categories.json";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import ColumnChart from "./ColumnChart";
import AccuracyChart from "./AccuracyChart";
import QuestionChart from "./QuestionChart";
import GroundTruthDistribution from "./GroundTruthDistribution";
import AverageContext from "./AverageContext";
import AverageQuestion from "./AverageQuestion";
import ContextDistribution from "./ContextDistribution";
import QuestionDistribution from "./QuestionDistribution";
import ModelBias from "./ModelBias";
const itemsPerPage = 5;

export default function DatasetCreator({
	contextJSON,
	setContextJSON,
	context,
	savedPlacesMap,
	setContext,
	setSavedPlacesMap,
	setSelectedPlacesMap,
	setDistanceMatrix,
	setNearbyPlacesMap,
	setDirectionInformation,
	setCurrentInformation,
	setPoisMap,
}) {
	const [queries, setQueries] = useState([]);
	const [filteredQueries, setFilteredQueries] = useState([]);
	const [loading, setLoading] = useState(false);
	const [category, setCategory] = useState("");
	const [fetched, setFetched] = useState(false);
	const fetchQueries = async () => {
		setLoading(true);
		try {
			const res = await queryApi.getQueries();
			if (res.success) {
				console.log("Data: ", res.data);
				setQueries(res.data);
				setFetched(true);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const [data, setData] = useState([]);
	const [page, setPage] = useState(1);

	const [pageCount, setPageCount] = useState(0);

	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			// fetchQueries();
		}
	}, []);

	useEffect(() => {
		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		const newQueries = queries.filter(
			(query) =>
				category === "" || query.classification.includes(category)
		);
		setFilteredQueries(newQueries);
		setPageCount(Math.ceil(newQueries.length / itemsPerPage));
		setData(newQueries.slice(start, end));
	}, [page, queries, category]);

	const handlePagination = (event, value) => {
		setPage(value);
	};

	const handleSave = async (query) => {
		const res = await queryApi.createQuery({
			...query,
			context_json: {
				...query.context_json,
				place_details: savedPlacesMap,
			},
		});
		if (res.success) {
			// update the queries
			const newQueries = [...queries];
			// push front
			newQueries.unshift(res.data[0]);
			setQueries(newQueries);
			showSuccess("Query saved successfully", res);
		} else {
			showToast("Can't save this query", "error");
		}
	};

	const handleEdit = async (query, index) => {
		// console.log("Editing query: ", query, queries[index]);
		// return;
		const res = await queryApi.updateQuery(filteredQueries[index].id, {
			...query,
			context_json: {
				...query.context_json,
				place_details: savedPlacesMap,
			},
		});
		if (res.success) {
			// update the queries
			console.log("New Query: ", res.data[0]);
			setQueries((prevQueries) =>
				prevQueries.map((query, i) =>
					query.id === res.data[0].id ? res.data[0] : query
				)
			);
			showSuccess("Query edited successfully", res);
		}
	};
	const handleDelete = async (index) => {
		try {
			const res = await queryApi.deleteQuery(queries[index].id);
			if (res.success) {
				console.log("Data: ", res.data);
				// update the queries
				const newQueries = [...queries];
				newQueries.splice(index, 1);
				setQueries(newQueries);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};
	return (
		<div className="w-full md:w-1/2 flex flex-col items-center p-5 bg-white gap-2 h-screen overflow-y-auto">
			<div className="bg-white flex flex-col items-center w-full">
				<h1 className="text-3xl">Map Dataset Creator</h1>
				<p className="text-lg">
					Write question and answers with appropriate contexts
				</p>
				<h1 className="bg-black h-1 w-full my-2"></h1>
			</div>
			<QueryForm {...{ contextJSON, context, handleSave }} />
			{/*<h1 className="bg-black h-1 w-full my-2"></h1>*/}
			{/*<h1 className="text-2xl w-full">Previous Queries</h1>*/}
			{fetched ? (
				<>
					<div className="p-5">
						<LoadingButton
							onClick={fetchQueries}
							loading={loading}
							variant="contained"
							color="primary"
							endIcon={<Refresh />}
							loadingPosition="end"
						>
							Load Dataset
						</LoadingButton>
					</div>
					<DatasetInformation {...{ queries }} />
					<PieChart {...{ queries }} />
					<BarChart {...{ queries }} />
					<ColumnChart {...{ queries }} type={0} />
					{/* <ColumnChart {...{ queries }} type={1} />
					<ColumnChart {...{ queries }} type={2} /> */}
					{/* <ColumnChart {...{ queries }} type={4} /> */}
					<ColumnChart {...{ queries }} type={5} />
					<ColumnChart {...{ queries }} type={6} />
					<ColumnChart {...{ queries }} type={7} />
					<ColumnChart {...{ queries }} type={8} />
					<AverageContext {...{ queries }} />
					<ContextDistribution {...{ queries }} />
					<QuestionDistribution {...{ queries }} />
					<AverageQuestion {...{ queries }} />
					<GroundTruthDistribution {...{ queries }} />
					<QuestionChart {...{ queries }} />
					<AccuracyChart {...{ queries }} type={0} />
					{/* <AccuracyChart {...{ queries }} type={1} />
					<AccuracyChart {...{ queries }} type={2} />
					<AccuracyChart {...{ queries }} type={4} /> */}
					<AccuracyChart {...{ queries }} type={5} />
					<AccuracyChart {...{ queries }} type={6} />
					<AccuracyChart {...{ queries }} type={8} />
					<Evaluation {...{ queries }} type={0} />
					<Evaluation {...{ queries }} type={5} />
					<ModelBias {...{ queries }} type={6} />
					{/* <Evaluation {...{ queries }} type={1} />
					<Evaluation {...{ queries }} type={2} />
					<Evaluation {...{ queries }} type={3} /> */}
					<div className="flex flex-col gap-2 mt-1 w-full">
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
						<FormControl fullWidth size="small">
							{/* <InputLabel id="category-select-label">
								Category
							</InputLabel> */}
							<Select
								labelId="category-select-label"
								id="category-select"
								value={category}
								size="small"
								onChange={(e) => {
									setCategory(e.target.value);
								}}
								// input={<OutlinedInput label={"Category"} />}
								displayEmpty
							>
								<MenuItem value="">
									<em>All</em>
								</MenuItem>
								{categories.map((value, index) => (
									<MenuItem key={index} value={value}>
										{value}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						{data.map((query, index) => (
							<QueryCard
								key={query.id}
								// query={query}
								index={(page - 1) * itemsPerPage + index}
								initQuery={query}
								{...{
									setSavedPlacesMap,
									setSelectedPlacesMap,
									setDistanceMatrix,
									setNearbyPlacesMap,
									setCurrentInformation,
									setDirectionInformation,
									setContextJSON,
									setContext,
									context,
									contextJSON,
									handleDelete,
									handleEdit,
									setPoisMap,
								}}
							/>
						))}
					</div>
				</>
			) : (
				<div className="p-5">
					<LoadingButton
						onClick={fetchQueries}
						loading={loading}
						variant="contained"
						color="primary"
						endIcon={<Refresh />}
						loadingPosition="end"
					>
						Load Dataset
					</LoadingButton>
				</div>
			)}
		</div>
	);
}
