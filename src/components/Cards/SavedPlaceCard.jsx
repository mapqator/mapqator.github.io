import {
	Box,
	Button,
	Card,
	CardContent,
	IconButton,
	Typography,
} from "@mui/material";
import PlaceDeleteButton from "../Buttons/PlaceDeleteButton";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Directions } from "@mui/icons-material";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import textualFields from "@/database/textualFields";
import mapApi from "@/api/mapApi";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
export default function SavedPlaceCard({ placeId, savedPlacesMap }) {
	const { setSavedPlacesMap } = useContext(AppContext);
	const {
		selectedPlacesMap,
		setSelectedPlacesMap,
		activeStep,
		setActiveStep,
		setNewNearbyPlaces,
		setNewDirection,
	} = useContext(GlobalContext);

	const [addingPlace, setAddingPlace] = useState(false);
	const handleAddSave = async (place_id) => {
		setAddingPlace(true);
		let details = savedPlacesMap[place_id];
		const res = await mapApi.getDetailsNew(place_id);
		if (res.success) {
			details = res.data;
			setSelectedPlacesMap((prev) => ({
				...prev,
				[place_id]: details,
			}));
		} else {
			showError(res.error);
			setLoading(false);
			return;
		}
		// handleAdd(details);
		setActiveStep(2);
		setAddingPlace(false);
	};

	const handleAdd = (details) => {
		const place_id = details["id"];
		if (place_id === "" || selectedPlacesMap[place_id]) return;
		setSelectedPlacesMap((prev) => ({
			...prev,
			[place_id]: true,
		}));
	};

	return (
		<Card variant="outlined" className="h-full">
			<CardContent className="flex flex-col justify-between h-full gap-4">
				<div className="flex flex-col">
					<Typography variant="h6" component="div">
						{savedPlacesMap[placeId].displayName?.text}
					</Typography>
					<Typography color="textSecondary">
						{savedPlacesMap[placeId].shortFormattedAddress}
					</Typography>
				</div>
				<div className="flex justify-center gap-4">
					<Box
						className={"flex flex-col gap-1 items-center"}
						sx={{
							color: "primary.main",
						}}
					>
						<Button
							variant="outlined"
							onClick={() => {
								setNewDirection({
									origin: "",
									destination: placeId,
									intermediates: [],
									travelMode: "WALK",
									departureTime: {
										type: "now",
										date: dayjs(),
										time: dayjs(),
										departureTimestamp: new Date(),
									},
									optimizeWaypointOrder: false,
									transitPreferences: {
										allowedTravelModes: [],
									},
									routeModifiers: {
										avoidTolls: false,
										avoidHighways: false,
										avoidFerries: false,
									},
								});
								setActiveStep(4);
							}}
							sx={{
								borderRadius: "50%",
								height: "45px",
								width: "45px",
								minWidth: "45px",
								padding: 0,
							}}
						>
							<Directions />
						</Button>
						<Typography variant="body2">Directions</Typography>
					</Box>
					<Box
						className={"flex flex-col gap-1 items-center"}
						sx={{
							color:
								selectedPlacesMap[placeId] || addingPlace
									? "rgba(0,0,0,0.26)"
									: "primary.main",
						}}
					>
						<LoadingButton
							variant="outlined"
							onClick={() => handleAddSave(placeId)}
							loading={addingPlace}
							disabled={selectedPlacesMap[placeId]}
							sx={{
								borderRadius: "50%",
								height: "45px",
								width: "45px",
								minWidth: "45px",
								padding: 0,
							}}
						>
							<BookmarkBorderIcon />
						</LoadingButton>
						<Typography variant="body2">Save</Typography>
					</Box>
					<Box
						className={"flex flex-col gap-1 items-center"}
						sx={{
							color: "primary.main",
						}}
					>
						<Button
							variant="outlined"
							onClick={() => {
								setNewNearbyPlaces({
									locationBias: placeId,
									searchBy: "type",
									type: "",
									keyword: "",
									rankPreference: "RELEVANCE",
									minRating: 0, // Values are rounded up to the nearest 0.5.
									priceLevels: [],
								});
								setActiveStep(3);
							}}
							sx={{
								borderRadius: "50%",
								height: "45px",
								width: "45px",
								minWidth: "45px",
								padding: 0,
							}}
						>
							<ShareLocationIcon />
						</Button>
						<Typography variant="body2">Nearby</Typography>
					</Box>
				</div>
				{/* <PlaceDeleteButton placeId={placeId} /> */}
			</CardContent>
		</Card>
	);
}
