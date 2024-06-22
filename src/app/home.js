"use client";
import { ToastContainer, toast } from "react-toastify";
import DatasetCreator from "./DatasetCreator";
import ContextGenerator from "./ContextGenerator";
import { useState } from "react";

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
	return (
		<main className="flex min-h-screen flex-col bg-black">
			<div className="flex flex-row gap-1">
				<DatasetCreator
					contextJSON={contextJSON}
					context={context}
					{...{
						setSelectedPlacesMap,
						setDistanceMatrix,
						setNearbyPlacesMap,
						setCurrentInformation,
						setContext,
						setContextJSON,
					}}
				/>
				<ContextGenerator
					setContextJSON={setContextJSON}
					context={context}
					setContext={setContext}
					{...{
						setDistanceMatrix,
						distanceMatrix,
						selectedPlacesMap,
						setSelectedPlacesMap,
						nearbyPlacesMap,
						setNearbyPlacesMap,
						currentInformation,
						setCurrentInformation,
					}}
				/>
			</div>

			<footer className="w-full h-20 text-white flex items-center justify-center">
				<a href="https://mahirlabibdihan.github.io/">
					© Mahir Labib Dihan
				</a>
			</footer>
		</main>
	);
}
