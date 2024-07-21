"use client";
import React, { useContext } from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import { getUserName } from "@/api/base";
import QuestionForm from "../Forms/QuestionForm";
import { showError, showSuccess } from "@/app/page";
import CollapsedContext from "../Cards/QueryCard/CollapsedContext";
import QuestionsContainer from "../Containers/QuestionsContainer";
import ContextGeneratorService from "@/services/contextGeneratorService";
const queryApi = new QueryApi();

export default function QuestionCreationPage({ handleContextEdit }) {
	const {
		context,
		query,
		setQuery,
		queries,
		setQueries,
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		currentInformation,
		poisMap,
		directionInformation,
		isAuthenticated,
		initQuery,
	} = useContext(GlobalContext);

	const handleReset = () => {
		setQuery((prev) => ({
			...initQuery,
			context: prev.context,
			context_json: prev.context,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const newQuery = {
			...query,
			context: text,
			context_json: {
				distance_matrix: distanceMatrix,
				places: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				current_information: currentInformation,
				pois: poisMap,
				directions: directionInformation,
			},
		};
		if (isAuthenticated) {
			if (query.id === undefined) {
				const res = await queryApi.createQuery(newQuery);
				if (res.success) {
					// update the queries
					showSuccess("Query saved successfully");
					const newQueries = [...queries];
					newQueries.unshift(res.data[0]);
					setQueries(newQueries);
					handleReset();
				} else {
					showError("Can't save this query");
					window.scrollTo(0, 0);
				}
			} else {
				const res = await queryApi.updateQuery(query.id, newQuery);
				if (res.success) {
					setQueries((prev) =>
						prev.map((q) =>
							q.id === res.data[0].id ? res.data[0] : q
						)
					);
					// update the queries
					showSuccess("Query edited successfully");
					handleReset();
				} else {
					showError("Can't update this query");
					window.scrollTo(0, 0);
				}
			}
		} else {
			if (query.id === undefined) {
				const new_id =
					"G-" +
					queries.filter((item) => item.username === getUserName())
						.length;
				const newQueries = [...queries];
				newQueries.unshift({
					...newQuery,
					id: new_id,
					username: getUserName(),
					human: {
						answer: "",
						explanation: "",
						username: "",
					},
				});
				setQueries(newQueries);
				showSuccess("Query saved successfully");
			} else {
				setQueries((prev) =>
					prev.map((q) => (q.id === query.id ? newQuery : q))
				);
				showSuccess("Query edited successfully");
			}
			handleReset();
		}
	};

	return (
		<>
			<Typography variant="h4" gutterBottom component="h1">
				Create MCQ Question based on Context
			</Typography>
			<Paper elevation={3} sx={{ p: 3, mb: 4 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6">Context:</Typography>
					<Button
						startIcon={<EditIcon />}
						onClick={handleContextEdit}
					>
						Edit Context
					</Button>
				</Box>
				<Divider sx={{ my: 2 }} />
				<Box>
					<CollapsedContext
						context={ContextGeneratorService.convertContextToText(
							context
						)}
					/>
					{/* <React.Fragment>
						<p
							className="w-full text-left"
							dangerouslySetInnerHTML={{
								__html: expanded
									? text
									: text.substring(0, 200) + " ...",
							}}
							style={{
								whiteSpace: "pre-line",
							}}
						/>
					</React.Fragment>
					{text === "" && (
						<p className="text-center my-auto text-lg md:text-xl text-zinc-400">
							No context provided.
						</p>
					)}
					{text.length > 200 && (
						<Button
							onClick={() => setExpanded((prev) => !prev)}
							sx={{ mt: 1, textTransform: "none" }}
						>
							{expanded ? "Show Less" : "Read More"}
						</Button>
					)} */}
				</Box>
			</Paper>
			<QuestionForm
				handleSubmit={handleSubmit}
				handleReset={handleReset}
			/>

			{queries.filter((item) => item.username === getUserName()).length >
				0 && (
				<>
					<Divider sx={{ my: 4 }} />
					<QuestionsContainer
						title="My Questions"
						isPersonal={true}
						onEdit={() => window.scrollTo(0, 0)}
					/>
				</>
			)}
		</>
	);
}
