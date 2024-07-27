"use client";
import {
	Button,
	Typography,
	Box,
	Avatar,
	Grid,
	Paper,
	Container,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DatasetIcon from "@mui/icons-material/Dataset";
import CompareIcon from "@mui/icons-material/Compare";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import config from "@/config/config";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	const steps = [
		{
			icon: <MapIcon />,
			label: "Generate Context",
			description: "Create rich, place-related contexts",
		},
		{
			icon: <QuestionAnswerIcon />,
			label: "Create Questions",
			description: "Formulate relevant questions",
		},
		{
			icon: <DatasetIcon />,
			label: "Manage Datasets",
			description: "Organize and version your QnA datasets",
		},
		{
			icon: <CompareIcon />,
			label: "Compare LLMs",
			description: "Evaluate GPT, Gemini, Mistral, Phi3, and more",
		},
	];

	return (
		<Box
			sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}
		>
			<Container maxWidth="lg">
				<Typography
					variant="h3"
					align="center"
					sx={{ mb: 6, fontWeight: "bold", color: "#333" }}
				>
					MapQuest Workflow
				</Typography>
				<Paper elevation={3} sx={{ p: 4, mb: 4 }}>
					<Grid
						container
						spacing={2}
						alignItems="center"
						justifyContent="center"
					>
						{steps.map((step, index) => (
							<>
								<Grid
									item
									key={step.label}
									xs={12}
									sm={6}
									md={2.5}
								>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											textAlign: "center",
										}}
									>
										<Avatar
											sx={{
												width: 80,
												height: 80,
												bgcolor: "primary.main",
												mb: 2,
											}}
										>
											{step.icon}
										</Avatar>
										<Typography variant="h6" sx={{ mb: 1 }}>
											{step.label}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{step.description}
										</Typography>
									</Box>
								</Grid>
								{/* {index < steps.length - 1 && (
									<Grid
										item
										xs={12}
										sm={6}
										md={1}
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<ArrowForwardIcon
											color="action"
											sx={{ fontSize: 40 }}
										/>
									</Grid>
								)} */}
							</>
						))}
					</Grid>
				</Paper>
				<Box sx={{ textAlign: "center" }}>
					<Button
						variant="contained"
						size="large"
						sx={{
							px: 4,
							py: 1.5,
							fontSize: "1.1rem",
							backgroundColor: "#4285F4",
							"&:hover": {
								backgroundColor: "#3367D6",
							},
						}}
						onClick={() =>
							router.push(
								isAuthenticated
									? config.loginRedirect + "#onboard"
									: config.logoutRedirect
							)
						}
					>
						Start Your Journey
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
