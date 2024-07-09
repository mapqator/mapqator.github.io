"use client";

import React, { useEffect, useState } from "react";
import QueryApi from "@/api/queryApi";
const queryApi = new QueryApi();
import FormControl from "@mui/material/FormControl";
import {
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	IconButton,
	Button,
	TextField,
} from "@mui/material";
import QueryCard from "./QueryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import QueryForm from "./QueryForm";
import Evaluation from "./Evaluation";
import DatasetInformation from "./DatasetInformation";
import { showSuccess, showToast } from "./home";

export default function DatasetCreator({
	contextJSON,
	setContextJSON,
	context,
	setContext,
	setSelectedPlacesMap,
	setDistanceMatrix,
	setNearbyPlacesMap,
	setDirectionInformation,
	setCurrentInformation,
	setPoisMap,
}) {
	const [queries, setQueries] = useState([]);
	const fetchQueries = async () => {
		try {
			const res = await queryApi.getQueries();
			if (res.success) {
				console.log("Data: ", res.data);
				setQueries(res.data);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};
	useEffect(() => {
		fetchQueries();
	}, []);

	const handleSave = async (query) => {
		const res = await queryApi.createQuery(query);
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
		const res = await queryApi.updateQuery(queries[index].id, query);
		if (res.success) {
			// update the queries
			console.log("New Query: ", res.data[0]);
			const newQueries = [...queries];
			newQueries[index] = res.data[0];
			setQueries(newQueries);
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
		<div className="w-1/2 flex flex-col items-center p-5 bg-white gap-2">
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
			<DatasetInformation {...{ queries }} />
			<Evaluation {...{ queries }} />
			<div className="flex flex-col gap-2 mt-1 w-full">
				{queries.map((query, index) => (
					<QueryCard
						key={query.id}
						// query={query}
						index={index}
						initQuery={query}
						{...{
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
		</div>
	);
}
