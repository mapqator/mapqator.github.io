import { Select, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

export default function DaySelectionField({ value, onChange, label }) {
	return (
		<FormControl
			fullWidth
			className="input-field"
			variant="outlined"
			// style={{ width: "20rem" }}
			size="small"
		>
			<InputLabel htmlFor="outlined-adornment" className="input-label">
				{label}
			</InputLabel>
			<Select
				required
				id="outlined-adornment"
				className="outlined-input"
				value={value}
				onChange={onChange}
				input={<OutlinedInput label={label} />}
				// MenuProps={MenuProps}
			>
				{[
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
				].map((week_day, index) => (
					<MenuItem key={index} value={week_day}>
						{week_day}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
