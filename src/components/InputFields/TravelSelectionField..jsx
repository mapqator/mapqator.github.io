import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem } from "@mui/material";

export default function TravelSelectionField({ mode, setMode }) {
	return (
		<FormControl
			fullWidth
			className="input-field"
			variant="outlined"
			// style={{ width: "20rem" }}
			size="small"
		>
			<InputLabel htmlFor="outlined-adornment" className="input-label">
				Travel mode
			</InputLabel>
			<Select
				required
				id="outlined-adornment"
				className="outlined-input"
				value={mode}
				onChange={(event) => setMode(event.target.value)}
				input={<OutlinedInput label={"Travel mode"} />}
			>
				{[
					{ value: "WALK", label: "Walking" },
					{ value: "DRIVE", label: "Driving" },
					{ value: "BICYCLE", label: "Bicycling" },
					{ value: "TWO_WHEELER", label: "Two Wheeler" },
				].map((mode, index) => (
					<MenuItem key={index} value={mode.value}>
						{mode.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
