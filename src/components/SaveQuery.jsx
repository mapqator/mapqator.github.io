// components/SaveQuery.jsx
import React, { useState } from "react";
import { Button, Typography, Box, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const SaveQuery = ({ onSave, onDiscard }) => {
	const [showSnackbar, setShowSnackbar] = useState(false);

	const handleSave = () => {
		onSave();
		setShowSnackbar(true);
	};

	return (
		<Box className="mt-4 p-4 bg-blue-50 rounded-lg">
			<Typography variant="h6" gutterBottom>
				Save this evaluation?
			</Typography>
			<Box display="flex" className="gap-2" mt={2}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSave}
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
		</Box>
	);
};

export default SaveQuery;
