"use client";

import React, { useContext, useEffect, useState } from "react";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import { CardContent, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import AreaCard from "./AreaCard";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import TypeSelectionField from "@/components/InputFields/TypeSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function DiscoverArea() {
	const [newPois, setNewPois] = useState({ location: "", type: "" });
	const [loading, setLoading] = useState(false);
	const {
		savedPlacesMap,
		setSavedPlacesMap,
		selectedPlacesMap,
		poisMap,
		setSelectedPlacesMap,
		setPoisMap,
	} = useContext(GlobalContext);

	const searchInsidePlaces = async () => {
		if (newPois.location === "" || newPois.type === "") return;

		setLoading(true);
		try {
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
			}
		} catch (error) {
			// console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};

	return (
		<CardContent>
			<div className="flex flex-col gap-1 ">
				{Object.keys(poisMap).map((place_id, index1) => (
					<div key={index1} className="flex flex-col gap-1 ">
						{poisMap[place_id].map((poi, index2) => (
							<AreaCard
								key={index2}
								selectedPlacesMap={selectedPlacesMap}
								savedPlacesMap={savedPlacesMap}
								setSavedPlacesMap={setSavedPlacesMap}
								poi={poi}
								poisMap={poisMap}
								setPoisMap={setPoisMap}
								index2={index2}
								place_id={place_id}
								setSelectedPlacesMap={setSelectedPlacesMap}
							/>
						))}
					</div>
				))}
			</div>
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
		</CardContent>
	);
}
