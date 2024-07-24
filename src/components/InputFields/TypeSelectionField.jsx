import placeTypes from "@/database/types.json";
import { Autocomplete, TextField } from "@mui/material";
import { convertFromSnake } from "@/services/utils";
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
			getOptionLabel={(option) => `${convertFromSnake(option)}`}
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
