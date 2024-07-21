"use client";
import {
	IconButton,
	Select,
	MenuItem,
	CardContent,
	Box,
	Divider,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Clear } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function ParamsForm() {
	const { currentInformation, setCurrentInformation } =
		useContext(GlobalContext);
	return (
		<Box className="flex flex-col gap-4 w-full">
			<div className="flex flex-row items-center w-full gap-2">
				<div className="w-full">
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer components={["TimePicker"]}>
							<TimePicker
								label="Current Time"
								value={currentInformation.time}
								onChange={(newValue) =>
									setCurrentInformation((prev) => ({
										...prev,
										time: newValue,
									}))
								}
								slotProps={{
									textField: {
										fullWidth: true,
										size: "small",
									},
								}}
							/>
						</DemoContainer>
					</LocalizationProvider>
				</div>

				<IconButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							time: null,
						}));
					}}
					sx={{ height: "2rem", width: "2rem" }}
				>
					<Clear />
				</IconButton>
			</div>

			<div className="flex flex-row items-center w-full gap-2">
				<FormControl
					fullWidth
					className="input-field"
					variant="outlined"
					// style={{ width: "20rem" }}
					size="small"
				>
					<InputLabel
						htmlFor="outlined-adornment"
						className="input-label"
					>
						Current Day
					</InputLabel>
					<Select
						required
						id="outlined-adornment"
						className="outlined-input"
						value={currentInformation.day}
						onChange={(event) => {
							setCurrentInformation((prev) => ({
								...prev,
								day: event.target.value,
							}));
						}}
						input={<OutlinedInput label={"Current Day"} />}
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
				<IconButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							day: "",
						}));
					}}
					sx={{ height: "2rem", width: "2rem" }}
				>
					<Clear />
				</IconButton>
			</div>

			<div className="flex flex-row items-center w-full gap-2">
				<PlaceSelectionField
					label="Current location"
					value={currentInformation.location}
					onChange={(event) => {
						setCurrentInformation((prev) => ({
							...prev,
							location: event.target.value,
						}));
					}}
				/>
				<IconButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							location: "",
						}));
					}}
					sx={{ height: "2rem", width: "2rem" }}
				>
					<Clear />
				</IconButton>
			</div>
		</Box>
	);
}
