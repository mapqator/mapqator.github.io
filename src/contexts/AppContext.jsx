"use client";

import { createContext, useEffect, useState } from "react";
import QueryApi from "@/api/queryApi";
import PlaceApi from "@/api/placeApi";
const queryApi = new QueryApi();
const placeApi = new PlaceApi();
export const AppContext = createContext();

export default function AppContextProvider({ children }) {
	const initSavedPlacesMap = {
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
	};
	const [savedPlacesMap, setSavedPlacesMap] = useState(initSavedPlacesMap);
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
			classification: "trip",
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
			classification: "trip",
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
			classification: "poi",
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
			classification: "poi",
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
			classification: "trip",
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
			classification: "trip",
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
			classification: "trip",
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
			classification: "trip",
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
			classification: "trip",
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
			classification: "trip",
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
			classification: "trip",
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
		if (process.env.NODE_ENV === "production") {
			fetchPlaces();
			fetchQueries();
		}
	}, []);

	return (
		<AppContext.Provider
			value={{ savedPlacesMap, setSavedPlacesMap, queries, setQueries }}
		>
			{children}
		</AppContext.Provider>
	);
}
