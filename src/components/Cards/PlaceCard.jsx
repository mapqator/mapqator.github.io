import React, { useContext, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	Card,
	CardContent,
	Typography,
	Chip,
	IconButton,
	Collapse,
	Box,
	Select,
	MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import { convertFromSnake } from "@/services/utils";
import PlaceDeleteButton from "../Buttons/PlaceDeleteButton";

function PlaceCardSummary({ placeId, expanded }) {
	const { selectedPlacesMap } = useContext(GlobalContext);

	const { savedPlacesMap } = useContext(AppContext);

	return (
		<>
			<Typography variant="h6" component="div" noWrap>
				{savedPlacesMap[placeId].name}
			</Typography>
			<Typography color="textSecondary" gutterBottom noWrap>
				{savedPlacesMap[placeId].formatted_address}
			</Typography>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					mt: 1,
				}}
			>
				<Typography variant="body2" sx={{ flexGrow: 1 }}>
					Selected Attributes:{" "}
					{selectedPlacesMap[placeId].selectedAttributes.length}
				</Typography>
				<IconButton
					sx={{
						transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
						transition: "0.3s",
					}}
				>
					<ExpandMoreIcon />
				</IconButton>
			</Box>
		</>
	);
}

function PlaceCardDetails({ placeId }) {
	const { selectedPlacesMap, setSelectedPlacesMap } =
		useContext(GlobalContext);
	const handleAttributeChange = (placeId, newAttributes) => {
		setSelectedPlacesMap((prev) => ({
			...prev,
			[placeId]: {
				...prev[placeId],
				selectedAttributes: newAttributes,
			},
		}));
	};
	return (
		<FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
			<InputLabel>Attributes</InputLabel>
			<Select
				multiple
				value={selectedPlacesMap[placeId].selectedAttributes}
				onChange={(e) => handleAttributeChange(placeId, e.target.value)}
				renderValue={(selected) => (
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 0.5,
						}}
					>
						{selected.map((value) => (
							<Chip
								key={value}
								label={convertFromSnake(value)}
								size="small"
							/>
						))}
					</Box>
				)}
				input={<OutlinedInput label="Attributes" />}
			>
				{selectedPlacesMap[placeId].attributes.map((attribute) => (
					<MenuItem key={attribute} value={attribute}>
						{convertFromSnake(attribute)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
export default function PlaceCard({ placeId, index }) {
	const [expanded, setExpanded] = useState(index === 0);

	useEffect(() => {
		setExpanded(index === 0);
	}, [index]);
	return (
		<Card
			elevation={3}
			sx={{
				// height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<CardContent
				sx={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box
					onClick={() => setExpanded((prev) => !prev)}
					className="cursor-pointer"
				>
					<PlaceCardSummary {...{ placeId, expanded }} />
				</Box>

				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<PlaceCardDetails {...{ placeId }} />
					<iframe
						width="100%"
						// height="350"
						// style="border:0"
						style={{
							border: 0,
							aspectRatio: "1 / 1",
						}}
						loading="lazy"
						// allowfullscreen
						referrerpolicy="no-referrer-when-downgrade"
						src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs&language=en&q=place_id:${placeId}`}
					></iframe>
				</Collapse>

				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-start",
						mt: "auto",
					}}
				>
					<PlaceDeleteButton placeId={placeId} />
				</Box>
			</CardContent>
		</Card>
	);
}
