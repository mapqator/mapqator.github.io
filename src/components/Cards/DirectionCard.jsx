import React, { useContext, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Collapse,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Switch,
	Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";
import Pluralize from "pluralize";
import {
	convertTravelModeToIcon,
	convertTravelModeToLabel,
} from "@/services/utils";
import RoutesList from "../Lists/RoutesList";
import RouteSummary from "../Box/RouteSummary";

function DirectionCardDetails({ from_id, to_id }) {
	const [expandedRoute, setExpandedRoute] = useState({
		walking: false,
		driving: false,
		bicycling: false,
		transit: false,
	});
	const { directionInformation, setDirectionInformation } =
		useContext(GlobalContext);

	const handleDelete = (mode) => {
		const newDirectionMatrix = {
			...directionInformation,
		};
		delete newDirectionMatrix[from_id][to_id][mode];
		if (Object.keys(newDirectionMatrix[from_id][to_id]).length === 0)
			delete newDirectionMatrix[from_id][to_id];
		if (Object.keys(newDirectionMatrix[from_id]).length === 0)
			delete newDirectionMatrix[from_id];
		setDirectionInformation(newDirectionMatrix);
	};
	return (
		<List dense>
			{Object.keys(directionInformation[from_id][to_id]).map(
				(mode, index) => (
					<React.Fragment key={index}>
						<ListItem
							onClick={() =>
								setExpandedRoute((prev) => ({
									...prev,
									[mode]: !prev[mode],
								}))
							}
							className="cursor-pointer"
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
							<div className="flex flex-row gap-2 items-center w-full">
								<div className="w-1/2">
									<ListItemText
										primary={convertTravelModeToLabel(mode)}
										secondary={Pluralize(
											"route",
											directionInformation[from_id][
												to_id
											][mode].routes.length,
											true
										)}
										primaryTypographyProps={{
											noWrap: true,
										}}
										secondaryTypographyProps={{
											noWrap: true,
										}}
									/>
								</div>
								<div className="ml-auto mr-2">
									<IconButton
										size="small"
										sx={{
											transform: expandedRoute[mode]
												? "rotate(180deg)"
												: "rotate(0deg)",
											transition: "0.3s",
										}}
									>
										<ExpandMore />
									</IconButton>
								</div>
							</div>
						</ListItem>
						<Collapse
							in={expandedRoute[mode]}
							timeout="auto"
							unmountOnExit
						>
							{/* <Divider /> */}
							<Paper
								elevation={1}
								sx={{
									bgcolor: "grey.100",
									m: 2,
									mt: 0,
								}}
							>
								<Box className="w-full p-3 pb-0 flex flex-row justify-end items-center">
									<h6 className="text-xs text-zinc-500">
										Show Steps
									</h6>
									<Switch
										onChange={() => {
											const newDirectionMatrix = {
												...directionInformation,
											};
											newDirectionMatrix[from_id][to_id][
												mode
											].showSteps =
												!newDirectionMatrix[from_id][
													to_id
												][mode].showSteps;
											setDirectionInformation(
												newDirectionMatrix
											);
										}}
										checked={
											directionInformation[from_id][
												to_id
											][mode].showSteps
										}
										size="small"
									/>
								</Box>
								<RoutesList
									routes={
										directionInformation[from_id][to_id][
											mode
										].routes
									}
									showSteps={
										directionInformation[from_id][to_id][
											mode
										].showSteps
									}
								/>
							</Paper>
						</Collapse>
						{index <
							Object.keys(directionInformation[from_id][to_id])
								.length -
								1 && <Divider component="li" />}
					</React.Fragment>
				)
			)}
		</List>
	);
}
function DirectionCardSummary({ from_id, to_id, expanded }) {
	const { directionInformation } = useContext(GlobalContext);
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
						Object.keys(directionInformation[from_id][to_id])
							.length + " travel modes"
					}
					color="primary"
					size="small"
				/>
			</Box>
		</>
	);
}
export default function DirectionCard({ from_id, to_id, index }) {
	const [expanded, setExpanded] = useState(index === 0);
	return (
		<Card variant="outlined">
			<CardContent
				onClick={() => setExpanded(!expanded)}
				className="cursor-pointer"
			>
				<DirectionCardSummary {...{ from_id, to_id, expanded }} />
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<DirectionCardDetails {...{ from_id, to_id }} />
			</Collapse>
		</Card>
	);
}
