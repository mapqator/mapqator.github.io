"use client";

import React, { useContext, useEffect, useState } from "react";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import {
	IconButton,
	Typography,
	Card,
	CardContent,
	Box,
	Collapse,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Checkbox,
	Chip,
	Divider,
	Button,
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function NearbyCard({ index, place_id, entry }) {
	const [expanded, setExpanded] = useState(false);

	const {
		selectedPlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
		nearbyPlacesMap,
		setNearbyPlacesMap,
		setSelectedPlacesMap,
	} = useContext(GlobalContext);

	const handleAddSave = async (place_id) => {
		let details = selectedPlacesMap[place_id];
		if (details === undefined) {
			details = savedPlacesMap[place_id];
			if (details === undefined) {
				const res = await mapApi.getDetails(place_id);
				if (res.success) {
					details = res.data.result;
					setSavedPlacesMap((prev) => ({
						...prev,
						[place_id]: details,
					}));
				} else {
					console.error("Error fetching data: ", res.error);
					return;
				}
			}
			handleAdd(details);
		} else {
			console.log("Already saved: ", details);
		}
		return details;
	};

	const handleAdd = (details) => {
		const place_id = details["place_id"];
		if (place_id === "" || selectedPlacesMap[place_id]) return;
		setSelectedPlacesMap((prev) => ({
			...prev,
			[place_id]: {
				alias: "",
				selectedAttributes: ["formatted_address"],
				attributes: Object.keys(details).filter(
					(key) => details[key] !== null
				),
			},
		}));
	};

	const handleDelete = () => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		newNearbyPlacesMap[place_id].splice(index, 1);
		if (newNearbyPlacesMap[place_id].length === 0)
			delete newNearbyPlacesMap[place_id];
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	const handleTogglePlace = (index3) => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		newNearbyPlacesMap[place_id][index].places[index3].selected =
			!newNearbyPlacesMap[place_id][index].places[index3].selected;
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="start"
					className="gap-1"
				>
					<Typography variant="h6" component="div">
						{savedPlacesMap[place_id].name ||
							selectedPlacesMap[place_id].alias}
					</Typography>
					<Box className="flex flex-col items-end justify-start">
						<IconButton onClick={handleDelete} size="small">
							<Delete color="error" />
						</IconButton>
					</Box>
				</Box>
				<Box display="flex" justifyContent="space-between">
					<Box display="flex" flexWrap="wrap" gap={1} mt={1}>
						<Chip
							label={entry.type === "any" ? entry.keyword : entry.type}
							color="primary"
							size="small"
						/>
						<Chip
							label={
								entry.rankBy === "prominence"
									? `${entry.radius} m`
									: "Distance"
							}
							color="secondary"
							size="small"
						/>
					</Box>
					<IconButton
						size="small"
						sx={{
							transform: expanded
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "0.3s",
						}}
					>
						<ExpandMore />
					</IconButton>
				</Box>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<List dense>
					{entry.places.map((place, index3) => (
						<React.Fragment key={index3}>
							<ListItem
								secondaryAction={
									<Button
										startIcon={<Add />}
										onClick={() =>
											handleAddSave(place.place_id)
										}
										disabled={
											selectedPlacesMap[place.place_id]
										}
									>
										Add
									</Button>
								}
							>
								<ListItemIcon>
									<Checkbox
										edge="start"
										checked={place.selected}
										onChange={() =>
											handleTogglePlace(index3)
										}
									/>
								</ListItemIcon>
								<ListItemText
									primary={place.name}
									secondary={place.formatted_address}
									primaryTypographyProps={{ noWrap: true }}
									secondaryTypographyProps={{ noWrap: true }}
								/>
							</ListItem>
							{index3 < entry.places.length - 1 && (
								<Divider variant="inset" component="li" />
							)}
						</React.Fragment>
					))}
				</List>
			</Collapse>
		</Card>
	);
}
