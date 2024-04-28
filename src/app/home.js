"use client";

import DatasetCreator from "./DatasetCreator";
import ContextGenerator from "./ContextGenerator";
import { useState } from "react";

export default function Home() {
	const [contextJSON, setContextJSON] = useState({});
	const [context, setContext] = useState([]);
	const [distanceMatrix, setDistanceMatrix] = useState({});
	const [selectedPlacesMap, setSelectedPlacesMap] = useState({});
	const [nearbyPlacesMap, setNearbyPlacesMap] = useState({});
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
