"use client";
import {
	Container,
	CssBaseline,
	useTheme,
	Box,
	Toolbar,
	Divider,
} from "@mui/material";
import React from "react";

import { useAuth } from "@/contexts/AuthContext";
import LeftSidebar from "../LeftSidebar";
import config from "@/config/config";

const PrimaryLayout = ({ children }) => {
	const { isAuthenticated } = useAuth();
	return (
		<Box sx={{ display: "flex" }}>
			{isAuthenticated && (
				<Box
					sx={{
						width: {
							xs: "0px",
							md: `calc(${config.drawerWidth}px)`,
						},
					}}
				>
					<LeftSidebar />
				</Box>
			)}

			<Container
				maxWidth="md"
				// sx={{ mt: 4, mb: 4 }}
				className="min-h-screen "
			>
				<div className="md:hidden">
					<Toolbar />
				</div>
				{children}
			</Container>
		</Box>
	);
};

export default PrimaryLayout;
