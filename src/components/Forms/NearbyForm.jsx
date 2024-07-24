"use client";

import React, { useEffect, useState } from "react";
import mapApi from "@/api/mapApi";
import {
	TextField,
	Grid,
	FormControlLabel,
	RadioGroup,
	Radio,
} from "@mui/material";
import placeTypes from "@/database/types.json";
import { LoadingButton } from "@mui/lab";
import { Search } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { GlobalContext } from "@/contexts/GlobalContext";
import { useContext } from "react";
import TypeSelectionField from "@/components/InputFields/TypeSelectionField";
import { AppContext } from "@/contexts/AppContext";

export default function NearbyForm() {
	const { selectedPlacesMap, nearbyPlacesMap, setNearbyPlacesMap } =
		useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);

	const [newNearbyPlaces, setNewNearbyPlaces] = useState({
		location: "",
		type: "",
		keyword: "",
		radius: 1000,
		rankBy: "distance",
	});
	useEffect(() => {
		setNewNearbyPlaces((prev) => ({
			location: "",
			type: "",
			keyword: "",
			radius: 1000,
			rankBy: "distance",
		}));
	}, [selectedPlacesMap]);
	const [loading, setLoading] = useState(false);
	const searchNearbyPlaces = async () => {
		if (newNearbyPlaces.location === "" || newNearbyPlaces.type === "")
			return;
		setLoading(true);
		try {
			const loc =
				savedPlacesMap[newNearbyPlaces.location].geometry.location;
			const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
			const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
			if (!placeTypes.includes(newNearbyPlaces.type)) {
				newNearbyPlaces.keyword = newNearbyPlaces.type;
				newNearbyPlaces.type = "";
			}

			const response = await mapApi.getNearby({
				location: newNearbyPlaces.location,
				lat,
				lng,
				radius: newNearbyPlaces.radius,
				type: newNearbyPlaces.type,
				keyword: newNearbyPlaces.keyword,
				rankBy: newNearbyPlaces.rankBy,
			});
			if (response.success) {
				const places = response.data.results;
				console.log("Nearby Places: ", response.data);
				const newNearbyPlacesMap = { ...nearbyPlacesMap };
				if (
					newNearbyPlacesMap[newNearbyPlaces.location] === undefined
				) {
					newNearbyPlacesMap[newNearbyPlaces.location] = [];
				}

				const placesWithSelection = places.map((place) => ({
					selected: true,
					place_id: place.place_id,
					name: place.name,
					formatted_address: place.vicinity,
				}));

				newNearbyPlacesMap[newNearbyPlaces.location].push({
					type: placeTypes.includes(newNearbyPlaces.type)
						? newNearbyPlaces.type
						: "any",
					places: placesWithSelection,
					keyword: placeTypes.includes(newNearbyPlaces.type)
						? ""
						: newNearbyPlaces.keyword,
					radius: newNearbyPlaces.radius,
					rankBy: newNearbyPlaces.rankBy,
				});

				setNearbyPlacesMap(newNearbyPlacesMap);
				console.log("Update Nearby Places: ", {
					...newNearbyPlaces,
					type: "",
					keyword: "",
				});
				setNewNearbyPlaces((prev) => ({
					...prev,
					type: "",
					keyword: "",
				}));

				setLoading(false);
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<PlaceSelectionField
					label="Location"
					onChange={(e) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							location: e.target.value,
						}))
					}
					value={newNearbyPlaces.location}
				/>
			</Grid>
			<Grid item xs={12}>
				<TypeSelectionField
					type={newNearbyPlaces.type}
					setType={(newValue) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							type: newValue,
						}))
					}
				/>
			</Grid>
			<Grid item xs={12}>
				<RadioGroup
					row
					value={newNearbyPlaces.rankBy}
					onChange={(e) =>
						setNewNearbyPlaces((prev) => ({
							...prev,
							rankBy: e.target.value,
						}))
					}
				>
					<FormControlLabel
						value="distance"
						control={<Radio />}
						label="Rank by Distance"
					/>
					<FormControlLabel
						value="prominence"
						control={<Radio />}
						label="Rank by Prominence"
					/>
				</RadioGroup>
			</Grid>
			{newNearbyPlaces.rankBy === "prominence" && (
				<Grid item xs={12}>
					<TextField
						fullWidth
						size="small"
						label="Radius (meters)"
						type="number"
						value={newNearbyPlaces.radius}
						onChange={(e) =>
							setNewNearbyPlaces((prev) => ({
								...prev,
								radius: e.target.value,
							}))
						}
					/>
				</Grid>
			)}
			<Grid item xs={12}>
				<LoadingButton
					variant="contained"
					fullWidth
					onClick={searchNearbyPlaces}
					startIcon={<Search />}
					loading={loading}
					loadingPosition="start"
				>
					Search Nearby Places
				</LoadingButton>
			</Grid>
		</Grid>
	);
}
