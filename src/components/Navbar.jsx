"use client";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { AppBar, Toolbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { getTokenFromLocalStorage } from "@/api/base";
import { Login, Logout } from "@mui/icons-material";
import config from "@/config.json";
export default function Navbar({ selected, setSelected }) {
	const [baseUrl, setBaseUrl] = useState(
		process.env.REACT_APP_BASE_URL
			? process.env.REACT_APP_BASE_URL
			: process.env.NODE_ENV === "development"
			? ""
			: "https://mahirlabibdihan.github.io/mapquest"
	);
	const navItems = [
		{ name: "Context", key: "context" },
		{ name: "Question", key: "question" },
		{ name: "Dataset", key: "dataset" },
		{ name: "Evaluation", key: "evaluation" },
	];
	const router = useRouter();

	return (
		<AppBar position="fixed" sx={{ background: "white", mb: 4 }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Box
					onClick={() => router.push("landing")}
					className="cursor-pointer flex-row items-center flex w-1/6"
				>
					<Image
						src={`${baseUrl}/images/logo.png`}
						alt="MapQuest Logo"
						width={30}
						height={30}
					/>
					<div className="hidden lg:flex flex-col justify-center">
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
								mx: {
									md: 1,
								},
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
							className="!text-xs md:!text-base"
						>
							{item.name}
						</Button>
					))}
				</Box>
				<Box className="w-1/6 hidden md:flex justify-end">
					{getTokenFromLocalStorage() ? (
						<Button variant="outlined" endIcon={<Logout />}>
							Logout
						</Button>
					) : (
						<Button
							variant="contained"
							endIcon={<Login />}
							onClick={() => router.push(config.loginRedirect)}
						>
							Login
						</Button>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
}
