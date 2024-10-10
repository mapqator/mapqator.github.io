// components/LoginPrompt.jsx
import React, { useContext } from "react";
import { Button, Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { Download } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";

const LoginPrompt = ({ onLogin }) => {
	const {
		query,
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

	return (
		<Box className="mt-4 p-4 bg-gray-100 rounded-lg text-center w-full flex flex-col items-center gap-2">
			<LockIcon className="text-gray-500" fontSize="large" />
			<Box>
				<Typography variant="h6" gutterBottom>
					Want to save this evaluation?
				</Typography>
				<Typography variant="body2" gutterBottom>
					Log in to save your query and results for future reference.
				</Typography>
			</Box>

			<Button
				variant="contained"
				color="primary"
				onClick={onLogin}
				startIcon={<LockIcon />}
				className="mb-2 w-[12rem]"
			>
				Log In to Save
			</Button>
			<Button
				variant="outlined"
				color="primary"
				onClick={handleDownload}
				startIcon={<Download />}
				className="mt-2 w-[12rem]"
			>
				Download JSON
			</Button>
		</Box>
	);
};

export default LoginPrompt;
