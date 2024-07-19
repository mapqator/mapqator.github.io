"use client";

import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select, MenuItem } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function PlaceSelectionField({
	label,
	onChange,
	value,
	multiple,
}) {
	const { selectedPlacesMap, savedPlacesMap } = useContext(GlobalContext);
	return (
		<FormControl fullWidth size="small">
			<InputLabel>{label}</InputLabel>
			<Select
				value={value}
				onChange={onChange}
				label={label}
				multiple={multiple}
			>
				{Object.keys(selectedPlacesMap).map((place_id) => (
					<MenuItem key={place_id} value={place_id}>
						{savedPlacesMap[place_id].name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
