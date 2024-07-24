import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

export default function TimeSelectionField({ value, onChange, label }) {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DemoContainer components={["TimePicker"]}>
				<TimePicker
					label={label}
					value={value}
					onChange={onChange}
					slotProps={{
						textField: {
							fullWidth: true,
							size: "small",
						},
					}}
				/>
			</DemoContainer>
		</LocalizationProvider>
	);
}
