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
export default function CurrentInformation({
	selectedPlacesMap,
	currentInformation,
	setCurrentInformation,
	savedPlacesMap,
}) {
	return (
		// Object.keys(selectedPlacesMap).length > 0 &&
		<div className="flex flex-col border-4 w-full border-black rounded-lg">
			<div className="flex flex-col items-center bg-black text-center pb-2">
				<h1 className="text-xl md:text-3xl text-white">
					Current Information
				</h1>
				<p className="text-sm md:text-lg text-zinc-300">
					Some information about current situation
				</p>
			</div>

			<div className="flex flex-col gap-2 w-full p-2">
				<div className="flex flex-row items-center w-full">
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
						<FontAwesomeIcon icon={faTrash} color="red" size="sm" />
					</IconButton>
				</div>

				<div className="flex flex-row items-center w-full">
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
						<FontAwesomeIcon icon={faTrash} color="red" size="sm" />
					</IconButton>
				</div>

				<div className="flex flex-row items-center w-full">
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
						<FontAwesomeIcon icon={faTrash} color="red" size="sm" />
					</IconButton>
				</div>
			</div>
		</div>
	);
}
