import React, { createContext, useState, useContext, useEffect } from "react";

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
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}
