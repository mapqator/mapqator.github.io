import mapApi from "@/api/mapApi";
import { AppContext } from "@/contexts/AppContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import { useContext, useState } from "react";

export default function PlaceAddButton({ place_id }) {
	const { selectedPlacesMap, setSelectedPlacesMap } =
		useContext(GlobalContext);
	const { savedPlacesMap, setSavedPlacesMap } = useContext(AppContext);
	const [loading, setLoading] = useState(false);
	const handleAddSave = async (place_id) => {
		// let details = undefined;
		setLoading(true);
		let details = savedPlacesMap[place_id];
		if (details === undefined) {
			const res = await mapApi.getDetails(place_id);
			if (res.success) {
				details = res.data.result;
				console.log(res.data.result);
				setSavedPlacesMap((prev) => ({
					...prev,
					[place_id]: details,
				}));
			} else {
				console.error("Error fetching data: ", res.error);
				showError(res.error);
				setLoading(false);
				return;
			}
		}
		handleAdd(details);
		setLoading(false);
	};

	const handleAdd = (details) => {
		const place_id = details["place_id"];
		if (place_id === "" || selectedPlacesMap[place_id]) return;
		setSelectedPlacesMap((prev) => ({
			...prev,
			[place_id]: {
				selectedAttributes: Object.keys(details).filter(
					(key) =>
						details[key] !== null &&
						key !== "place_id" &&
						key !== "name" &&
						key !== "last_updated" &&
						key !== "user_ratings_total" &&
						key !== "types" &&
						key !== "search_vector" &&
						key !== "vicinity"
				),
				attributes: Object.keys(details).filter(
					(key) =>
						details[key] !== null &&
						key !== "place_id" &&
						key !== "name" &&
						key !== "last_updated" &&
						key !== "user_ratings_total" &&
						key !== "types" &&
						key !== "search_vector" &&
						key !== "vicinity"
				),
			},
		}));
	};

	return (
		<LoadingButton
			startIcon={<Add />}
			onClick={() => handleAddSave(place_id)}
			disabled={selectedPlacesMap[place_id]}
			loading={loading}
		>
			Add
		</LoadingButton>
	);
}
