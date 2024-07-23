"use client";
import { Button, Typography, Box, Fade } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PageComponent() {
	const [baseUrl, setBaseUrl] = useState(
		process.env.REACT_APP_BASE_URL
			? process.env.REACT_APP_BASE_URL
			: process.env.NODE_ENV === "development"
			? ""
			: "https://mahirlabibdihan.github.io/mapquest"
	);
	const [showContent, setShowContent] = useState(false);
	const router = useRouter();
	useEffect(() => {
		setShowContent(true);
	}, []);
	console.log("url", `${process.env.REACT_APP_BASE_URL}/images/logo.png`);
	return (
		<Box
			className="bg-gradient-to-r from-blue-100 to-green-100 w-full min-h-screen flex flex-col items-center justify-center"
			sx={{ overflow: "hidden" }}
		>
			<Fade in={showContent} timeout={1000}>
				<Box className="text-center">
					<Box className="flex flex-col md:flex-row items-center md:items-end gap-0 md:gap-5">
						<motion.img
							src={`${baseUrl}/images/logo.png`}
							alt="Google Maps Logo"
							style={{
								width: "160px",
								marginBottom: "30px",
							}}
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
						/>
						<motion.div
							initial={{ y: -50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<div className="hidden md:flex flex-col items-start justify-center mb-16">
								<Typography
									variant="h2"
									component="div"
									sx={{
										// ml: 2,
										color: "#333",
										fontWeight: "bold",
										fontSize: "5rem",
									}}
								>
									MapQuest
								</Typography>
								<Typography
									variant="h6"
									component="div"
									sx={{
										color: "#666",
										fontWeight: "300",
										ml: {
											xs: "12rem",
											md: "16rem",
										},
										transform: "translateY(-15px)",
									}}
									className="h-3 font-mono"
									// style={{}}
								>
									by Mahir Labib Dihan
								</Typography>
							</div>
						</motion.div>

						{/* <Typography
							variant="h2"
							component="h1"
							gutterBottom
							sx={{
								fontWeight: "bold",
								color: "#333",
								mb: 5,
								textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
							}}
						>
							MapQuest
						</Typography> */}
					</Box>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.8 }}
					>
						<Typography
							sx={{
								fontSize: {
									xs: "2.3rem",
									md: "3rem",
								},
								fontWeight: "600",
								color: "#555",
								mb: 1,
								textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
							}}
						>
							Your Journey Begins Here
						</Typography>
						<Typography
							variant="h6"
							sx={{
								color: "#666",
								mb: 6,
								fontWeight: "300",
							}}
						>
							Discover, Navigate, and Explore with MapQuest
						</Typography>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button
							variant="contained"
							size="large"
							sx={{
								fontWeight: "bold",
								px: 4,
								py: 1,
								borderRadius: 50,
								boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
								backgroundColor: "#34A853", // Google Green
								color: "white",
								fontSize: "1.1rem",
								"&:hover": {
									backgroundColor: "#2E8B57", // Darker shade of green
								},
							}}
							onClick={() => router.push("/features")}
						>
							Start Your Adventure
						</Button>
					</motion.div>
				</Box>
			</Fade>
			{/* <div style={{ position: "absolute", bottom: 10 }}>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.8 }}
				>
					<Typography
						variant="body2"
						sx={{
							color: "#888",
							fontWeight: "light",
						}}
					>
						Developed by Mahir Labib Dihan
					</Typography>
				</motion.div>
			</div> */}
		</Box>
	);
}
