import { Card, CardContent, Typography } from "@mui/material";
import PlaceDeleteButton from "../Buttons/PlaceDeleteButton";

export default function SavedPlaceCard({ placeId, savedPlacesMap }) {
	return (
		<Card variant="outlined">
			<CardContent className="flex flex-row items-center justify-between">
				<div className="flex flex-col">
					<Typography variant="h6" component="div" noWrap>
						{savedPlacesMap[placeId].displayName.text}
					</Typography>
					<Typography color="textSecondary" gutterBottom noWrap>
						{savedPlacesMap[placeId].shortFormattedAddress}
					</Typography>
				</div>
				{/* <PlaceDeleteButton placeId={placeId} /> */}
			</CardContent>
		</Card>
	);
}
