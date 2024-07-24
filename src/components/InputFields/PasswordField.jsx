import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, TextField } from "@mui/material";
import EyeIcon from "../Icons/EyeIcon";
import { useState } from "react";

export default function MuiPasswordField({ placeholder, value, onChange }) {
	const [showPassword, setShowPassword] = useState(false);
	return (
		<TextField
			required
			placeholder={placeholder}
			type={showPassword ? "text" : "password"}
			value={value}
			onChange={onChange}
			size="small"
			fullWidth
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<FontAwesomeIcon icon={faLock} />
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						<EyeIcon
							isVisible={value.length > 0}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
					</InputAdornment>
				),
			}}
		/>
	);
}
