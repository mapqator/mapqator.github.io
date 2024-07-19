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
export default function CollapsedContext({ context }) {
	const [contextExpanded, setContextExpanded] = useState(false);
	return (
		<Box sx={{ mb: 2 }}>
			<Typography variant="h6" gutterBottom>
				Context:
			</Typography>
			<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.100" }}>
				{context.split("\n").map(
					(line, index) =>
						(contextExpanded || index < 5) && (
							<React.Fragment key={index}>
								<p
									key={index}
									className="w-full text-left"
									dangerouslySetInnerHTML={{
										__html: line,
									}}
								/>
							</React.Fragment>
						)
				)}
				{context.split("\n").length > 5 && (
					<Button
						onClick={() => setContextExpanded((prev) => !prev)}
						sx={{ mt: 1, textTransform: "none" }}
					>
						{contextExpanded ? "Show Less" : "Read More"}
					</Button>
				)}
			</Paper>
		</Box>
	);
}
