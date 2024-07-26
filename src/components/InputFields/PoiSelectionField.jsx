import React, { useContext, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select, MenuItem, Box, Chip } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import areaTypes from "@/database/area.json";
export default function PoiSelectionField({
	label,
	onChange,
	value,
	multiple,
}) {
	const { selectedPlacesMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);

	useEffect(() => {
		console.log(areaTypes);
	}, []);
	return (
		<FormControl fullWidth size="small">
			<InputLabel>{label}</InputLabel>
			<Select
				value={value}
				onChange={onChange}
				label={label}
				multiple={multiple}
				renderValue={
					multiple
						? (selected) => (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.5,
									}}
								>
									{selected.map((value) => (
										<Chip
											key={value}
											label={savedPlacesMap[value].name}
											size="small"
										/>
									))}
								</Box>
						  )
						: undefined
				}
			>
				{Object.keys(selectedPlacesMap)
					.filter(
						(place_id) =>
							!areaTypes.some((type) =>
								savedPlacesMap[place_id].types.includes(type)
							)
					)
					.map((place_id) => (
						<MenuItem key={place_id} value={place_id}>
							{savedPlacesMap[place_id].name}
						</MenuItem>
					))}
			</Select>
		</FormControl>
	);
}
