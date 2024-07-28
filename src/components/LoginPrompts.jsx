// components/LoginPrompt.jsx
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const LoginPrompt = ({ onLogin }) => {
	return (
		<Box className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
			<LockIcon className="text-gray-500 mb-2" fontSize="large" />
			<Typography variant="h6" gutterBottom>
				Want to save this evaluation?
			</Typography>
			<Typography variant="body2" gutterBottom>
				Log in to save your query and results for future reference.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				onClick={onLogin}
				startIcon={<LockIcon />}
			>
				Log In to Save
			</Button>
		</Box>
	);
};

export default LoginPrompt;
