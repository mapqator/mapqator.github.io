"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	Select,
	MenuItem,
	Button,
	TextField,
	IconButton,
	Typography,
	Card,
	CardActionArea,
	Grid,
	CardContent,
	FormControlLabel,
	RadioGroup,
	Radio,
	Box,
	Collapse,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Checkbox,
	Chip,
	Divider,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faTrashCan,
	faAdd,
} from "@fortawesome/free-solid-svg-icons";
import placeTypes from "@/app/types.json";
import Autocomplete from "@mui/material/Autocomplete";
import { LoadingButton } from "@mui/lab";
import { Add, Delete, ExpandMore, Search } from "@mui/icons-material";
import NearbyCard from "./NearbyCard";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import NearbyForm from "./NearbyForm";
import ContextViewer from "../ContextPreview";

export default function NearbyInfo({
	savedPlacesMap,
	selectedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	setSavedPlacesMap,
	setSelectedPlacesMap,
}) {
	const [context, setContext] = useState([]);
	useEffect(() => {
		const newContext = [];
		Object.keys(nearbyPlacesMap).forEach((place_id, index) => {
			nearbyPlacesMap[place_id].forEach((e) => {
				newContext.push(
					`Nearby places of ${
						// selectedPlacesMap[place_id].alias ||
						savedPlacesMap[place_id].name
					} ${e.type === "any" ? "" : 'of type "' + e.type + '"'} ${
						e.keyword !== ""
							? 'with keyword "' + e.keyword + '"'
							: ""
					} are (${
						e.hasRadius
							? "in " + e.radius + " m radius"
							: "sorted by distance in ascending order"
					}):`
				);
				let counter = 1;
				e.places.forEach((near_place) => {
					if (near_place.selected) {
						newContext.push(
							`${counter}. <b>${
								// selectedPlacesMap[near_place.place_id]?.alias ||
								savedPlacesMap[near_place.place_id]?.name ||
								near_place.name
							}</b> (${
								near_place.formatted_address ||
								savedPlacesMap[near_place.place_id]?.vicinity
							})`
						);
						counter++;
					}
				});

				newContext.push("\n");
			});
		});
		setContext(newContext);
	}, [nearbyPlacesMap]);
	return (
		// <Card raised>
		<CardContent>
			{Object.keys(nearbyPlacesMap).map((place_id, index1) => (
				<div key={index1} className="flex flex-col gap-1 ">
					{nearbyPlacesMap[place_id].map((e, index2) => (
						<NearbyCard
							key={index2}
							{...{
								index2,
								selectedPlacesMap,
								savedPlacesMap,
								setSavedPlacesMap,
								nearbyPlacesMap,
								setNearbyPlacesMap,
								place_id,
								setSelectedPlacesMap,
								e,
							}}
						/>
					))}
				</div>
			))}
			<NearbyForm />
			<Divider sx={{ mt: 3 }} />
			<ContextViewer context={context} />
		</CardContent>
		// </Card>
	);
}
