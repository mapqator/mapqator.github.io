"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

export const showToast = (message, type) => {
	console.log(message, type);
	if (type === "success") toast.success(message, {});
	else if (type === "error") toast.error(message, {});
	else {
		toast.dark(message, {});
	}
};
export const showSuccess = (message, res) => {
	showToast(message, "success");
};
export const showError = (message) => {
	showToast(message, "error");
};

export const showMessage = (message, res) => {
	if (res === undefined) showToast("Couldn't connect to server", "error");
	else if (res.success) showToast(message);
	else showToast(res.error, "error");
};

export default function ToastProvider({ children }) {
	return (
		<>
			{children}
			<ToastContainer
				style={{ width: "270px" }}
				position="bottom-right"
				theme="colored"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</>
	);
}
