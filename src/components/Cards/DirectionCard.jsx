"use client";

import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Checkbox,
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
	faChevronDown,
	faChevronUp,
	faTrashCan,
	faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { Delete, ExpandMore } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
export default function DirectionCard({ from_id, to_id }) {
	const [expanded, setExpanded] = useState(false);
	const [expandedRoute, setExpandedRoute] = useState({
		walking: false,
		driving: false,
		bicycling: false,
		transit: false,
	});
	const {
		directionInformation,
		setDirectionInformation,
		selectedPlacesMap,
		savedPlacesMap,
	} = useContext(GlobalContext);

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
		<Card variant="outlined" sx={{ mb: 2 }}>
			<CardContent>
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
						{/* <IconButton onClick={handleFullDelete} size="small">
							<Delete color="error" />
						</IconButton> */}
						<IconButton
							onClick={() => setExpanded(!expanded)}
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
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<Divider />
				<List dense>
					{Object.keys(directionInformation[from_id][to_id]).map(
						(mode, index3) => (
							<React.Fragment key={index3}>
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
														? "On foot"
														: mode === "driving"
														? "By car"
														: mode === "bicycling"
														? "By cycle"
														: "By public transport"
												}
												secondary={
													directionInformation[
														from_id
													][to_id][mode].routes
														.length + " routes"
												}
												primaryTypographyProps={{
													noWrap: true,
												}}
												secondaryTypographyProps={{
													noWrap: true,
												}}
											/>
										</div>
										{/* <Checkbox
											edge="start"
											checked={
												directionInformation[from_id][
													to_id
												][mode].showSteps
											}
											onChange={() => {
												const newDirectionMatrix = {
													...directionInformation,
												};
												newDirectionMatrix[from_id][
													to_id
												][mode].showSteps =
													!newDirectionMatrix[
														from_id
													][to_id][mode].showSteps;
												setDirectionInformation(
													newDirectionMatrix
												);
											}}
										/> */}
										<div className="ml-auto">
											<IconButton
												onClick={() =>
													setExpandedRoute(
														(prev) => ({
															...prev,
															[mode]: !prev[mode],
														})
													)
												}
												size="small"
												sx={{
													transform: expandedRoute[
														mode
													]
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
													newDirectionMatrix[from_id][
														to_id
													][mode].showSteps =
														!newDirectionMatrix[
															from_id
														][to_id][mode]
															.showSteps;
													setDirectionInformation(
														newDirectionMatrix
													);
												}}
												checked={
													directionInformation[
														from_id
													][to_id][mode].showSteps
												}
												size="small"
											/>
										</Box>
										<List dense>
											{directionInformation[from_id][
												to_id
											][mode].routes.map(
												(route, index) => (
													<React.Fragment key={index}>
														<Divider />
														<ListItem>
															<div className="flex flex-col gap-2 w-full">
																<ListItemText
																	primary={
																		<div className="flex flex-row justify-between w-full">
																			<h1 className="w-[70%]">
																				{"Via " +
																					route.label}
																			</h1>
																			<h1 className="text-md text-right w-[15%]">
																				{
																					route.duration
																				}
																			</h1>
																			<h1 className="text-md text-right w-[15%]">
																				{
																					route.distance
																				}
																			</h1>
																		</div>
																	}
																	secondary={
																		directionInformation[
																			from_id
																		][
																			to_id
																		][mode]
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
												)
											)}
										</List>
									</Paper>
								</Collapse>
								{index3 <
									Object.keys(
										directionInformation[from_id][to_id]
									).length -
										1 && (
									<Divider variant="inset" component="li" />
								)}
							</React.Fragment>
						)
					)}
				</List>
			</Collapse>
			{/* <div key={index2} className="flex flex-row gap-1 items-center">
				<h1 className={`text-center w-[30%]`}>
					{savedPlacesMap[to_id].name}
				</h1>
				<h1 className={`text-center w-[20%]`}>{mode}</h1>
				<h1 className={`text-center w-[15%]`}>
					{directionInformation[from_id][to_id][mode].routes.length}
				</h1>
				<div className="w-[16%] flex item-center justify-center z-10">
					<input
						type="checkbox"
						checked={
							directionInformation[from_id][to_id][mode].showSteps
						}
						onClick={() => {
							const newDirectionMatrix = {
								...directionInformation,
							};
							newDirectionMatrix[from_id][to_id][mode].showSteps =
								!newDirectionMatrix[from_id][to_id][mode]
									.showSteps;
							setDirectionInformation(newDirectionMatrix);
						}}
						className="cursor-pointer h-5 w-5"
					/>
				</div>
				<div className="w-[7%] flex item-center justify-center">
					<IconButton
						sx={{
							height: "3rem",
							width: "3rem",
						}}
						onClick={() => {
							const newDirectionMatrix = {
								...directionInformation,
							};
							delete newDirectionMatrix[from_id][to_id][mode];
							if (
								Object.keys(newDirectionMatrix[from_id][to_id])
									.length === 0
							)
								delete newDirectionMatrix[from_id][to_id];
							if (
								Object.keys(newDirectionMatrix[from_id])
									.length === 0
							)
								delete newDirectionMatrix[from_id];
							setDirectionInformation(newDirectionMatrix);
						}}
					>
						<div className="text-sm md:text-2xl">
							<FontAwesomeIcon icon={faTrashCan} color="red" />
						</div>
					</IconButton>
				</div>

				<div className="w-[7%] flex item-center justify-center">
					<IconButton
						sx={{ height: "3rem", width: "3rem" }}
						onClick={() => setExpanded((prev) => !prev)}
					>
						<div className="text-sm md:text-2xl">
							<FontAwesomeIcon
								icon={expanded ? faChevronUp : faChevronDown}
								color="black"
							/>
						</div>
					</IconButton>
				</div>
			</div>
			{expanded && (
				<div className="flex flex-col gap-1">
					{directionInformation[from_id][to_id][mode].routes.map(
						(route, index) => (
							<div
								key={index}
								className="flex flex-col gap-1 p-2 bg-gray-100"
							>
								<div className="flex flex-row justify-between">
									<h1 className="text-lg font-bold w-[70%]">
										Via {route.label}
									</h1>
									<h1 className="text-md text-right w-[15%]">
										{route.duration}
									</h1>
									<h1 className="text-md text-right w-[15%]">
										{route.distance}
									</h1>
								</div>
								{directionInformation[from_id][to_id][mode]
									.showSteps && (
									<div className="flex flex-col gap-1">
										{route.steps.map((step, index1) => (
											<p
												key={index1}
												className="text-sm"
												dangerouslySetInnerHTML={{
													__html: "- " + step,
												}}
											/>
										))}
									</div>
								)}
							</div>
						)
					)}
				</div>
			)} */}
		</Card>
	);
}
