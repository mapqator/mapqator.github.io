import {
	Container,
	CssBaseline,
	useTheme,
	Box,
	Toolbar,
	Divider,
} from "@mui/material";
import React from "react";
import DrawerBar from "../Sidebars/DrawerBar";
import LeftSidebar from "../Sidebars/LeftSidebar";
import Breadcrumb from "../Breadcrumb";
import ToggleMode from "../Buttons/ToggleButton";
import config from "../../config.json";
const drawerWidth = config.drawerWidth;
const PrimaryLayout = (props) => {
	const theme = useTheme();
	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Box sx={{ width: { xs: "0px", md: `calc(${drawerWidth}px)` } }}>
				<LeftSidebar />
			</Box>

			<div className="w-full relative">
				<Box
					className="fixed z-50 flex-col"
					sx={{
						backgroundColor: theme.palette.background.default,
						width: { xs: 0, md: `calc(100% - ${drawerWidth}px)` },
						display: { xs: "none", md: "flex" },
					}}
				>
					<Toolbar className="flex flex-row items-center justify-between pr-3">
						<Breadcrumb />
						<ToggleMode />
					</Toolbar>
					<Divider />
				</Box>
				<Toolbar />
				<div>{props.children}</div>
			</div>
		</Box>
	);
};

export default PrimaryLayout;
