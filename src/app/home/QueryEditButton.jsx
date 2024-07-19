"use client";
import React, { useState, useEffect, useContext } from "react";
import { Box, Button } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();

export default function QueryEditButton({ onEdit }) {
	const {
		setSelectedPlacesMap,
		setDistanceMatrix,
		setNearbyPlacesMap,
		setCurrentInformation,
		setDirectionInformation,
		savedPlacesMap,
		setSavedPlacesMap,
		setContext,
		setContextJSON,
		setQuery,
		setPoisMap,
	} = useContext(GlobalContext);

	const handleSave = async (place_id) => {
		if (savedPlacesMap[place_id]) return;
		const res = await mapApi.getDetails(place_id);
		if (res.success) {
			const details = res.data.result;
			setSavedPlacesMap((prev) => ({
				...prev,
				[place_id]: details,
			}));
		} else {
			console.error("Error fetching data: ", res.error);
			return;
		}
	};

	return (
		<Box className="w-full flex justify-end mt-2">
			<Button
				variant="contained"
				color="primary"
				startIcon={<Edit />}
				onClick={async () => {
					for (let place_id in state.context_json.places) {
						await handleSave(place_id);
					}
					setSelectedPlacesMap(state.context_json.places ?? {});
					setDistanceMatrix(state.context_json.distance_matrix ?? {});
					setDirectionInformation(
						state.context_json.directions ?? {}
					);

					setNearbyPlacesMap(state.context_json.nearby_places ?? {});
					setCurrentInformation(
						state.context_json.current_information
							? {
									time: state.context_json.current_information
										.time
										? dayjs(
												state.context_json
													.current_information.time
										  )
										: null,
									day: state.context_json.current_information
										.day,
									location:
										state.context_json.current_information
											.location,
							  }
							: {
									time: null,
									day: "",
									location: "",
							  }
					);
					setPoisMap(
						state.context_json.pois?.length > 0
							? state.context_json.pois
							: {}
					);
					setContext([]);
					setContextJSON({});
					setQuery(state);
					onEdit();
				}}
			>
				Edit
			</Button>
		</Box>
	);
}
