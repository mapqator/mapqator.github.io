"use client";
import React, { useState } from "react";
import { Typography, Paper, Box, Button } from "@mui/material";
export default function CollapsedContext({ context }) {
	const [contextExpanded, setContextExpanded] = useState(false);
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
