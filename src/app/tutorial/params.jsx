"use client";
import {
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	IconButton,
	Button,
	TextField,
	Select,
	MenuItem,
	Grid,
	CardContent,
	Box,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Clear } from "@mui/icons-material";

export function Parameters({
	selectedPlacesMap,
	currentInformation,
	setCurrentInformation,
	savedPlacesMap,
}) {
	return (
		<CardContent>
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
							Current location
						</InputLabel>
						<Select
							required
							id="outlined-adornment"
							className="outlined-input"
							value={currentInformation.location}
							onChange={(event) => {
								setCurrentInformation((prev) => ({
									...prev,
									location: event.target.value,
								}));
							}}
							input={<OutlinedInput label={"Current location"} />}
							// MenuProps={MenuProps}
						>
							{Object.keys(selectedPlacesMap).map(
								(place_id, index) => (
									<MenuItem key={index} value={place_id}>
										{savedPlacesMap[place_id].name ||
											selectedPlacesMap[place_id].alias}
									</MenuItem>
								)
							)}
						</Select>
					</FormControl>
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
		</CardContent>
	);
}