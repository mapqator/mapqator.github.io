import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, TextField } from "@mui/material";

export default function UserNameField({ value, onChange, placeholder }) {
	return (
		<TextField
			required
			placeholder={placeholder}
			type="text"
			value={value}
			onChange={onChange}
			// label={props.label}
			size="small"
			fullWidth
			variant="outlined"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<FontAwesomeIcon icon={faUser} />
					</InputAdornment>
				),
			}}
		/>
	);
}
