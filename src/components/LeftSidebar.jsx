import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowRightFromBracket,
	faBell,
	faFishFins,
	faHardDrive,
	faHouse,
	faMailBulk,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Box,
	CssBaseline,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DatasetIcon from "@mui/icons-material/Dataset";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HomeIcon from "@mui/icons-material/Home";
import config from "@/config/config";
import authService from "@/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/authService";
import { Login, Logout } from "@mui/icons-material";
const drawerWidth = config.drawerWidth;
function NavButton({ icon, name, navkey, setSelected, selected }) {
	const pathname = usePathname();
	console.log("Selected: ", selected);
	return (
		<ListItem key={navkey} disablePadding>
			<ListItemButton
				className={`text-[1.25rem] px-4 ${
					selected === navkey ? "!bg-zinc-300 " : ""
				}`}
				onClick={() => {
					// console.log("Setting selected to: ", key);
					setSelected(navkey);
				}}
				href={"#" + navkey}
			>
				<ListItemIcon sx={{ minWidth: "0px", width: "15%" }}>
					{icon}
				</ListItemIcon>
				<ListItemText
					primary={name}
					primaryTypographyProps={{
						sx: { fontSize: "1.25rem" },
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
}

function LogoutButton() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	return (
		<ListItem key="Logout" disablePadding>
			<ListItemButton
				className={`text-[1.25rem] px-4`}
				// component={Link}
				// to="/login"
				onClick={async () => {
					if (isAuthenticated) {
						AuthService.logout();
					} else {
						router.push(config.logoutRedirect);
					}
				}}
			>
				<ListItemIcon sx={{ minWidth: "0px", width: "15%" }}>
					{isAuthenticated ? <Logout /> : <Login />}
				</ListItemIcon>
				<ListItemText
					primary={isAuthenticated ? "Logout" : "Login"}
					primaryTypographyProps={{
						sx: { fontSize: "1.25rem" },
					}}
				/>
			</ListItemButton>
		</ListItem>
	);
}

export default function LeftSidebar({ selected, setSelected, window }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	useEffect(() => {
		if (mobileOpen) {
			setMobileOpen(false);
		}
	}, [selected]);

	const drawer = (
		<div>
			<Toolbar className="!px-4">
				<div
					className="text-3xl font-bold  flex flex-row justify-center w-full gap-2 cursor-pointer"
					onClick={() => router.push("/landing")}
				>
					<div className="hidden lg:flex">
						<Image
							src={`${config.baseUrl}/images/logo.png`}
							alt="MapQuest Logo"
							width={30}
							height={30}
						/>
					</div>
					<div className="flex lg:hidden">
						<Image
							src={`${config.baseUrl}/images/logo.png`}
							alt="MapQuest Logo"
							width={20}
							height={20}
						/>
					</div>
					MapQuest
				</div>
			</Toolbar>
			<Divider />
			<List>
				{[
					{
						name: "Home",
						icon: <HomeIcon />,
						key: "home",
					},
					{ name: "Context", key: "context", icon: <MapIcon /> },
					{
						name: "Question",
						key: "question",
						icon: <QuestionAnswerIcon />,
					},
					{
						name: "Dataset",
						key: "dataset",
						icon: <DatasetIcon />,
					},
					{
						name: "Evaluation",
						key: "evaluation",
						icon: <AssessmentIcon />,
					},
				].map(({ name, icon, key }) => (
					<NavButton
						icon={icon}
						name={name}
						navkey={key}
						key={key}
						setSelected={setSelected}
						selected={selected}
					/>
				))}
			</List>
			<Divider />
			<List>
				<LogoutButton />
			</List>
			<Typography
				variant="caption"
				className="absolute left-0 bottom-0 p-2 text-center"
				width={`${drawerWidth - 16}px`}
			>
				{/* © 2024 Penguin Admin */}
				{/* {jwtDecode(getTokenFromLocalStorage()).email} */}
			</Typography>
		</div>
	);
	const container =
		window !== undefined ? () => window().document.body : undefined;
	return (
		<div
			className={`relative top-0 bottom-0 left-0 h-screen overflow-hidden`}
			style={{ width: `${drawerWidth}px` }}
		>
			<AppBar
				position="fixed"
				sx={{
					width: { md: `calc(100% - ${drawerWidth}px)` },
					ml: { md: `${drawerWidth}px` },
					display: { xs: "flex", md: "none" },

					backgroundColor: (theme) =>
						theme.palette.background.default, // Use theme's white color
				}}
			>
				<Toolbar
					className="flex flex-row justify-between items-center"
					sx={{ paddingRight: { xs: "0.25rem", md: "0.75rem" } }}
				>
					<div className="flex flex-row items-center">
						<IconButton
							// color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{
								mr: 2,
							}}
						>
							<MenuIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{
					width: { md: `${drawerWidth}px` },
					flexShrink: { md: 0 },
				}}
				aria-label="mailbox folders"
			>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					ModalProps={{
						keepMounted: true,
					}}
					sx={{
						display: { xs: "block", md: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: `${drawerWidth}px`,
						},
					}}
				>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: `${drawerWidth}px`,
						},
						display: { xs: "none", md: "block" },
					}}
					open
					// className="hidden md:block"
				>
					{drawer}
				</Drawer>
			</Box>
		</div>
	);
}
