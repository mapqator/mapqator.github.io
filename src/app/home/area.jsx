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
	CardContent,
	Grid,
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
import { Add, CheckBox, Delete, ExpandMore, Search } from "@mui/icons-material";

function POICard({
	selectedPlacesMap,
	savedPlacesMap,
	setSavedPlacesMap,
	poi,
	poisMap,
	setPoisMap,
	index2,
	place_id,
	setSelectedPlacesMap,
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
	return (
		<Card variant="outlined" sx={{ mb: 2 }}>
			<CardContent>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="h6" component="div">
						{savedPlacesMap[place_id]?.name}
					</Typography>

					<Box>
						<IconButton
							onClick={() => {
								const newPoisMap = {
									...poisMap,
								};
								newPoisMap[place_id].splice(index2, 1);
								if (newPoisMap[place_id].length === 0)
									delete newPoisMap[place_id];
								setPoisMap(newPoisMap);
							}}
							size="small"
						>
							<Delete color="error" />
						</IconButton>
						<IconButton
							onClick={() => setExpanded((prev) => !prev)}
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
					<Chip label={poi.type} color="primary" size="small" />
					<Chip
						label={
							poisMap[place_id]
								? poisMap[place_id][index2].places.filter(
										(place) => place.selected
								  ).length
								: 0
						}
						color="secondary"
						size="small"
					/>
				</Box>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<List dense>
					{poi.places?.map((place, index3) => (
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
									<CheckBox
										edge="start"
										checked={place.selected}
										onChange={(event) => {
											const newPoisMap = {
												...poisMap,
											};
											newPoisMap[place_id][index2].places[
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
							{index3 < poi.places.length - 1 && (
								<Divider variant="inset" component="li" />
							)}
						</React.Fragment>
					))}
				</List>
			</Collapse>
		</Card>
	);
}

export function DiscoverArea({
	savedPlacesMap,
	setSavedPlacesMap,
	selectedPlacesMap,
	poisMap,
	setSelectedPlacesMap,
	setPoisMap,
}) {
	const [newPois, setNewPois] = useState({ location: "", type: "" });
	const [loading, setLoading] = useState(false);
	// useEffect(() => {
	// 	console.log(selectedPlacesMap);
	// }, [selectedPlacesMap]);

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
				// const newSavedPlacesMap = { ...savedPlacesMap };
				// for (const place of results) {
				// 	if (newSavedPlacesMap[place.place_id] === undefined) {
				// 		try {
				// 			const res2 = await mapApi.getDetails(
				// 				place.place_id
				// 			);
				// 			if (res2.success) {
				// 				newSavedPlacesMap[place.place_id] =
				// 					res2.data[0];
				// 				console.log("saved: ", res.data[0].place_id);
				// 			}
				// 		} catch (error) {
				// 			console.error(error);
				// 		}
				// 	}
				// }
				// setSavedPlacesMap(newSavedPlacesMap);
			}
		} catch (error) {
			// console.error("Error fetching data: ", error);
		}
		setLoading(false);
	};

	return (
		<CardContent>
			{Object.keys(poisMap).length > 0 && (
				<div key={index1} className="flex flex-col gap-1 ">
					{Object.keys(poisMap).map((place_id, index1) => (
						<div key={index1} className="flex flex-col gap-1 ">
							{poisMap[place_id].map((poi, index2) => (
								<POICard
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
			)}

			{/* <POICard
				selectedPlacesMap={selectedPlacesMap}
				savedPlacesMap={savedPlacesMap}
				setSavedPlacesMap={setSavedPlacesMap}
				poi={{
					type: "atm",
					places: [
						{
							place_id: 1,
							name: "Demo Name",
							formatted_address: "Demo Address",
							selected: true,
						},
					],
				}}
				poisMap={poisMap}
				setPoisMap={setPoisMap}
				index2={1}
				place_id={1}
				setSelectedPlacesMap={setSelectedPlacesMap}
			/> */}

			<Grid container spacing={2}>
				<Grid item xs={12}>
					<FormControl
						fullWidth
						className="input-field"
						variant="outlined"
						// style={{ width: "20rem" }}
						size="small"
					>
						<InputLabel
							htmlFor="outlined-adornment"
							className="input-label"
						>
							Location
						</InputLabel>
						<Select
							required
							id="outlined-adornment"
							className="outlined-input"
							value={newPois.location}
							onChange={(event) => {
								setNewPois((prev) => ({
									...prev,
									location: event.target.value,
								}));
							}}
							input={<OutlinedInput label={"Location"} />}
							// MenuProps={MenuProps}
						>
							{Object.keys(selectedPlacesMap).map(
								(place_id, index) => (
									<MenuItem key={index} value={place_id}>
										{savedPlacesMap[place_id].name ||
											selectedPlacesMap[place_id].alias}
									</MenuItem>
								)
							)}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Autocomplete
						disablePortal
						id="combo-box-demo"
						size="small"
						options={placeTypes}
						fullWidth
						value={newPois.type}
						freeSolo
						getOptionLabel={(option) =>
							`${option
								.replace(/_/g, " ") // Replace underscores with spaces
								.split(" ") // Split the string into an array of words
								.map(
									(word) =>
										word.charAt(0).toUpperCase() +
										word.slice(1)
								) // Capitalize the first letter of each word
								.join(" ")}`
						}
						onChange={(e, newValue) => {
							setNewPois((prev) => ({
								...prev,
								type: newValue,
							}));
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Type"
								value={newPois.type} // Step 3: Bind the value to state
								onChange={(e) => {
									setNewPois((prev) => ({
										...prev,
										type: e.target.value,
									}));
								}}
							/>
						)}
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
