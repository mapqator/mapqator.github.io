import React, { useContext, useState } from "react";
import {
	IconButton,
	CardContent,
	Card,
	Chip,
	Collapse,
	List,
	ListItem,
	Box,
	Typography,
	ListItemText,
	Divider,
	ListItemIcon,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Delete, ExpandMore } from "@mui/icons-material";
import { AppContext } from "@/contexts/AppContext";
import {
	convertTravelModeToIcon,
	convertTravelModeToLabel,
} from "@/services/utils";
import RouteSummary from "../Box/RouteSummary";

function DistanceCardDetails({ from_id, to_id }) {
	const { distanceMatrix, setDistanceMatrix } = useContext(GlobalContext);
	const handleDelete = (mode) => {
		const newDistanceMatrix = {
			...distanceMatrix,
		};

		delete newDistanceMatrix[from_id][to_id][mode];
		if (Object.keys(newDistanceMatrix[from_id][to_id]).length === 0)
			delete newDistanceMatrix[from_id][to_id];
		if (Object.keys(newDistanceMatrix[from_id]).length === 0)
			delete newDistanceMatrix[from_id];
		setDistanceMatrix(newDistanceMatrix);
	};
	return (
		<List dense>
			{Object.keys(distanceMatrix[from_id][to_id]).map((mode, index) => (
				<React.Fragment key={index}>
					<ListItem
						secondaryAction={
							<IconButton
								edge="end"
								onClick={() => handleDelete(mode)}
								size="small"
							>
								<Delete color="error" />
							</IconButton>
						}
					>
						<ListItemIcon>
							{convertTravelModeToIcon(mode)}
						</ListItemIcon>
						<ListItemText
							primary={convertTravelModeToLabel(mode)}
							secondary={
								distanceMatrix[from_id][to_id][mode].duration +
								" | " +
								distanceMatrix[from_id][to_id][mode].distance
							}
							primaryTypographyProps={{
								noWrap: true,
							}}
							secondaryTypographyProps={{
								noWrap: true,
							}}
						/>
					</ListItem>
					{index <
						Object.keys(distanceMatrix[from_id][to_id]).length -
							1 && <Divider component="li" />}
				</React.Fragment>
			))}
		</List>
	);
}

function DistanceCardSummary({ from_id, to_id, expanded }) {
	const { distanceMatrix } = useContext(GlobalContext);
	const { savedPlacesMap } = useContext(AppContext);
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
			>
				<RouteSummary {...{ from_id, to_id }} />
				<Box>
					<IconButton
						size="small"
						sx={{
							transform: expanded
								? "rotate(180deg)"
								: "rotate(0deg)",
							transition: "0.3s",
						}}
					>
						<ExpandMore />
					</IconButton>
				</Box>
			</Box>
			<Box
				display="flex"
				flexDirection={"row"}
				justifyContent={"end"}
				gap={1}
				mt={1}
			>
				<Chip
					label={
						Object.keys(distanceMatrix[from_id][to_id]).length +
						" travel modes"
					}
					color="primary"
					size="small"
				/>
			</Box>
		</>
	);
}

export default function DistanceCard({ from_id, to_id, index }) {
	const [expanded, setExpanded] = useState(index === 0);
	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<DistanceCardSummary {...{ from_id, to_id, expanded }} />
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<DistanceCardDetails {...{ from_id, to_id }} />
			</Collapse>
		</Card>
	);
}
