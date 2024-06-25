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

export var setLoading;
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
	const [poisMap, setPoisMap] = useState([]);
	const [loading, setL] = useState(true);
	setLoading = setL;
	return (
		<main className="flex min-h-screen flex-col bg-black">
			{loading ? (
				<div className="bg-white fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center">
					<div className="border-[6px] border-solid border-gray rounded-full border-t-[8px] border-t-blue-500 w-16 h-16 animate-spin"></div>
				</div>
			) : (
				<></>
			)}
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
						poisMap,
						setPoisMap,
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
