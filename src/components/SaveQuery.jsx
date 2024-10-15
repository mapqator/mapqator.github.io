// components/SaveQuery.jsx
import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, Box, Snackbar, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Download } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";

const SaveQuery = ({ query, onSave, onDiscard }) => {
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [queryName, setQueryName] = useState(query?.name || "");
	const handleSave = (e) => {
		e.preventDefault();
		onSave(queryName);
		// setShowSnackbar(true);
	};

	const {
		apiCallLogs,
		selectedPlacesMap,
		nearbyPlacesMap,
		directionInformation,
		routePlacesMap,
		savedPlacesMap,
	} = useContext(GlobalContext);

	const handleDownload = () => {
		const jsonString = JSON.stringify(
			{
				...query,
				api_call_logs: apiCallLogs,
				context_json: {
					places: savedPlacesMap,
					place_details: selectedPlacesMap,
					nearby_places: nearbyPlacesMap,
					directions: directionInformation,
					route_places: routePlacesMap,
				},
			},
			null,
			2
		);
		const blob = new Blob([jsonString], { type: "application/json" });
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = "dataset.json";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(href);
	};

	useEffect(() => {
		setQueryName(query?.name || "");
	}, [query]);

	return (
		<form
			className="p-4 bg-blue-50 rounded-lg w-full"
			onSubmit={handleSave}
		>
			<Typography variant="h6" gutterBottom>
				{query?.id === undefined ? "Save" : "Update"} this to dataset?
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
					Save {query?.id === undefined ? "" : "#" + query?.id}
				</Button>
				<Button
					// variant="outlined"
					color="primary"
					onClick={handleDownload}
					startIcon={<Download />}
					// className="mt-2"
				>
					Download
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
