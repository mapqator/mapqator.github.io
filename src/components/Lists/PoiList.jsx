"use client";

import React, { useContext } from "react";

import {
	Box,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	Divider,
	Button,
} from "@mui/material";
import PlaceAddButton from "../Buttons/PlaceAddButton";
import { Directions } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import dayjs from "dayjs";
import { template } from "@/database/templates";

export default function PoiList({
	places,
	// handleTogglePlace,
	mode,
	locationBias,
}) {
	const { setNewDirection, setActiveStep } = useContext(GlobalContext);
	console.log("Places:", places);
	return (
		<List dense>
			{places.map((place, index) => (
				<React.Fragment key={index}>
					<ListItem>
						<Box className="flex gap-1 justify-between w-full items-center">
							{/* {mode === "edit" && (
								<Checkbox
									edge="start"
									checked={place.selected}
									onChange={(e) =>
										handleTogglePlace(e, index)
									}
								/>
							)} */}
							<ListItemText
								primary={place.displayName?.text}
								secondary={`${
									place.rating
										? place.rating +
										  "*" +
										  " (" +
										  place.userRatingCount +
										  ")"
										: ""
								} ${
									place.priceLevel
										? `| ${template["priceLevel"](
												place.priceLevel
										  )}`
										: ""
								}`}
								primaryTypographyProps={{ noWrap: true }}
								secondaryTypographyProps={{ noWrap: true }}
							/>
							{/* {mode === "edit" && (
								<Box className="ml-auto">
									<PlaceAddButton place_id={place.place_id} />
								</Box>
							)} */}
							{mode === "edit" && locationBias && (
								<Button
									variant="outlined"
									onClick={() => {
										setNewDirection((prev) => ({
											...prev,
											origin: locationBias,
											destination: place.id,
										}));
										setActiveStep(4);
									}}
									sx={{
										borderRadius: "50%",
										height: "45px",
										width: "45px",
										minWidth: "45px",
										padding: 0,
									}}
								>
									<Directions />
								</Button>
							)}
						</Box>
					</ListItem>
					<Divider component="li" />
				</React.Fragment>
			))}
		</List>
	);
}
