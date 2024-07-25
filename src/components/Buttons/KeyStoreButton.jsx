"use client";

import { faGear, faGears } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Add, Settings } from "@mui/icons-material";
import { Box, Button, CardContent, Dialog, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Skeleton from "@mui/material/Skeleton";
import { showSuccess } from "@/contexts/ToastProvider";

export default function KeyStoreButton({ onClick }) {
	const [open, setOpen] = useState(false);
	const [key, setKey] = useState(
		localStorage.getItem("google_maps_api_key") || ""
	);
	const handleClose = () => {
		setOpen(false);
	};
	const handleSave = () => {
		localStorage.setItem("google_maps_api_key", key);
		setOpen(false);
		showSuccess("Google Map Api Key saved successfully");
	};

	return (
		<div className="fixed bottom-10 z-10 right-10 items-center justify-center ">
			<Dialog fullWidth maxWidth="xs" onClose={handleClose} open={open}>
				<DialogTitle className="flex justify-between items-center">
					<div className="title">Set Google Map Api Key</div>
					<CloseIcon
						onClick={handleClose}
						className="cursor-pointer"
					/>
				</DialogTitle>
				<CardContent>
					<Box className="flex flex-col gap-4">
						<TextField
							label="Google Map Api Key"
							variant="outlined"
							className="w-full"
							value={key}
							onChange={(e) => setKey(e.target.value)}
						/>
						<Button
							onClick={handleSave}
							variant="contained"
							color="primary"
							className="w-full mt-4"
						>
							Save
						</Button>
					</Box>
				</CardContent>
			</Dialog>

			<Button
				onClick={() => setOpen(true)}
				variant="contained"
				color="primary"
				className="w-16 h-16 rounded-full justify-center inline-flex items-center p-4"
				sx={{
					borderRadius: "50%",
				}}
			>
				<FontAwesomeIcon icon={faGears} className="text-2xl" />
			</Button>
		</div>
	);
}
