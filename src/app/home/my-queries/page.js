"use client";

import QuestionsContainer from "@/components/Containers/QuestionsContainer";
import config from "@/config/config";
import { useAuth } from "@/contexts/AuthContext";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyQueriesPage() {
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!isAuthenticated) {
			router.push(config.logoutRedirect);
		}
	}, [isAuthenticated]);

	return (
		<Box className="py-5">
			<QuestionsContainer
				title="My Queries"
				isPersonal={true}
				onEdit={() => window.scrollTo(0, 0)}
			/>
		</Box>
	);
}
