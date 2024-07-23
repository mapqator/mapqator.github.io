"use client";
import React, { useContext, useEffect, useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	Select,
	MenuItem,
	IconButton,
	InputAdornment,
	InputLabel,
	Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import categories from "@/database/categories.json";
import { Clear, Save, WindowSharp } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import OptionsEditor from "../InputFields/OptionsEditor";
const queryApi = new QueryApi();

export default function CategorySelectionField() {
	const { query, setQuery } = useContext(GlobalContext);
	return (
		<FormControl
			variant="outlined"
			className="w-[20rem]"
			sx={{ mt: 2 }}
			size="small"
			required
		>
			<InputLabel>Category</InputLabel>
			<Select
				required
				multiple
				label={"Category"}
				placeholder="Choose a category of the question"
				id="outlined-adornment"
				className="outlined-input"
				value={query.classification.split(",").filter(Boolean)}
				onChange={(e) => {
					setQuery((prev) => ({
						...prev,
						classification: e.target.value.join(","),
					}));
				}}
				renderValue={(selected) => (
					<Box
						sx={{
							display: "flex",
							flexWrap: "wrap",
							gap: 0.5,
						}}
					>
						{selected.map((value) => (
							<Chip key={value} label={value} size="small" />
						))}
					</Box>
				)}
			>
				{categories.map((value, index) => (
					<MenuItem key={index} value={value}>
						{value}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
