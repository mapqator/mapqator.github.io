"use client";
import {
	Button,
	Typography,
	Box,
	Grid,
	Paper,
	Icon,
	Container,
} from "@mui/material";
import { motion } from "framer-motion";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import DatasetIcon from "@mui/icons-material/Dataset";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();
	const features = [
		{
			icon: <MapIcon fontSize="large" />,
			title: "Context Generation",
			description:
				"Generate rich, place-related contexts using our intuitive interface with Google Maps API.",
		},
		{
			icon: <QuestionAnswerIcon fontSize="large" />,
			title: "Question Creation",
			description:
				"Easily create relevant questions based on the map contexts you've generated.",
		},
		{
			icon: <DatasetIcon fontSize="large" />,
			title: "Dataset Management",
			description:
				"Organize, edit, and version your QnA datasets efficiently with our comprehensive tools.",
		},
		{
			icon: <AssessmentIcon fontSize="large" />,
			title: "Evaluation Results",
			description:
				"Showcase your model's performance using our built-in visualization tools.",
		},
	];

	return (
		<Box
			sx={{ flexGrow: 1, bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}
			className="flex flex-row items-center"
		>
			<Container maxWidth="lg">
				<Typography
					variant="h3"
					component="h2"
					gutterBottom
					align="center"
					sx={{ mb: 1, fontWeight: "bold", color: "#333" }}
				>
					MapQuest for NLP Researchers
				</Typography>
				<Typography
					variant="h6"
					align="center"
					sx={{ mb: 6, color: "#666" }}
				>
					Create, manage, and evaluate QnA datasets with place-related
					contexts
				</Typography>

				<Grid container spacing={4}>
					{features.map((feature, index) => (
						<Grid item xs={12} sm={6} md={3} key={index}>
							<Paper
								elevation={3}
								sx={{
									p: 3,
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									textAlign: "center",
								}}
							>
								<Icon
									color="primary"
									sx={{ fontSize: 40, mb: 2 }}
								>
									{feature.icon}
								</Icon>
								<Typography
									variant="h6"
									component="h3"
									gutterBottom
									sx={{ fontWeight: "bold" }}
								>
									{feature.title}
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{feature.description}
								</Typography>
							</Paper>
						</Grid>
					))}
				</Grid>

				<Box sx={{ mt: 8, textAlign: "center" }}>
					<Button
						variant="contained"
						size="large"
						// href="/home"
						sx={{
							px: 4,
							py: 1.5,
							fontSize: "1.1rem",
							backgroundColor: "#4285F4",
							"&:hover": {
								backgroundColor: "#3367D6",
							},
						}}
						onClick={() => router.push("/#onboard")}
					>
						Get Started
					</Button>
				</Box>
			</Container>
		</Box>
	);
}
