"use client";
import React, { useState } from "react";
import { Typography, Paper, Box, Button } from "@mui/material";
export default function CollapsedContext({ context }) {
	const [contextExpanded, setContextExpanded] = useState(false);
	console.log("Context Split:", context.split("\n"));
	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="h6" gutterBottom>
				Context:
			</Typography>
			<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
				{context.split("\n").map(
					(line, index) =>
						(contextExpanded || index < 5) && (
							<React.Fragment key={index}>
								<p
									key={index}
									className="w-full text-left"
									dangerouslySetInnerHTML={{
										__html: line,
									}}
								/>
							</React.Fragment>
						)
				)}
				{context === "" && (
					<p className="text-center my-auto text-lg md:text-xl text-zinc-400">
						No context provided.
					</p>
				)}
				{context.split("\n").length > 5 && (
					<Button
						onClick={() => setContextExpanded((prev) => !prev)}
						sx={{ mt: 1, textTransform: "none" }}
					>
						{contextExpanded ? "Show Less" : "Read More"}
					</Button>
				)}
			</Paper>
		</Box>
	);
}
