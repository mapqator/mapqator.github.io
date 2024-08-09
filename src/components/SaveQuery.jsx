// components/SaveQuery.jsx
import React, { useState } from "react";
import { Button, Typography, Box, Snackbar, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const SaveQuery = ({ prevName, onSave, onDiscard }) => {
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [queryName, setQueryName] = useState(prevName || "");
	const handleSave = (e) => {
		e.preventDefault();
		onSave(queryName);
		// setShowSnackbar(true);
	};

	return (
		<form
			className="mt-4 p-4 bg-blue-50 rounded-lg w-full"
			onSubmit={handleSave}
		>
			<Typography variant="h6" gutterBottom>
				Save this to dataset?
			</Typography>
			<TextField
				required
				fullWidth
				label="Query Name"
				variant="outlined"
				value={queryName}
				onChange={(e) => setQueryName(e.target.value)}
				className="mb-3"
			/>
			<Box display="flex" className="gap-2" mt={2}>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					startIcon={<SaveIcon />}
				>
					Save
				</Button>
				<Button
					variant="outlined"
					color="error"
					onClick={onDiscard}
					startIcon={<DeleteIcon />}
				>
					Discard
				</Button>
			</Box>
			{/* <Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={showSnackbar}
				autoHideDuration={3000}
				onClose={() => setShowSnackbar(false)}
				message="Query saved successfully!"
			/> */}
		</form>
	);
};

export default SaveQuery;
