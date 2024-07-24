import React, { useContext, useState } from "react";
import mapApi from "@/api/mapApi";
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import TypeSelectionField from "@/components/InputFields/TypeSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";

export default function AreaForm() {
	const [newPois, setNewPois] = useState({ location: "", type: "" });
	const [loading, setLoading] = useState(false);
	const { poisMap, setPoisMap } = useContext(GlobalContext);
	const searchInsidePlaces = async () => {
		if (newPois.location === "" || newPois.type === "") return;
		setLoading(true);
		const res = await mapApi.getInside({
			location: newPois.location,
			type: newPois.type,
		});
		if (res.success) {
			const places = res.data.results;
			const newPoisMap = { ...poisMap };
			if (newPoisMap[newPois.location] === undefined) {
				newPoisMap[newPois.location] = [];
			}

			const placesWithSelection = places.map((place) => ({
				selected: true,
				place_id: place.place_id,
				name: place.name,
				formatted_address: place.formatted_address,
			}));

			newPoisMap[newPois.location].push({
				type: newPois.type,
				places: placesWithSelection,
			});

			setPoisMap(newPoisMap);
			setLoading(false);
		} else {
			showError("Couldn't discover places in the area");
		}
		setLoading(false);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<PlaceSelectionField
					label="Location"
					value={newPois.location}
					onChange={(event) => {
						setNewPois((prev) => ({
							...prev,
							location: event.target.value,
						}));
					}}
				/>
			</Grid>
			<Grid item xs={12}>
				<TypeSelectionField
					type={newPois.type}
					setType={(newValue) =>
						setNewPois((prev) => ({
							...prev,
							type: newValue,
						}))
					}
				/>
			</Grid>

			<Grid item xs={12}>
				<LoadingButton
					variant="contained"
					fullWidth
					onClick={searchInsidePlaces}
					startIcon={<Search />}
					loading={loading}
					loadingPosition="start"
				>
					Search Places in Area
				</LoadingButton>
			</Grid>
		</Grid>
	);
}
