import React, { useContext, useState } from "react";
import {
	Divider,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	ArrowForward,
	ArrowRight,
	ArrowRightAlt,
	DoubleArrow,
	KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { AppContext } from "@/contexts/AppContext";

export default function RoutesList({ routes, showSteps, waypoints }) {
	const { savedPlacesMap } = useContext(AppContext);
	return (
		<List dense>
			{routes.map((route, index) => (
				<React.Fragment key={index}>
					<Divider />
					<ListItem>
						<div className="flex flex-col gap-2 w-full">
							<ListItemText
								primary={
									<div className="flex flex-row justify-between w-full">
										<h1 className="w-[60%] text-wrap text-lg font-semibold">
											{"Via " + route.label}
										</h1>
										<div className="flex flex-col w-[40%] text-right">
											<h1 className="font-semibold">
												{route.duration +
													" (" +
													route.distance +
													")"}
											</h1>
										</div>
									</div>
								}
								secondary={
									<div className="flex flex-col gap-0">
										{route.legs.map((leg, i) => (
											<>
												{route.legs.length > 1 && (
													<div className="flex flex-row justify-between items-center">
														<Typography className="pt-1 text-black">
															{
																savedPlacesMap[
																	waypoints[i]
																].displayName
																	.text
															}
															<ArrowRightAlt />
															{
																savedPlacesMap[
																	waypoints[
																		i + 1
																	]
																].displayName
																	.text
															}
														</Typography>
														<Typography variant="body2">
															{leg.localizedValues
																.staticDuration
																.text +
																" (" +
																leg
																	.localizedValues
																	.distance
																	.text +
																")"}
														</Typography>
													</div>
												)}

												{showSteps &&
													leg.steps.map((step, j) => (
														<p
															key={i + j}
															// className="text-sm"
															dangerouslySetInnerHTML={{
																__html:
																	"- " +
																	step
																		.navigationInstruction
																		.instructions,
															}}
														/>
													))}
											</>
										))}
									</div>
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
	);
}
