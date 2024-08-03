"use client";
import config from "@/config/config";
import { Button, Box } from "@mui/material";
import WorkFlow from "./WorkFlow";

export default function Home() {
	return (
		<>
			<Box
				className="p-0 mx-auto flex flex-col justify-center items-center gap-5 w-full relative"
				sx={{
					minHeight: `calc(100vh - ${config.topbarHeight}px)`,
				}}
			>
				<WorkFlow />
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
