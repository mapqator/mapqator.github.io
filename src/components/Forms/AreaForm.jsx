import React, { useContext, useState } from "react";
import mapApi from "@/api/mapApi";
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import TypeSelectionField from "@/components/InputFields/TypeSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/contexts/ToastProvider";
import AreaSelectionField from "../InputFields/AreaSelectionField";
import { AppContext } from "@/contexts/AppContext";

export default function AreaForm() {
	const [newPois, setNewPois] = useState({ location: "", type: "" });
	const [loading, setLoading] = useState(false);
	const { poisMap, setPoisMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
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
				<AreaSelectionField
					label="Place"
					value={newPois.location}
					onChange={(event) => {
						setNewPois((prev) => ({
							...prev,
							location: event.target.value,
						}));
					}}
				/>
			</Grid>
			{newPois.location && (
				<Grid item xs={12}>
					<iframe
						width="100%"
						height="450"
						// style="border:0"
						style={{
							border: 0,
						}}
						loading="lazy"
						allowfullscreen
						referrerpolicy="no-referrer-when-downgrade"
						src={
							"https://www.google.com/maps/embed/v1/place?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&language=en&q=place_id:" +
							newPois.location
						}
					></iframe>
				</Grid>
			)}
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
			{newPois.location && newPois.type && (
				<Grid item xs={12}>
					<iframe
						width="100%"
						height="450"
						// style="border:0"
						style={{
							border: 0,
						}}
						loading="lazy"
						allowfullscreen
						referrerpolicy="no-referrer-when-downgrade"
						src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&language=en&q=${
							newPois.type
						}s in ${savedPlacesMap[newPois.location].name}`}
					></iframe>
				</Grid>
			)}
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
