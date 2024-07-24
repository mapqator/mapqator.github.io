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
