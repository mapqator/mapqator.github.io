import types from "@/database/newtypes.json";
import {
	Autocomplete,
	FormControl,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { convertFromSnake } from "@/services/utils";
import React from "react";

const placeTypes = [];
for (const category in types) {
	placeTypes.push(...types[category]);
}
// export default function TypeSelectionField({ type, setType }) {
// 	return (
// 		<Autocomplete
// 			disablePortal
// 			id="combo-box-demo"
// 			size="small"
// 			options={placeTypes.sort((a, b) =>
// 				a.localeCompare(b, "en", { sensitivity: "base" })
// 			)}
// 			fullWidth
// 			freeSolo
// 			value={type}
// 			getOptionLabel={(option) => `${convertFromSnake(option)}`}
// 			onChange={(e, newValue) => {
// 				setType(newValue);
// 			}}
// 			renderInput={(params) => (
// 				<TextField
// 					{...params}
// 					label="Type"
// 					value={type} // Step 3: Bind the value to state
// 					onChange={(e) => {
// 						setType(e.target.value);
// 					}}
// 				/>
// 			)}
// 		/>
// 	);
// }

// export default function TypeSelectionField({ type, setType }) {
// 	return (
// 		<FormControl fullWidth size="small" required>
// 			<InputLabel>Type</InputLabel>
// 			<Select
// 				value={type}
// 				onChange={(e) => setType(e.target.value)}
// 				label="Type"
// 			>
// 				{Object.entries(types).reduce((acc, [group, list]) => {
// 					acc.push(
// 						<ListSubheader key={`subheader-${group}`}>
// 							{group}
// 						</ListSubheader>
// 					);
// 					acc.push(
// 						...list.map((typeItem) => (
// 							<MenuItem
// 								key={typeItem}
// 								value={typeItem}
// 								sx={{ ml: 2 }}
// 							>
// 								{convertFromSnake(typeItem)}
// 							</MenuItem>
// 						))
// 					);
// 					return acc;
// 				}, [])}
// 			</Select>
// 		</FormControl>
// 	);
// }

export default function TypeSelectionField({ type, setType }) {
	const options = Object.entries(types).reduce((acc, [group, list]) => {
		acc.push(
			...list.map((typeItem) => ({
				label: convertFromSnake(typeItem),
				group: group,
				value: typeItem,
			}))
		);
		return acc;
	}, []);

	return (
		<Autocomplete
			value={options.find((option) => option.value === type) || null}
			onChange={(e, newValue) => setType(newValue?.value || "")}
			options={options}
			groupBy={(option) => option.group}
			getOptionLabel={(option) => option.label}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Type"
					variant="outlined"
					size="small"
					required
					fullWidth
				/>
			)}
			isOptionEqualToValue={(option, value) =>
				convertFromSnake(option.value) === value.value
			}
		/>
	);
}
