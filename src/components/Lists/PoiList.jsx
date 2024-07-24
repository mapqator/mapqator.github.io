"use client";

import React from "react";

import {
	Box,
	List,
	ListItem,
	ListItemText,
	Checkbox,
	Divider,
} from "@mui/material";
import PlaceAddButton from "../Buttons/PlaceAddButton";

export default function PoiList({ places, handleTogglePlace }) {
	return (
		<List dense>
			{places.map((place, index) => (
				<React.Fragment key={index}>
					<ListItem>
						<Box className="flex gap-1 justify-between w-full items-center">
							<Checkbox
								edge="start"
								checked={place.selected}
								onChange={(e) => handleTogglePlace(e, index)}
							/>
							<ListItemText
								primary={place.name}
								secondary={place.formatted_address}
								primaryTypographyProps={{ noWrap: true }}
								secondaryTypographyProps={{ noWrap: true }}
							/>
							<Box className="ml-auto">
								<PlaceAddButton place_id={place.place_id} />
							</Box>
						</Box>
					</ListItem>
					{index < places.length - 1 && <Divider component="li" />}
				</React.Fragment>
			))}
		</List>
	);
}
