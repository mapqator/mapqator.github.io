import React from "react";
import {
	Typography,
	Box,
	List,
	ListItem,
	ListItemText,
	Paper,
} from "@mui/material";

const CategoryHelpPage = () => {
	return (
		<Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
			<Typography variant="h4" gutterBottom>
				Understanding Question Categories
			</Typography>
			<Typography variant="body1" paragraph>
				Our location-based geospatial questions are divided into three
				main categories to help you better understand the type of
				information you'll be working with.
			</Typography>

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<Typography variant="h5" gutterBottom>
					1. POI (Point of Interest)
				</Typography>
				<Typography variant="body1" paragraph>
					POI questions focus on specific places and their
					characteristics.
				</Typography>
				<List>
					<ListItem>
						<ListItemText primary="Information about a specific place (e.g., Location, Rating, Reviews)" />
					</ListItem>
					<ListItem>
						<ListItemText primary="Nearby points of interest" />
					</ListItem>
					<ListItem>
						<ListItemText primary="Places located within a larger area" />
					</ListItem>
				</List>
			</Paper>

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<Typography variant="h5" gutterBottom>
					2. Routing
				</Typography>
				<Typography variant="body1" paragraph>
					Routing questions involve travel information between
					locations.
				</Typography>
				<List>
					<ListItem>
						<ListItemText primary="Questions about distance between places" />
					</ListItem>
					<ListItem>
						<ListItemText primary="Travel duration between locations" />
					</ListItem>
				</List>
			</Paper>

			<Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
				<Typography variant="h5" gutterBottom>
					3. Trip
				</Typography>
				<Typography variant="body1" paragraph>
					Trip questions combine multiple aspects of routing and POI
					information.
				</Typography>
				<List>
					<ListItem>
						<ListItemText primary="Combines routing information (distances, durations) with POI details" />
					</ListItem>
					<ListItem>
						<ListItemText primary="Useful for planning multi-stop journeys or analyzing complex travel scenarios" />
					</ListItem>
				</List>
			</Paper>

			<Typography variant="body1">
				Understanding these categories will help you formulate more
				precise questions and interpret the results more effectively.
			</Typography>
		</Box>
	);
};

export default CategoryHelpPage;
