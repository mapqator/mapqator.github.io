import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
// import "../Images/styles.scss";
const Confirmation = ({ open, setOpen, onConfirm, text }) => {
	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>
				{text + (text && " ") + "Are you sure you want to continue?"}
			</DialogTitle>
			<DialogActions>
				<Button onClick={handleClose} variant="contained" color="error">
					<CloseIcon />
				</Button>
				<Button
					onClick={() => {
						handleClose();
						onConfirm();
					}}
					variant="contained"
					color="primary"
					autoFocus
				>
					<DoneIcon />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Confirmation;
