import QueryApi from "@/api/queryApi";
import PlaceApi from "@/api/placeApi";
import React, { createContext, useState, useContext, useEffect } from "react";
import { isTokenValid } from "@/api/base";
const queryApi = new QueryApi();
const placeApi = new PlaceApi();
export const GlobalContext = createContext();
export default function GlobalContextProvider({ children }) {
	const [savedPlacesMap, setSavedPlacesMap] = useState({
		1: {
			name: "Bangladesh University of Engineering and Technology",
			place_id: 1,
			formatted_address: "Polashi Bazar, Azimpur, Dhaka",
			rating: "4.5",
			geometry: {
				location: {
					lat: 40.712776,
					lng: -74.005974,
				},
			},
		},
		2: {
			name: "Labaid Hospital",
			place_id: 2,
			formatted_address: "Dhanmondi 32 Road, Dhaka",
			rating: "4.8",
			geometry: {
				location: {
					lat: 34.052235,
					lng: -118.243683,
				},
			},
		},
	});
	const [context, setContext] = useState({
		places: [],
		nearby: [],
		area: [],
		distance: [],
		direction: [],
		params: [],
	});
	const [distanceMatrix, setDistanceMatrix] = useState({
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
	});
	const [selectedPlacesMap, setSelectedPlacesMap] = useState({
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
	});
	const [nearbyPlacesMap, setNearbyPlacesMap] = useState({
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
	});
	const [currentInformation, setCurrentInformation] = useState({
		time: null,
		day: "",
		location: "",
	});
	const [directionInformation, setDirectionInformation] = useState({
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
	});
	const [poisMap, setPoisMap] = useState({
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
	});
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
	const [queries, setQueries] = useState([
		{
			id: 152,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 153,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "",
			context_json: {},
			context_gpt: "",
			classification: "routing",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 154,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "time_calculation",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 155,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "nearby_poi",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 156,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "opinion",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 157,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 158,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 159,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 160,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 161,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 162,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "wrong",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
		{
			id: 163,
			question: "Dummy Question",
			answer: {
				type: "mcq",
				options: ["a", "b", "c", "d"],
				correct: 1,
			},
			context: "Today is monday",
			context_json: {
				current_information: {
					time: null,
					day: "Monday",
					location: "",
				},
			},
			context_gpt: "",
			classification: "planning",
			username: "mahirlabibdihan",
			evaluation: [
				{
					model: "Phi 3",
					answer: 1,
					verdict: "right",
				},
				{
					model: "Llama 3",
					answer: 2,
					verdict: "invalid",
				},
			],
			human: {
				answer: "",
				explanation: "",
				username: "",
			},
		},
	]);

	const fetchQueries = async () => {
		// setLoading(true);
		try {
			const res = await queryApi.getQueries();
			if (res.success) {
				console.log("Data: ", res.data);
				setQueries(res.data);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	const fetchPlaces = async () => {
		console.log("Fetching places");
		// setButtonLoading(true);
		try {
			const res = await placeApi.getPlaces();
			if (res.success) {
				// create a map for easy access
				const newSavedPlacesMap = {};
				res.data.forEach((e) => {
					newSavedPlacesMap[e.place_id] = e;
				});
				setSavedPlacesMap(newSavedPlacesMap);
				// setFetched(true);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		// setButtonLoading(false);
	};

	useEffect(() => {
		// if (process.env.NODE_ENV === "production")
		{
			fetchPlaces();
			fetchQueries();
		}
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				savedPlacesMap,
				setSavedPlacesMap,
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
				query,
				setQuery,
				queries,
				setQueries,
				initQuery,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}
