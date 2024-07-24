"use client";
import GlobalContextProvider from "@/contexts/GlobalContext";
import Home from "./page/Home";

export default function PageComponent() {
	return (
		<GlobalContextProvider>
			<Home />
		</GlobalContextProvider>
	);
}
