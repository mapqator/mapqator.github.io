"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GlobalContextProvider, { GlobalContext } from "@/contexts/GlobalContext";
import Home from "./page/Home";
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

export default function PageComponent() {
	const [activeStep, setActiveStep] = useState(null);
	const [selected, setSelected] = useState("context");

	useEffect(() => {
		const page = window.location.hash.substring(1);
		setSelected(page === "" || page === "onboard" ? "context" : page);
	}, []);

	useEffect(() => {
		if (selected === "context" && activeStep === null) {
			setActiveStep(
				window.location.hash.substring(1) === "onboard" ? 0 : 1
			);
		}
	}, [selected]);

	return (
		<GlobalContextProvider>
			<Home />
		</GlobalContextProvider>
	);
}
