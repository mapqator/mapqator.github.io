"use client";
import { useEffect, useState } from "react";
import GlobalContextProvider from "@/contexts/GlobalContext";
import Home from "./page/Home";

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
