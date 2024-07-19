"use client";

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
				Travel by
			</InputLabel>
			<Select
				required
				id="outlined-adornment"
				className="outlined-input"
				value={mode}
				onChange={(event) => setMode(event.target.value)}
				input={<OutlinedInput label={"Travel by"} />}
			>
				{[
					{ value: "walking", label: "Foot" },
					{ value: "driving", label: "Car" },
					{ value: "bicycling", label: "Cycle" },
					{ value: "transit", label: "Public Transport" },
				].map((mode, index) => (
					<MenuItem key={index} value={mode.value}>
						{mode.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
