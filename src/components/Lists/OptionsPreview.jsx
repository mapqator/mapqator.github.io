"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";

export default function OptionsPreview({ answer }) {
	useEffect(() => {
		console.log(answer);
	}, [answer]);
	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="h6" gutterBottom>
				Options:
			</Typography>
			<List dense>
				{answer.options.map(
					(option, index) =>
						option !== "" && (
							<ListItem key={index}>
								<ListItemText
									primary={
										"Option " + (index + 1) + ": " + option
									}
									sx={{
										"& .MuiListItemText-primary": {
											fontWeight:
												index === answer.correct
													? "bold"
													: "normal",
											color:
												index === answer.correct
													? "success.main"
													: "inherit",
										},
									}}
								/>
								{index === answer.correct && (
									<Chip
										label="Correct"
										color="success"
										size="small"
									/>
								)}
							</ListItem>
						)
				)}
			</List>
		</Box>
	);
}
