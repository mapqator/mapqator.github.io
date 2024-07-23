"use client";
import placeTypes from "@/database/types.json";
import { Autocomplete, TextField } from "@mui/material";
export default function TypeSelectionField({ type, setType }) {
	return (
		<Autocomplete
			disablePortal
			id="combo-box-demo"
			size="small"
			options={placeTypes}
			fullWidth
			freeSolo
			value={type}
			getOptionLabel={(option) =>
				`${option
					.replace(/_/g, " ") // Replace underscores with spaces
					.split(" ") // Split the string into an array of words
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
					.join(" ")}`
			}
			onChange={(e, newValue) => {
				setType(newValue);
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Type"
					value={type} // Step 3: Bind the value to state
					onChange={(e) => {
						setType(e.target.value);
					}}
				/>
			)}
		/>
	);
}
