"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Select,
	MenuItem,
	IconButton,
	Paper,
	InputAdornment,
	Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import MyQuestions from "./MyQuestions";
import categories from "@/database/categories.json";
import { jwtDecode } from "jwt-decode";
import { getTokenFromLocalStorage, getUserName } from "@/api/base";
import { Clear, Save } from "@mui/icons-material";
import QuestionForm from "./QuestionForm";
const queryApi = new QueryApi();

export default function QuestionCreationPage({ handleContextEdit }) {
	const {
		context,
		query,
		setQuery,
		queries,
		distanceMatrix,
		selectedPlacesMap,
		nearbyPlacesMap,
		currentInformation,
		poisMap,
		directionInformation,
	} = useContext(GlobalContext);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		setQuery((prev) => ({
			...prev,
			context: [
				...context.places,
				...context.nearby,
				...context.area,
				...context.distance,
				...context.direction,
				...context.params,
			].reduce((acc, e) => acc + e + "\n", ""),
			context_json: {
				distance_matrix: distanceMatrix,
				places: selectedPlacesMap,
				nearby_places: nearbyPlacesMap,
				current_information: currentInformation,
				pois: poisMap,
				directions: directionInformation,
			},
		}));
	}, [context]);

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
						mb: 2,
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
				<Box>
					{query.context.split("\n").map(
						(line, index) =>
							(expanded || index < 5) && (
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
					{query.context.split("\n").length > 5 && (
						<Button
							onClick={() => setExpanded((prev) => !prev)}
							sx={{ mt: 1, textTransform: "none" }}
						>
							{expanded ? "Show Less" : "Read More"}
						</Button>
					)}
				</Box>
			</Paper>
			<QuestionForm />

			{queries.filter((item) => item.username === getUserName()).length >
				0 && (
				<>
					<Divider sx={{ my: 4 }} />
					<MyQuestions />
				</>
			)}
		</>
	);
}
