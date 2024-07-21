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

export default function QueryEditButton({ onEdit, query }) {
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
		// setLoading(true);
		for (let place_id in query.context_json.places) {
			await handleSave(place_id);
		}
		setSelectedPlacesMap(query.context_json.places ?? {});
		setDistanceMatrix(query.context_json.distance_matrix ?? {});
		setDirectionInformation(query.context_json.directions ?? {});
		setNearbyPlacesMap(query.context_json.nearby_places ?? {});
		setCurrentInformation(
			query.context_json.current_information
				? {
						time: query.context_json.current_information.time
							? dayjs(query.context_json.current_information.time)
							: null,
						day: query.context_json.current_information.day,
						location:
							query.context_json.current_information.location,
				  }
				: {
						time: null,
						day: "",
						location: "",
				  }
		);
		setPoisMap(
			query.context_json.pois?.length > 0 ? query.context_json.pois : {}
		);
		setContext({
			places: ContextGeneratorService.getPlacesContext(
				query.context_json.places ?? {},
				savedPlacesMap
			),
			nearby: ContextGeneratorService.getNearbyContext(
				query.context_json.nearby_places ?? {},
				savedPlacesMap
			),
			area: ContextGeneratorService.getAreaContext(
				query.context_json.pois ?? {},
				savedPlacesMap
			),
			distance: ContextGeneratorService.getDistanceContext(
				query.context_json.distance_matrix ?? {},
				savedPlacesMap
			),
			direction: ContextGeneratorService.getDirectionContext(
				query.context_json.directions ?? {},
				savedPlacesMap
			),
			params: ContextGeneratorService.getParamsContext(
				query.context_json.current_information
					? {
							time: query.context_json.current_information.time
								? dayjs(
										query.context_json.current_information
											.time
								  )
								: null,
							day: query.context_json.current_information.day,
							location:
								query.context_json.current_information.location,
					  }
					: {
							time: null,
							day: "",
							location: "",
					  },
				savedPlacesMap
			),
		});
		setQuery(query);
		onEdit();
		// setLoading(false);
	};

	return (
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
	);
}
