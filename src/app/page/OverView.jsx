"use client";
import { Button, Typography, Box, Tooltip, Zoom } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowDown,
	faArrowRight,
	faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import {
	ArrowRight,
	KeyboardArrowRight,
	KeyboardDoubleArrowDown,
	KeyboardDoubleArrowRight,
} from "@mui/icons-material";

export default function HomePage({ setSelected }) {
	const { queryStatus, contextStatus } = useContext(GlobalContext);
	const [showTooltip, setShowTooltip] = useState(false);
	const [contextClicked, setContextClicked] = useState(false);
	useEffect(() => {
		// Show the tooltip after a short delay
		const timer = setTimeout(() => setShowTooltip(true), 2000);
		return () => clearTimeout(timer);
	}, []);

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
			key: "live_evaluation",
		},
	];

	return (
		<div className="h-full flex md:items-center p-2 pt-5">
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
							<Tooltip
								title={
									step.key === "context" && !contextClicked
										? "Start here!"
										: ""
								}
								open={
									step.key === "context" &&
									showTooltip &&
									contextStatus === "empty"
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
											step.key === "context" &&
											showTooltip &&
											contextStatus === "empty"
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
										setSelected(step.key);
										setShowTooltip(false);
										if (step.key === "context") {
											setContextClicked(true);
										}
									}}
									disabled={
										(step.key === "question" &&
											contextStatus !== "saved") ||
										(step.key === "live_evaluation" &&
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
							</Tooltip>
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
				))}
			</div>
		</div>
	);
}
