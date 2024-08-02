"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";
import config from "@/config/config";
import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { AppContext } from "@/contexts/AppContext";
import {
	Button,
	Typography,
	Box,
	Tooltip,
	Zoom,
	Container,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowDown,
	faArrowRight,
	faLightbulb,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";
import {
	ArrowRight,
	Description,
	Info,
	KeyboardArrowRight,
	KeyboardDoubleArrowDown,
	KeyboardDoubleArrowRight,
	Lightbulb,
	QuestionMark,
} from "@mui/icons-material";

export default function Home() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	const { queryStatus, contextStatus, answerStatus } =
		useContext(GlobalContext);
	const [showTooltip, setShowTooltip] = useState(false);
	const [contextClicked, setContextClicked] = useState(false);
	useEffect(() => {
		// Show the tooltip after a short delay
		const timer = setTimeout(() => setShowTooltip(true), 1000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (contextStatus === "empty") {
			router.push("/home");
		}
	}, [contextStatus]);

	const steps = [
		{
			icon: (
				<QuestionMark
					style={{
						fontSize: "2rem",
					}}
				/>
			),
			label: "Ask Question",
			description:
				"Start by writing location-based questions that you want to answer.",
			key: "question",
			to: "/home/question",
		},
		{
			icon: (
				<Description
					style={{
						fontSize: "2rem",
					}}
				/>
			),
			label: "Add Necessary Information",
			description:
				"Gather detailed geospatial information from map services to answer the question.",
			key: "context",
			to: "/home/context",
		},
		{
			icon: (
				<Lightbulb
					style={{
						fontSize: "2rem",
					}}
				/>
			),
			label: "Give Answer",
			description:
				"Provide an answer to complete the question-context pair.",
			key: "answer",
			to: "/home/answer",
		},
		// {
		// 	icon: (
		// 		<FontAwesomeIcon
		// 			icon={faRobot}
		// 			style={{
		// 				fontSize: "2rem",
		// 			}}
		// 		/>
		// 	),
		// 	label: "Evaluate LLMs",
		// 	description:
		// 		"Context + Question pair will be used to evaluate the performance of closed-source LLMs.",
		// 	key: "live_evaluation",
		// 	to: "/home/evaluation",
		// },
	];

	return (
		<>
			<Box
				className="p-0 mx-auto flex flex-col justify-center items-center gap-5 w-full relative"
				sx={{
					minHeight: `calc(100vh - ${config.topbarHeight}px)`,
				}}
			>
				<div className="flex flex-col md:flex-row items-center justify-center mx-auto">
					{steps.map((step, index) => (
						<>
							<div
								key={index}
								className="flex flex-col md:flex-row items-center w-[30%]"
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										textAlign: "center",
									}}
								>
									<Tooltip
										title={"Click here!"}
										open={
											showTooltip &&
											((step.key === "question" &&
												queryStatus === "empty") ||
												(step.key === "context" &&
													queryStatus === "saved" &&
													contextStatus !==
														"saved") ||
												(step.key === "answer" &&
													answerStatus !== "saved" &&
													contextStatus === "saved" &&
													queryStatus === "saved"))
										}
										arrow
										TransitionComponent={Zoom}
										placement="top"
									>
										<Button
											sx={{
												width: 80,
												height: 80,
												mb: 2,
												borderRadius: "50%",
												color: "white",
												animation:
													showTooltip &&
													((step.key === "question" &&
														queryStatus ===
															"empty") ||
														(step.key ===
															"context" &&
															queryStatus ===
																"saved" &&
															contextStatus !==
																"saved") ||
														(step.key ===
															"answer" &&
															answerStatus !==
																"saved" &&
															contextStatus ===
																"saved" &&
															queryStatus ===
																"saved"))
														? "pulse 2s infinite"
														: "none",
												"@keyframes pulse": {
													"0%": {
														boxShadow:
															"0 0 0 0 rgba(0, 123, 255, 0.7)",
													},
													"70%": {
														boxShadow:
															"0 0 0 10px rgba(0, 123, 255, 0)",
													},
													"100%": {
														boxShadow:
															"0 0 0 0 rgba(0, 123, 255, 0)",
													},
												},
											}}
											variant="contained"
											onClick={() => {
												router.push(step.to);
												setShowTooltip(false);
												if (step.key === "context") {
													setContextClicked(true);
												}
											}}
											disabled={
												(step.key === "context" &&
													queryStatus !== "saved") ||
												(step.key === "answer" &&
													(queryStatus !== "saved" ||
														contextStatus !==
															"saved"))
											}
											color={
												(step.key === "context" &&
													contextStatus ===
														"saved") ||
												(step.key === "question" &&
													queryStatus === "saved") ||
												(step.key === "answer" &&
													answerStatus === "saved")
													? "success"
													: "primary"
											}
										>
											{step.icon}
										</Button>
									</Tooltip>
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
							</div>
							<div>
								{index < steps.length - 1 && (
									<>
										<div className="hidden md:flex">
											{/* <FontAwesomeIcon
										icon={faArrowRight}
										style={{
											fontSize: "2rem",
										}}
									/> */}
											<KeyboardDoubleArrowRight />
										</div>
										<div className="flex md:hidden p-4">
											{/* <FontAwesomeIcon
										icon={faArrowDown}
										style={{
											fontSize: "2rem",
										}}
									/> */}
											<KeyboardDoubleArrowDown />
										</div>
									</>
								)}
							</div>
						</>
					))}
				</div>

				<Button
					onClick={() => router.push("/home/explore")}
					variant="outlined"
					className="absolute bottom-0"
					sx={{
						position: "absolute",
						bottom: "10vh",
					}}
				>
					See Examples
				</Button>
			</Box>
		</>
	);
}
