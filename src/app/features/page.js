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
import {
	faArrowDown,
	faArrowRight,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowDownward } from "@mui/icons-material";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function HomePage({ setSelected }) {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const { context, contextStatus } = useContext(GlobalContext);
	const { query, queryStatus } = useContext(GlobalContext);

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
			label: "Evaluate LLMs",
			description:
				"Context + Question pair will be used to evaluate the performance of closed-source LLMs.",
			key: "evaluation",
		},
	];

	return (
		<div className="h-full flex items-center">
			<div className="flex flex-col md:flex-row items-center mx-auto">
				{steps.map((step, index) => (
					<div
						key={index}
						className="flex flex-col md:flex-row items-center"
					>
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
								disabled={
									(step.key === "question" &&
										contextStatus !== "saved") ||
									(step.key === "evaluation" &&
										queryStatus !== "saved")
								}
								color={
									(step.key === "context" &&
										contextStatus === "saved") ||
									(step.key === "question" &&
										queryStatus === "saved")
										? "success"
										: "primary"
								}
							>
								{step.icon}
							</Button>
							<Typography variant="h6" sx={{ mb: 1 }}>
								{step.label}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{step.description}
							</Typography>
						</Box>
						{index < steps.length - 1 && (
							<>
								<div className="hidden md:flex">
									<FontAwesomeIcon
										icon={faArrowRight}
										style={{
											fontSize: "2rem",
										}}
									/>
								</div>
								<div className="flex md:hidden p-4">
									<FontAwesomeIcon
										icon={faArrowDown}
										style={{
											fontSize: "2rem",
										}}
									/>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
