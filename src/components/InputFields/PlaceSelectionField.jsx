import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Select, MenuItem, Box, Chip } from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";

export default function PlaceSelectionField({
	label,
	onChange,
	value,
	multiple,
	handlePlaceAdd,
}) {
	const { selectedPlacesMap } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);

	return (
		<>
			<FormControl fullWidth size="small" required>
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
												label={
													savedPlacesMap[value]
														.displayName.text
												}
												size="small"
											/>
										))}
									</Box>
							  )
							: undefined
					}
				>
					{Object.keys(selectedPlacesMap).map((place_id) => (
						<MenuItem key={place_id} value={place_id}>
							{savedPlacesMap[place_id].displayName.text}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<h6 className="px-2  text-sm">
				If your desired place is not listed here, you need to{" "}
				<a
					className="underline font-semibold cursor-pointer hover:text-blue-500"
					onClick={handlePlaceAdd}
				>
					add it
				</a>{" "}
				first.
			</h6>
		</>
	);
}
