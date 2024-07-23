"use client";

import React, { useContext, useEffect, useState } from "react";
import MapApi from "@/api/mapApi";
const mapApi = new MapApi();
import {
	IconButton,
	CardContent,
	ListItem,
	List,
	Collapse,
	ListItemIcon,
	ListItemText,
	Typography,
	Box,
	Card,
	Chip,
	Divider,
	Checkbox,
	Button,
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function AreaCard({ entry, index, place_id }) {
	const [expanded, setExpanded] = useState(false);
	const {
		selectedPlacesMap,
		savedPlacesMap,
		setSavedPlacesMap,
		poisMap,
		setPoisMap,
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
	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<Box
					display="flex"
					justifyContent="space-between"
					// alignItems="center"
					className="gap-1"
				>
					<Typography variant="h6" component="div">
						{savedPlacesMap[place_id]?.name}
					</Typography>

					<Box className="flex flex-col items-end">
						<IconButton
							onClick={() => {
								const newPoisMap = {
									...poisMap,
								};
								newPoisMap[place_id].splice(index, 1);
								if (newPoisMap[place_id].length === 0)
									delete newPoisMap[place_id];
								setPoisMap(newPoisMap);
							}}
							size="small"
						>
							<Delete color="error" />
						</IconButton>
					</Box>
				</Box>
				<Box display="flex" justifyContent="space-between">
					<Box display="flex" flexWrap="wrap" gap={1} mt={1}>
						<Chip label={entry.type} color="primary" size="small" />
						<Chip
							label={
								(poisMap[place_id]
									? poisMap[place_id][index].places.filter(
											(place) => place.selected
									  ).length
									: 0) + " POIs"
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
					{entry.places?.map((place, index3) => (
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
										onChange={(event) => {
											const newPoisMap = {
												...poisMap,
											};
											newPoisMap[place_id][index].places[
												index3
											].selected = event.target.checked;
											setPoisMap(newPoisMap);
										}}
									/>
								</ListItemIcon>
								<ListItemText
									primary={place.name}
									secondary={place.formatted_address}
									primaryTypographyProps={{
										noWrap: true,
									}}
									secondaryTypographyProps={{
										noWrap: true,
									}}
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
