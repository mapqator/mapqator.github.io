"use client";
import { useEffect, useState } from "react";
import Home from "./console/home";

export var setLoading;
export default function PageComponent() {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	const [loading, setL] = useState(false);
	setLoading = setL;

	const handleStorageChange = () => {
		console.log("storage change", localStorage.getItem("token"));
		if (localStorage.getItem("token")) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	};

	useEffect(() => {
		handleStorageChange();
		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);
	return (
		<div>
			{/* {loading ? (
				<div className="bg-white fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center">
					<div className="border-[6px] border-solid border-gray rounded-full border-t-[8px] border-t-blue-500 w-16 h-16 animate-spin"></div>
				</div>
			) : (
				<></>
			)} */}
			<Home />
		</div>
	);
}
