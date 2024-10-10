"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	Button,
	Paper,
	Divider,
	Container,
	IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import { getUserName } from "@/api/base";
import QuestionForm from "@/components/Forms/QuestionForm";
import { showError, showSuccess } from "@/contexts/ToastProvider";
import CollapsedContext from "@/components/Cards/CollapsedContext";
import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { useAuth } from "@/contexts/AuthContext";
import { AppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import QuestionAnswerForm from "@/components/Forms/QuestionAnswerForm";
import { Assessment, ExpandMore } from "@mui/icons-material";
import ContextVisualize from "@/components/Viewer/ContextVisualize";

export default function QuestionCreationPage() {
	const {
		context,
		query,
		setQuery,
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		currentInformation,
		poisMap,
		directionInformation,
		initQuery,
		contextStatus,
		queryStatus,
		setQueryStatus,
		routePlacesMap,
	} = useContext(GlobalContext);

	const router = useRouter();
	const { queries, setQueries, savedPlacesMap } = useContext(AppContext);
	const { isAuthenticated } = useAuth();

	// useEffect(() => {
	// 	if (contextStatus === "empty") {
	// 		router.push("/home");
	// 	}
	// }, [contextStatus]);

	const handleContextEdit = () => {
		router.push("/home/context");
	};

	const onFinish = () => {
		router.push("/home/evaluation");
		setQueryStatus("saved");
	};

	const handleReset = () => {
		setQuery({
			questions: [initQuery],
			// context: prev.context,
			// context_json: prev.context_json,
		});
		setQueryStatus("empty");
		router.push("/home");
	};

	const [contextExpanded, setContextExpanded] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setQueryStatus("saved");
		onFinish();
		return;

		const newQuery = {
			...query,
			context: ContextGeneratorService.convertContextToText(context),
			context_json: {
				saved_places: savedPlacesMap,
				distance_matrix: distanceMatrix,
				places: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				current_information: currentInformation,
				pois: poisMap,
				directions: directionInformation,
			},
		};
		console.log(newQuery);
		if (isAuthenticated) {
			if (query.id === undefined) {
				const res = await queryApi.createQuery(newQuery);
				if (res.success) {
					// update the queries
					showSuccess("Query saved successfully");
					console.log("Saved query: ", res.data[0]);
					const newQueries = [...queries];
					newQueries.unshift(res.data[0]);
					setQueries(newQueries);
					window.scrollTo(document.getElementById("questions"));
					// handleReset();
					onFinish();
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
					// handleReset();
					onFinish();
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
				window.scrollTo(document.getElementById("questions"));
				showSuccess("Query saved successfully");
			} else {
				setQueries((prev) =>
					prev.map((q) => (q.id === query.id ? newQuery : q))
				);
				showSuccess("Query edited successfully");
			}
			// handleReset();
			onFinish();
		}
	};

	return (
		<Container
			maxWidth="md"
			// sx={{ mt: 4, mb: 4 }}
			className="min-h-screen"
		>
			<Box sx={{ mt: 4, mb: 4 }}>
				<h1 className="text-3xl md:text-4xl font-normal pb-5">
					Create MCQ Questions based on the Context
				</h1>
				<Paper elevation={2} sx={{ p: 3, mb: 4 }}>
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
						{/* <CollapsedContext
							context={ContextGeneratorService.convertContextToText(
								context
							)}
						/> */}

						<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
							<div
								className="flex justify-center flex-row items-center cursor-pointer"
								onClick={() =>
									setContextExpanded((prev) => !prev)
								}
							>
								<h1 className="font-bold p-2">
									{contextExpanded
										? "Hide Context"
										: "Visualize Context"}
								</h1>
								<IconButton
									// sx={{ height: "2rem", width: "2rem" }}

									sx={{
										transform: contextExpanded
											? "rotate(180deg)"
											: "rotate(0deg)",
										transition: "0.3s",
									}}
								>
									<ExpandMore />
								</IconButton>
							</div>

							{contextExpanded && (
								<>
									<Divider
										sx={{
											mt: 2,
										}}
									/>
									<ContextVisualize
										savedPlacesMap={savedPlacesMap}
										selectedPlacesMap={selectedPlacesMap}
										nearbyPlacesMap={nearbyPlacesMap}
										directionInformation={
											directionInformation
										}
										routePlacesMap={routePlacesMap}
									/>
								</>
							)}
						</Paper>
					</Box>
				</Paper>
				{/* <ContextVisualize context={context} /> */}
				<Box sx={{ mb: 2 }}></Box>

				{/* <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
				<Typography variant="h6">AI Generated Questions</Typography>
				<Divider sx={{ my: 2 }} />
				<ul className="list-disc pl-4">
					<li>Dummy Question 1</li>
					<li>Dummy Question 2</li>
					<li>Dummy Question 3</li>
					<li>Dummy Question 4</li>
				</ul>
			</Paper> */}
				<QuestionAnswerForm
					handleSubmit={handleSubmit}
					handleReset={handleReset}
				/>

				{/* {queries.filter((item) => item.username === getUserName()).length >
				0 && (
				<>
					<Divider sx={{ my: 4 }} />
					<div id="questions">
						<QuestionsContainer
							title="My Questions"
							isPersonal={true}
							onEdit={() => window.scrollTo(0, 0)}
						/>
					</div>
				</>
			)} */}
				{/* {queryStatus === "saved" && (
					<Box
						// mt={3}
						// p={2}
						// bgcolor="background.paper"
						borderRadius={1}
						className="mt-4 p-4 bg-blue-50 rounded-lg w-full"
					>
						<Typography variant="h6" gutterBottom>
							Would you like to evaluate this query with LLMs?
						</Typography>
						<Box display="flex" className="gap-2" mt={1}>
							<Button
								onClick={onFinish}
								variant="contained"
								color="primary"
								startIcon={<Assessment />}
							>
								Evaluate
							</Button>
							<Button
								onClick={() => handleReset()}
								variant="outlined"
							>
								No, thanks
							</Button>
						</Box>
					</Box>
				)} */}
			</Box>
		</Container>
	);
}
