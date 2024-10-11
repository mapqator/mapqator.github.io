import { Box, Grid } from "@mui/material";
import PlaceSelectionField from "../InputFields/PlaceSelectionField";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/contexts/AppContext";
import { GlobalContext } from "@/contexts/GlobalContext";
import mapApi from "@/api/mapApi";
import textualFields from "@/database/textualFields.json";
import { showError } from "@/contexts/ToastProvider";

export default function PlacesForm({ handlePlaceAdd }) {
	const [placeId, setPlaceId] = useState();
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		setApiCallLogs,
		savedPlacesMap,
		tools,
	} = useContext(GlobalContext);
	const [loading, setLoading] = useState(false);

	const [mapsApi, setMapsApi] = useState(null);
	useEffect(() => {
		const loadMapsApi = async () => {
			const mapsModule = await import(
				process.env.NEXT_PUBLIC_MAPS_API_PATH
			);
			setMapsApi(mapsModule.default);
		};

		loadMapsApi();
	}, []);

	const handleAddSave = async (place_id) => {
		setLoading(true);
		let details = savedPlacesMap[place_id];
		const res = await tools.placeDetails.run(details);
		if (res.success) {
			details = res.data.result;
			setSelectedPlacesMap((prev) => ({
				...prev,
				[place_id]: { ...details, uuid: res.data.uuid },
			}));
			setApiCallLogs((prev) => [...prev, ...res.data.apiCallLogs]);
		} else {
			showError(res.error);
			setLoading(false);
			return;
		}
		// handleAdd(details);
		setLoading(false);
	};

	if (!mapsApi) {
		return <div>Loading...</div>;
	}

	return (
		<Box className="w-full md:w-[30rem] mx-auto">
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<PlaceSelectionField
						label="Place"
						onChange={(event) => {
							setPlaceId(event.target.value);
						}}
						value={placeId}
						handlePlaceAdd={handlePlaceAdd}
					/>
				</Grid>
				<Grid item xs={12}>
					<LoadingButton
						variant="contained"
						fullWidth
						onClick={() => handleAddSave(placeId)}
						startIcon={<Add />}
						loading={loading}
						loadingPosition="start"
						disabled={!placeId || selectedPlacesMap[placeId]}
					>
						Add Place
					</LoadingButton>
				</Grid>
			</Grid>
		</Box>
	);
}
