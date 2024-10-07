import React, { useContext, useState } from "react";
import { Box, Button, IconButton, Paper } from "@mui/material";
import {
	Add,
	Clear,
	Delete,
	KeyboardDoubleArrowRight,
	Save,
	Send,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import OptionsEditor from "../InputFields/OptionsEditor";
import CategorySelectionField from "../InputFields/CategorySelectionField";
import CorrectAnswerEditor from "../InputFields/CorrectAnswerEditor";
import QuestionEditor from "../InputFields/QuestionEditor";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useAuth } from "@/contexts/AuthContext";
import SaveQuery from "../SaveQuery";
import LoginPrompt from "../LoginPrompts";
import config from "@/config/config";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { AppContext } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import queryApi from "@/api/queryApi";
import { showError, showSuccess } from "@/contexts/ToastProvider";

export default function QuestionAnswerForm({ handleSubmit, handleReset }) {
	const {
		query,
		setQuery,
		initQuery,
		context,
		selectedPlacesMap,
		nearbyPlacesMap,
		poisMap,
		directionInformation,
		distanceMatrix,
		currentInformation,
		setQueryStatus,
	} = useContext(GlobalContext);
	const router = useRouter();
	const { queries, setQueries, savedPlacesMap } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const { isAuthenticated } = useAuth();

	const handleSave = async (queryName) => {
		const newQuery = {
			...query,
			name: queryName,
			context: ContextGeneratorService.convertContextToText(context),
			context_json: {
				places: savedPlacesMap,
				// distance_matrix: distanceMatrix,
				place_details: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				// current_information: currentInformation,
				// pois: poisMap,
				directions: directionInformation,
			},
		};

		if (query.id === undefined) {
			const res = await queryApi.createNewQuery(newQuery);
			if (res.success) {
				// update the queries
				showSuccess("Query saved successfully");
				console.log(res.data);
				const newQueries = [...queries];
				newQueries.unshift(res.data[0]);
				setQueries(newQueries);
				setQuery((prev) => ({
					...prev,
					id: res.data[0].id,
				}));
				// handleDiscard();
				// router.push("/home/my-dataset");
			} else {
				showError("Can't save this query");
				// window.scrollTo(0, 0);
			}
		} else {
			const res = await queryApi.updateNewQuery(query.id, newQuery);
			if (res.success) {
				setQueries((prev) =>
					prev.map((q) => (q.id === res.data[0].id ? res.data[0] : q))
				);
				// update the queries
				showSuccess("Query edited successfully");
				// handleDiscard();
				// router.push("/home/my-dataset");
			} else {
				showError("Can't update this query");
				// window.scrollTo(0, 0);
			}
		}
		// handleSubmit();
		setQueryStatus("saved");
		window.scrollTo(0, document.body.scrollHeight);
	};

	const handleLogin = () => {
		router.push(config.logoutRedirect);
	};

	const handleDiscard = () => {
		setQuery({
			questions: [initQuery],
		});
	};

	return (
		<Box
			// onSubmit={async (e) => {
			// 	setLoading(true);
			// 	await handleSubmit(e);
			// 	setLoading(false);
			// }}
			className="flex flex-col items-center"
		>
			{query.questions.map((question, index) => (
				<Paper elevation={2} sx={{ p: 3, mb: 4 }} key={index}>
					<QuestionEditor index={index} />
					<CategorySelectionField index={index} />
					<OptionsEditor index={index} />
					<CorrectAnswerEditor index={index} />
					<Box className="flex flex-row justify-end">
						<IconButton
							onClick={() =>
								setQuery((prev) => {
									const newQuery = { ...prev };
									newQuery.questions.splice(index, 1);
									return newQuery;
								})
							}
						>
							<Delete
								color="error"
								sx={{
									fontSize: 32,
								}}
							/>
						</IconButton>
					</Box>
				</Paper>
			))}

			<Button
				variant="contained"
				color="primary"
				startIcon={<Add />}
				sx={{
					mb: 4,
				}}
				onClick={() => {
					setQuery((prev) => ({
						...prev,
						questions: [...prev.questions, initQuery],
					}));
					// window.scrollTo(0, document.body.scrollHeight);
				}}
			>
				Add question
			</Button>

			{/* <Box className="flex flex-row gap-4 w-full">
				<LoadingButton
					type="submit"
					variant="contained"
					color="primary"
					endIcon={<Send />}
					loading={loading}
					loadingPosition="start"
				>
					{query.id === undefined ? "Submit" : "Submit #" + query.id}
				</LoadingButton>
				<Button
					onClick={() => {
						handleReset();
						window.scrollTo(0, 0);
					}}
					startIcon={<Clear />}
					color="error"
				>
					Clear
				</Button>
			</Box> */}

			{isAuthenticated ? (
				<SaveQuery
					query={query}
					onSave={handleSave}
					onDiscard={handleDiscard}
				/>
			) : (
				<LoginPrompt onLogin={handleLogin} />
			)}
		</Box>
	);
}
