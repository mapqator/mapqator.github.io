"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function ToastProvider({ children }) {
	return (
		<>
			{children}
			<ToastContainer
				style={{ width: "270px" }}
				position="top-right"
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
