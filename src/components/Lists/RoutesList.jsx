import React, { useContext, useState } from "react";
import { Divider, List, ListItem, ListItemText } from "@mui/material";

export default function RoutesList({ routes, showSteps }) {
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
										<h1 className="w-[60%] text-wrap">
											{"Via " + route.label}
										</h1>
										<h1 className="w-[40%] text-right">
											{route.duration +
												" | " +
												route.distance}
										</h1>
									</div>
								}
								secondary={
									showSteps && (
										<div className="flex flex-col gap-0">
											{route.steps.map((step, index1) => (
												<p
													key={index1}
													// className="text-sm"
													dangerouslySetInnerHTML={{
														__html: "- " + step,
													}}
												/>
											))}
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
	);
}
