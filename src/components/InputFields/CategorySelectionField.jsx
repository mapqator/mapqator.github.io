import React, { useContext } from "react";
import {
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	Tooltip,
	IconButton,
} from "@mui/material";
import { Info } from "@mui/icons-material";
import { GlobalContext } from "@/contexts/GlobalContext";
import categories from "@/database/categories.json";
import { convertFromSnake } from "@/services/utils";
import { useRouter } from "next/navigation";

export default function CategorySelectionField() {
	const { query, setQuery } = useContext(GlobalContext);
	const router = useRouter();

	const navigateToHelpPage = () => {
		router.push("/home/categories");
	};

	return (
		<FormControl fullWidth variant="outlined">
			<InputLabel>Category</InputLabel>
			<Select
				required
				label="Category"
				value={query.classification || ""}
				onChange={(e) => {
					setQuery((prev) => ({
						...prev,
						classification: e.target.value,
						question: "",
					}));
				}}
				endAdornment={
					<Tooltip title="Learn more about categories">
						<IconButton
							size="small"
							sx={{ mr: 2 }}
							onClick={navigateToHelpPage}
						>
							<Info />
						</IconButton>
					</Tooltip>
				}
			>
				{categories.map((value, index) => (
					<MenuItem key={index} value={value}>
						{convertFromSnake(value)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
