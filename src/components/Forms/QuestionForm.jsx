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
	InputAdornment,
	InputLabel,
	Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import queryApi from "@/api/queryApi";
import categories from "@/database/categories.json";
import { Clear, Save, WindowSharp } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import OptionsEditor from "../InputFields/OptionsEditor";
import CategorySelectionField from "../InputFields/CategorySelectionField";
import CorrectAnswerEditor from "../InputFields/CorrectAnswerEditor";
import QuestionEditor from "../InputFields/QuestionEditor";

export default function QuestionForm({ handleSubmit, handleReset }) {
	const { query, setQuery } = useContext(GlobalContext);
	const [loading, setLoading] = useState(false);

	return (
		<form
			onSubmit={async (e) => {
				setLoading(true);
				await handleSubmit(e);
				setLoading(false);
			}}
		>
			<QuestionEditor />
			<CategorySelectionField />
			<OptionsEditor />
			<CorrectAnswerEditor />
			<Box className="flex flex-row gap-4">
				<LoadingButton
					type="submit"
					variant="contained"
					color="primary"
					startIcon={<Save />}
					loading={loading}
					loadingPosition="start"
				>
					{query.id === undefined ? "Submit" : "Save #" + query.id}
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
			</Box>
		</form>
	);
}
