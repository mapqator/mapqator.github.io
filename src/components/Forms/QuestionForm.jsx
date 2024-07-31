import React, { useContext, useState } from "react";
import { Box, Button } from "@mui/material";
import { Clear, KeyboardDoubleArrowRight, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import OptionsEditor from "../InputFields/OptionsEditor";
import CategorySelectionField from "../InputFields/CategorySelectionField";
import CorrectAnswerEditor from "../InputFields/CorrectAnswerEditor";
import QuestionEditor from "../InputFields/QuestionEditor";
import { GlobalContext } from "@/contexts/GlobalContext";

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
					endIcon={<KeyboardDoubleArrowRight />}
					loading={loading}
					loadingPosition="start"
				>
					{query.id === undefined
						? "Evaluate"
						: "Evaluate #" + query.id}
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
