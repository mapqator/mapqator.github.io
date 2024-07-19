"use client";

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";

export default function NearbyCard({
	index2,
	selectedPlacesMap,
	savedPlacesMap,
	setSavedPlacesMap,
	nearbyPlacesMap,
	setNearbyPlacesMap,
	setSelectedPlacesMap,
	place_id,
	e,
}) {
	const [expanded, setExpanded] = useState(false);

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
		newNearbyPlacesMap[place_id].splice(index2, 1);
		if (newNearbyPlacesMap[place_id].length === 0)
			delete newNearbyPlacesMap[place_id];
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	const handleTogglePlace = (index3) => {
		const newNearbyPlacesMap = { ...nearbyPlacesMap };
		newNearbyPlacesMap[place_id][index2].places[index3].selected =
			!newNearbyPlacesMap[place_id][index2].places[index3].selected;
		setNearbyPlacesMap(newNearbyPlacesMap);
	};

	return (
		<Card variant="outlined" sx={{ mb: 2 }}>
			<CardContent>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					className="gap-1"
				>
					<Typography variant="h6" component="div">
						{savedPlacesMap[place_id].name ||
							selectedPlacesMap[place_id].alias}
					</Typography>
					<Box className="flex flex-col items-end">
						<IconButton onClick={handleDelete} size="small">
							<Delete color="error" />
						</IconButton>
						<IconButton
							onClick={() => setExpanded(!expanded)}
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
				</Box>
				<Box display="flex" flexWrap="wrap" gap={1} mt={1}>
					<Chip
						label={e.type === "any" ? e.keyword : e.type}
						color="primary"
						size="small"
					/>
					<Chip
						label={
							e.rankBy === "prominence"
								? `${e.radius} m`
								: "Distance"
						}
						color="secondary"
						size="small"
					/>
				</Box>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<List dense>
					{e.places.map((place, index3) => (
						<React.Fragment key={index3}>
							<ListItem
								secondaryAction={
									<IconButton
										edge="end"
										onClick={() =>
											handleAddSave(place.place_id)
										}
										size="small"
									>
										<Add />
									</IconButton>
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
							{index3 < e.places.length - 1 && (
								<Divider variant="inset" component="li" />
							)}
						</React.Fragment>
					))}
				</List>
			</Collapse>
		</Card>
	);
}
