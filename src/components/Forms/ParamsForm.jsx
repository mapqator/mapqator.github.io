import { IconButton, Box } from "@mui/material";
import { Clear } from "@mui/icons-material";
import PlaceSelectionField from "@/components/InputFields/PlaceSelectionField";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import DaySelectionField from "../InputFields/DaySelectionField";
import TimeSelectionField from "../InputFields/TimeSelectionField";

function ClearButton({ onClick }) {
	return (
		<IconButton onClick={onClick} sx={{ height: "2rem", width: "2rem" }}>
			<Clear />
		</IconButton>
	);
}

export default function ParamsForm() {
	const { currentInformation, setCurrentInformation } =
		useContext(GlobalContext);
	return (
		<Box className="flex flex-col gap-4 w-full">
			<div className="flex flex-row items-center w-full gap-2">
				<Box className="w-full">
					<TimeSelectionField
						label="Current Time"
						value={currentInformation.time}
						onChange={(newValue) =>
							setCurrentInformation((prev) => ({
								...prev,
								time: newValue,
							}))
						}
					/>
				</Box>

				<ClearButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							time: null,
						}));
					}}
				/>
			</div>

			<div className="flex flex-row items-center w-full gap-2">
				<DaySelectionField
					label="Current Day"
					value={currentInformation.day}
					onChange={(event) => {
						setCurrentInformation((prev) => ({
							...prev,
							day: event.target.value,
						}));
					}}
				/>
				<ClearButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							day: "",
						}));
					}}
				/>
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
				<ClearButton
					onClick={() => {
						setCurrentInformation((prev) => ({
							...prev,
							location: "",
						}));
					}}
				/>
			</div>
		</Box>
	);
}
