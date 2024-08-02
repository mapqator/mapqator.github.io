import React, { useEffect } from "react";
import {
	Typography,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Grid,
	Card,
	CardContent,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

export default function OptionsPreview({ answer }) {
	useEffect(() => {
		console.log(answer);
	}, [answer]);
	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="h6" gutterBottom>
				Options:
			</Typography>
			<Grid container spacing={2} className="mt-2">
				{answer.options.map((option, index) => (
					<Grid item xs={12} sm={6} key={index}>
						<Card variant="outlined" className="bg-white">
							<CardContent>
								<Typography variant="body2">
									Option {index + 1}: {option}
									{index === answer.correct && (
										<CheckCircle
											className="text-green-500 ml-2"
											fontSize="small"
										/>
									)}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
			{/* <List dense>
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
			</List> */}
		</Box>
	);
}
