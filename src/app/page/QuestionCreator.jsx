import React, { useContext } from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
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

export default function QuestionCreationPage({ handleContextEdit, onFinish }) {
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
	} = useContext(GlobalContext);

	const { queries, setQueries, savedPlacesMap } = useContext(AppContext);
	const { isAuthenticated } = useAuth();

	const handleReset = () => {
		setQuery((prev) => ({
			...initQuery,
			context: prev.context,
			context_json: prev.context_json,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
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
		<Box sx={{ mt: 4, mb: 4 }}>
			<h1 className="text-3xl md:text-4xl font-normal pb-5">
				Create MCQ Question based on the Context
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
			<QuestionForm
				handleSubmit={handleSubmit}
				handleReset={handleReset}
			/>

			{queries.filter((item) => item.username === getUserName()).length >
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
			)}
		</Box>
	);
}
