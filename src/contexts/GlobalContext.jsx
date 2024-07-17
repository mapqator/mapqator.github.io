import QueryApi from "@/api/queryApi";
import React, { createContext, useState, useContext, useEffect } from "react";
const queryApi = new QueryApi();
export const GlobalContext = createContext();
export default function GlobalContextProvider({ children }) {
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
	const [query, setQuery] = useState({
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
	});
	const [queries, setQueries] = useState([]);

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
	useEffect(() => {
		// if (process.env.NODE_ENV === "production")
		{
			console.log("Fetching queries");
			fetchQueries();
		}
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				savedPlacesMap,
				setSavedPlacesMap,
				contextJSON,
				setContextJSON,
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
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}
