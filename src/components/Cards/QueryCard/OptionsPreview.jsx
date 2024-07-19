"use client";
import React, { useState, useEffect, useContext } from "react";
import {
	Container,
	Typography,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Chip,
	List,
	ListItem,
	ListItemText,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Collapse,
	OutlinedInput,
	TextField,
	Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GlobalContext } from "@/contexts/GlobalContext";
import QueryApi from "@/api/queryApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Clear, Edit, Save } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import MapApi from "@/api/mapApi";

const queryApi = new QueryApi();
const mapApi = new MapApi();
export default function OptionsPreview({ answer }) {
	useEffect(() => {
		console.log(answer);
	}, [answer]);
	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="h6" gutterBottom>
				Options:
			</Typography>
			<List dense>
				{answer.options.map(
					(option, index) =>
						option !== "" && (
							<ListItem key={index}>
								<ListItemText
									primary={
										"Option " + (index + 1) + ": " + option
									}
									sx={{
										"& .MuiListItemText-primary": {
											fontWeight:
												index === answer.correct
													? "bold"
													: "normal",
											color:
												index === answer.correct
													? "success.main"
													: "inherit",
										},
									}}
								/>
								{index === answer.correct && (
									<Chip
										label="Correct"
										color="success"
										size="small"
									/>
								)}
							</ListItem>
						)
				)}
			</List>
		</Box>
	);
}
