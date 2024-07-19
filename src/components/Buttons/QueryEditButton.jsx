"use client";
import React, { useState, useEffect, useContext } from "react";
import { Box, Button } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import MapApi from "@/api/mapApi";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { LoadingButton } from "@mui/lab";
import { Edit } from "@mui/icons-material";
import dayjs from "dayjs";
const mapApi = new MapApi();

export default function QueryEditButton({ onEdit, state }) {
	const [loading, setLoading] = useState(false);
	const {
		savedPlacesMap,

		// Setters
		setSelectedPlacesMap,
		setDistanceMatrix,
		setNearbyPlacesMap,
		setCurrentInformation,
		setDirectionInformation,
		setSavedPlacesMap,
		setContext,
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

	const handleEdit = async () => {
		setLoading(true);
		for (let place_id in state.context_json.places) {
			await handleSave(place_id);
		}
		setSelectedPlacesMap(state.context_json.places ?? {});
		setDistanceMatrix(state.context_json.distance_matrix ?? {});
		setDirectionInformation(state.context_json.directions ?? {});
		setNearbyPlacesMap(state.context_json.nearby_places ?? {});
		setCurrentInformation(
			state.context_json.current_information
				? {
						time: state.context_json.current_information.time
							? dayjs(state.context_json.current_information.time)
							: null,
						day: state.context_json.current_information.day,
						location:
							state.context_json.current_information.location,
				  }
				: {
						time: null,
						day: "",
						location: "",
				  }
		);
		setPoisMap(
			state.context_json.pois?.length > 0 ? state.context_json.pois : {}
		);
		setContext({
			places: ContextGeneratorService.getPlacesContext(
				state.context_json.places ?? {},
				savedPlacesMap
			),
			nearby: ContextGeneratorService.getNearbyContext(
				state.context_json.nearby_places ?? {},
				savedPlacesMap
			),
			area: ContextGeneratorService.getAreaContext(
				state.context_json.pois ?? {},
				savedPlacesMap
			),
			distance: ContextGeneratorService.getDistanceContext(
				state.context_json.distance_matrix ?? {},
				savedPlacesMap
			),
			direction: ContextGeneratorService.getDirectionContext(
				state.context_json.directions ?? {},
				savedPlacesMap
			),
			params: ContextGeneratorService.getParamsContext(
				state.context_json.current_information
					? {
							time: state.context_json.current_information.time
								? dayjs(
										state.context_json.current_information
											.time
								  )
								: null,
							day: state.context_json.current_information.day,
							location:
								state.context_json.current_information.location,
					  }
					: {
							time: null,
							day: "",
							location: "",
					  },
				savedPlacesMap
			),
		});
		setQuery(state);
		onEdit();
		setLoading(false);
	};

	return (
		<Box className="w-full flex justify-end mt-2">
			<LoadingButton
				variant="contained"
				color="primary"
				startIcon={<Edit />}
				onClick={handleEdit}
				loading={loading}
				loadingPosition="start"
			>
				Edit
			</LoadingButton>
		</Box>
	);
}
