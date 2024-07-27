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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

export default function HomePage({ setSelected }) {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	const steps = [
		{
			icon: (
				<MapIcon
					style={{
						fontSize: "2rem",
					}}
				/>
			),
			label: "Generate Context",
			description:
				"Generate rich, place-related contexts using our intuitive interface with Map Services.",
			key: "context",
		},
		{
			icon: (
				<QuestionAnswerIcon
					style={{
						fontSize: "2rem",
					}}
				/>
			),
			label: "Create Question",
			description:
				"Easily create relevant questions based on the map contexts you've generated.",
			key: "question",
		},
		// {
		// 	icon: <DatasetIcon />,
		// 	label: "Manage Datasets",
		// 	description: "Organize and version your QnA datasets",
		// },
		{
			icon: (
				<FontAwesomeIcon
					icon={faRobot}
					style={{
						fontSize: "2rem",
					}}
				/>
			),
			label: "Evaluate Models",
			description:
				"Evaluate open-source (Phi 3, Mistral, Qwen2) or closed-source (GPT, Gemini) models.",
			key: "evaluation",
		},
	];

	return (
		<div className="h-full flex items-center">
			<Grid
				container
				spacing={2}
				alignItems="center"
				justifyContent="center"
			>
				{steps.map((step, index) => (
					<>
						<Grid item key={step.label} xs={12} sm={6} md={2.5}>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									textAlign: "center",
								}}
							>
								<Button
									sx={{
										width: 80,
										height: 80,
										mb: 2,
										borderRadius: "50%",
										color: "white",
									}}
									variant="contained"
									onClick={() => setSelected(step.key)}
									href={`#${step.key}`}
								>
									{step.icon}
								</Button>
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
						{index < steps.length - 1 && (
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
						)}
					</>
				))}
			</Grid>
		</div>
	);
}
