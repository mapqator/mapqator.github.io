"use client";

import DatasetCreator from "./DatasetCreator";
import ContextGenerator from "./ContextGenerator";
import { useEffect, useState } from "react";
import Login from "./Login";

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
	if (res === undefined) showToast("Couldn't connect to server", "error");
	else if (res.success) showToast(message, "success");
	else showToast(res.error, "error");
};
export const showMessage = (message, res) => {
	if (res === undefined) showToast("Couldn't connect to server", "error");
	else if (res.success) showToast(message);
	else showToast(res.error, "error");
};

export default function Home() {
	const [savedPlacesMap, setSavedPlacesMap] = useState({});
	const [contextJSON, setContextJSON] = useState({});
	const [context, setContext] = useState([]);
	const [distanceMatrix, setDistanceMatrix] = useState({});
	const [selectedPlacesMap, setSelectedPlacesMap] = useState({});
	const [nearbyPlacesMap, setNearbyPlacesMap] = useState({});
	const [currentInformation, setCurrentInformation] = useState({
		time: null,
		day: "",
		location: "",
	});
	const [directionInformation, setDirectionInformation] = useState({});
	const [poisMap, setPoisMap] = useState({});

	const [isAuthenticated, setIsAuthenticated] = useState(null);
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
		<main className="flex min-h-screen flex-col bg-black">
			<div className="flex flex-col md:flex-row gap-1">
				<ContextGenerator
					setContextJSON={setContextJSON}
					context={context}
					setContext={setContext}
					{...{
						savedPlacesMap,
						setSavedPlacesMap,
						setDistanceMatrix,
						distanceMatrix,
						selectedPlacesMap,
						setSelectedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
						currentInformation,
						setCurrentInformation,
						directionInformation,
						setDirectionInformation,
						poisMap,
						setPoisMap,
					}}
				/>
				{isAuthenticated == null ? (
					<div className="w-1/2 bg-white h-screen"> </div>
				) : isAuthenticated ? (
					<DatasetCreator
						contextJSON={contextJSON}
						context={context}
						{...{
							savedPlacesMap,
							setSavedPlacesMap,
							setSelectedPlacesMap,
							setDistanceMatrix,
							setNearbyPlacesMap,
							setCurrentInformation,
							setDirectionInformation,
							setContext,
							setContextJSON,
							setPoisMap,
						}}
					/>
				) : (
					<Login />
				)}
			</div>

			{/* <footer className="w-full h-20 text-white flex items-center justify-center">
				<a href="https://mahirlabibdihan.github.io/">
					© Mahir Labib Dihan
				</a>
			</footer> */}
		</main>
	);
}
