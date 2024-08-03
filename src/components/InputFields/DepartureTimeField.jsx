import React, { useState, useEffect } from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Grid,
	Box,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
	LocalizationProvider,
	DatePicker,
	TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";

const DepartureTimeField = ({ value, onChange }) => {
	const [internalState, setInternalState] = useState({
		type: "now",
		date: dayjs(),
		time: dayjs(),
	});

	useEffect(() => {
		setInternalState({
			type: value.type,
			date: dayjs(value.date),
			time: dayjs(value.time),
		});
	}, [value]);

	const updateParent = (newState) => {
		const combinedDate = newState.date
			.hour(newState.time.hour())
			.minute(newState.time.minute());
		onChange({
			...newState,
			departureTimestamp: combinedDate.toDate(),
		});
	};

	const handleTypeChange = (e) => {
		const newState = { ...internalState, type: e.target.value };
		setInternalState(newState);
		updateParent(newState);
	};

	const handleDateChange = (newDate) => {
		const newState = { ...internalState, date: newDate };
		setInternalState(newState);
		updateParent(newState);
	};

	const handleTimeChange = (newTime) => {
		const newState = { ...internalState, time: newTime };
		setInternalState(newState);
		updateParent(newState);
	};

	return (
		<FormControl fullWidth>
			<InputLabel>Departure Time</InputLabel>
			<Box className="flex flex-col gap-4">
				<Select
					value={internalState.type}
					label="Departure Time"
					onChange={handleTypeChange}
					size="small"
				>
					<MenuItem value="now">Leave now</MenuItem>
					<MenuItem value="depart">Depart by</MenuItem>
					<MenuItem value="arrive">Arrive at</MenuItem>
				</Select>
				{(internalState.type === "depart" ||
					internalState.type === "arrive") && (
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box className="flex flex-row gap-4">
							<TimePicker
								label="Time"
								value={internalState.time}
								onChange={handleTimeChange}
								slotProps={{
									textField: {
										fullWidth: true,
										size: "small",
									},
								}}
							/>
							<DatePicker
								label="Date"
								value={internalState.date}
								onChange={handleDateChange}
								slotProps={{
									textField: {
										fullWidth: true,
										size: "small",
									},
								}}
							/>
						</Box>
					</LocalizationProvider>
				)}
			</Box>
		</FormControl>
	);
};

export default DepartureTimeField;
