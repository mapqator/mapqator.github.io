import { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import Image from "next/image";
import { AppBar, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { Login, Logout } from "@mui/icons-material";
import config from "@/config.json";
import AuthService from "@/services/authService";
import { useAuth } from "@/contexts/AuthContext";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DatasetIcon from "@mui/icons-material/Dataset";
import AssessmentIcon from "@mui/icons-material/Assessment";
export default function Navbar({ selected, setSelected }) {
	const [baseUrl, setBaseUrl] = useState(
		process.env.REACT_APP_BASE_URL
			? process.env.REACT_APP_BASE_URL
			: process.env.NODE_ENV === "development"
			? ""
			: "https://mahirlabibdihan.github.io/mapquest"
	);
	const navItems = [
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
	];
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	return (
		<AppBar position="fixed" sx={{ background: "white", mb: 4 }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box
					onClick={() => router.push("landing")}
					className="cursor-pointer flex-row items-center flex w-1/6"
				>
					<div className="hidden md:flex">
						<Image
							src={`${baseUrl}/images/logo.png`}
							alt="MapQuest Logo"
							width={30}
							height={30}
						/>
					</div>
					<div className="flex md:hidden">
						<Image
							src={`${baseUrl}/images/logo.png`}
							alt="MapQuest Logo"
							width={25}
							height={25}
						/>
					</div>

					<div className="hidden md:flex flex-col justify-center">
						<Typography
							variant="h6"
							component="div"
							sx={{ ml: 2, color: "#333", fontWeight: "bold" }}
						>
							MapQuest
						</Typography>
						<h6
							// sx={{ ml: 2, color: "#333", fontWeight: "bold" }}
							className="text-xs text-gray-500 ml-8 h-3"
							style={{
								fontSize: "0.6rem",
								transform: "translateY(-5px)",
							}}
						>
							by Mahir Labib Dihan
						</h6>
					</div>
				</Box>

				<Box>
					{navItems.map((item) => (
						<Button
							key={item.key}
							onClick={() => setSelected(item.key)}
							sx={{
								height: `${config.topbarHeight}px`,
								color:
									selected === item.key ? "#1976d2" : "#666",
								fontWeight:
									selected === item.key ? "bold" : "normal",
								"&:hover": {
									backgroundColor: "rgba(25, 118, 210, 0.04)",
								},
								transition: "all 0.3s",
								borderBottom:
									selected === item.key
										? "2px solid #1976d2"
										: "none",
								borderRadius: 0,
								paddingBottom: "6px",
							}}
							className="!text-[0.6rem] md:!text-base h-full px-1"
							// startIcon=
						>
							<div className="flex flex-col md:flex-row md:gap-2 items-center">
								{item.icon}
								{item.name}
							</div>
						</Button>
					))}
				</Box>
				<Box className="w-1/6 hidden md:flex justify-end">
					{isAuthenticated ? (
						<Button
							variant="outlined"
							endIcon={<Logout />}
							onClick={() => {
								// router.push(config.logoutRedirect);
								AuthService.logout();
							}}
						>
							Logout
						</Button>
					) : (
						<Button
							variant="contained"
							endIcon={<Login />}
							onClick={() => router.push(config.logoutRedirect)}
						>
							Login
						</Button>
					)}
				</Box>
				<Box className="w-1/6 flex md:hidden justify-end">
					{isAuthenticated ? (
						<IconButton
							// variant="outlined"
							// endIcon={}
							onClick={() => {
								// router.push(config.logoutRedirect);
								AuthService.logout();
							}}
						>
							<Logout />
						</IconButton>
					) : (
						<IconButton
							// variant="contained"
							// endIcon={}
							onClick={() => router.push(config.logoutRedirect)}
						>
							<Login />
						</IconButton>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}
