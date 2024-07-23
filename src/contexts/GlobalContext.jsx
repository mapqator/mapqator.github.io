import React, { createContext, useState, useContext, useEffect } from "react";
import dayjs from "dayjs";
export const GlobalContext = createContext();
export default function GlobalContextProvider({ children }) {
	const exampleDistanceMatrix = {
		1: {
			2: {
				walking: {
					distance: "5 km",
					duration: "6 mins",
				},
				driving: {
					distance: "5 km",
					duration: "6 mins",
				},
				bicycling: {
					distance: "5 km",
					duration: "6 mins",
				},
				transit: {
					distance: "5 km",
					duration: "6 mins",
				},
			},
		},
		2: {
			1: {
				walking: {
					distance: "5 km",
					duration: "6 mins",
				},
				driving: {
					distance: "5 km",
					duration: "6 mins",
				},
				bicycling: {
					distance: "5 km",
					duration: "6 mins",
				},
				transit: {
					distance: "5 km",
					duration: "6 mins",
				},
			},
		},
	};
	const exampleSelectedPlacesMap = {
		1: {
			selectedAttributes: ["formatted_address", "rating"],
			attributes: [
				"formatted_address",
				"name",
				"place_id",
				"rating",
				"geometry",
			],
		},
		2: {
			selectedAttributes: ["formatted_address"],
			attributes: [
				"formatted_address",
				"name",
				"place_id",
				"rating",
				"geometry",
			],
		},
	};
	const exampleNearbyPlacesMap = {
		1: [
			{
				type: "restaurant",
				rankby: "distance",
				keyword: "",
				places: [
					{
						name: "Dhanmondi",
						formatted_address: "Dhanmondi 27 road",
						selected: true,
					},
					{
						name: "Farmgate",
						formatted_address: "Indira road, Dhaka",
						selected: true,
					},
				],
			},
		],
	};
	const examplePoisMap = {
		1: [
			{
				type: "restaurant",
				places: [
					{
						name: "Dhanmondi",
						formatted_address: "Dhanmondi 27 road",
						selected: true,
					},
					{
						name: "Farmgate",
						formatted_address: "Indira road, Dhaka",
						selected: true,
					},
				],
			},
		],
	};
	const exampleDirectionInformation = {
		1: {
			2: {
				walking: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Mirpur",
							steps: [],
						},
					],
					showSteps: true,
				},
				driving: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Uttara",
							steps: [],
						},
					],
					showSteps: true,
				},
				bicycling: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Jhigatola",
							steps: [],
						},
					],
					showSteps: true,
				},
				transit: {
					routes: [
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Uttara",
							steps: ["Go left from <b>Md pur</b>", "Then right"],
						},
						{
							distance: "5 km",
							duration: "6 mins",
							label: "Dhanmondi",
							steps: ["Go left from Md pur", "Then right"],
						},
					],
					showSteps: true,
				},
			},
		},
	};
	const exampleCurrentInformation = {
		time: dayjs("2024-07-22T21:00:00.000Z"),
		day: "Monday",
		location: 1,
	};

	const initSelectedPlacesMap = {};
	const initNearbyPlacesMap = {};
	const initPoisMap = {};
	const initDistanceMatrix = {};
	const initDirectionInformation = {};
	const initCurrentInformation = {
		time: null,
		day: "",
		location: "",
	};

	const [context, setContext] = useState({
		places: [],
		nearby: [],
		area: [],
		distance: [],
		direction: [],
		params: [],
	});

	const [selectedPlacesMap, setSelectedPlacesMap] = useState(
		initSelectedPlacesMap
	);
	const [nearbyPlacesMap, setNearbyPlacesMap] = useState(initNearbyPlacesMap);
	const [poisMap, setPoisMap] = useState(initPoisMap);
	const [distanceMatrix, setDistanceMatrix] = useState(initDistanceMatrix);
	const [directionInformation, setDirectionInformation] = useState(
		initDirectionInformation
	);
	const [currentInformation, setCurrentInformation] = useState(
		initCurrentInformation
	);

	const initQuery = {
		question: "",
		answer: {
			type: "mcq",
			options: ["", "", "", ""],
			correct: -1,
		},
		context: "",
		context_json: {},
		context_gpt: "",
		classification: "",
	};
	const [query, setQuery] = useState(initQuery);

	return (
		<GlobalContext.Provider
			value={{
				context,
				setContext,
				distanceMatrix,
				setDistanceMatrix,
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
				initQuery,
				query,
				setQuery,
				exampleSelectedPlacesMap,
				exampleNearbyPlacesMap,
				examplePoisMap,
				exampleDistanceMatrix,
				exampleDirectionInformation,
				exampleCurrentInformation,
				initSelectedPlacesMap,
				initNearbyPlacesMap,
				initPoisMap,
				initDistanceMatrix,
				initDirectionInformation,
				initCurrentInformation,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}
