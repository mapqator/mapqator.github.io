"use client";

import React, { useContext, useEffect, useState } from "react";
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
import {
	faArrowDown,
	faBicycle,
	faBus,
	faCar,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import { AppContext } from "@/contexts/AppContext";

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
				(mode, index3) => (
					<React.Fragment key={index3}>
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
								{mode === "walking" ? (
									<FontAwesomeIcon icon={faWalking} />
								) : mode === "driving" ? (
									<FontAwesomeIcon icon={faCar} />
								) : mode === "bicycling" ? (
									<FontAwesomeIcon icon={faBicycle} />
								) : (
									<FontAwesomeIcon icon={faBus} />
								)}
							</ListItemIcon>
							<div className="flex flex-row gap-2 items-center w-full">
								<div className="w-1/2">
									<ListItemText
										primary={
											mode === "walking"
												? "Walking"
												: mode === "driving"
												? "Driving"
												: mode === "bicycling"
												? "Bicycling"
												: "Public transport"
										}
										secondary={
											directionInformation[from_id][
												to_id
											][mode].routes.length + " routes"
										}
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
								<List dense>
									{directionInformation[from_id][to_id][
										mode
									].routes.map((route, index) => (
										<React.Fragment key={index}>
											<Divider />
											<ListItem>
												<div className="flex flex-col gap-2 w-full">
													<ListItemText
														primary={
															<div className="flex flex-row justify-between w-full">
																<h1 className="w-[60%] text-wrap">
																	{"Via " +
																		route.label}
																</h1>
																<h1 className="w-[40%] text-right">
																	{route.duration +
																		" | " +
																		route.distance}
																</h1>
															</div>
														}
														secondary={
															directionInformation[
																from_id
															][to_id][mode]
																.showSteps && (
																<div className="flex flex-col gap-0">
																	{route.steps.map(
																		(
																			step,
																			index1
																		) => (
																			<p
																				key={
																					index1
																				}
																				// className="text-sm"
																				dangerouslySetInnerHTML={{
																					__html:
																						"- " +
																						step,
																				}}
																			/>
																		)
																	)}
																</div>
															)
														}
														primaryTypographyProps={{
															noWrap: true,
														}}
														secondaryTypographyProps={{
															noWrap: true,
														}}
													/>
												</div>
											</ListItem>
										</React.Fragment>
									))}
								</List>
							</Paper>
						</Collapse>
						{index3 <
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
				<Box className="flex flex-col">
					<Typography variant="h6" component="div" align="center">
						{savedPlacesMap[from_id].name}
					</Typography>
					<FontAwesomeIcon icon={faArrowDown} />
					<Typography variant="h6" component="div" align="center">
						{savedPlacesMap[to_id].name}
					</Typography>
				</Box>
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
export default function DirectionCard({ from_id, to_id }) {
	const [expanded, setExpanded] = useState(false);
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
