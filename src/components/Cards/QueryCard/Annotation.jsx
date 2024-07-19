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

export default function Annotation({ state, setState }) {
	return (
		<div className="flex flex-col gap-2 p-2 border-2 border-black rounded-md">
			<div className="flex flex-row justify-between">
				<h1 className="text-lg font-bold underline">
					Human Annotation
				</h1>
				<h2 className="text-lg font-semibold text-black px-1 flex flex-row gap-1 items-center">
					<FontAwesomeIcon icon={faUser} />
					{state.human.username}
				</h2>
			</div>
			<div className="flex flex-col gap-1">
				<div key={index} className="flex flex-col gap-2">
					<FormControl
						fullWidth
						className="input-field"
						variant="outlined"
						size="small"
					>
						<InputLabel
							htmlFor="outlined-adornment"
							className="input-label"
						>
							Correct Answer
						</InputLabel>
						<Select
							// multiple
							id="outlined-adornment"
							className="outlined-input"
							value={state.human.answer}
							onChange={(e) => {
								setState((prev) => ({
									...prev,
									human: {
										...prev.human,
										answer: e.target.value,
									},
								}));
							}}
							input={<OutlinedInput label={"Correct Answer"} />}
						>
							<MenuItem value={0}>No answer</MenuItem>
							{state.answer.options.map((value, index) => (
								<MenuItem key={index} value={index + 1}>
									{value}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						value={state.human.explanation}
						onChange={(e) => {
							setState((prev) => ({
								...prev,
								human: {
									...prev.human,
									explanation: e.target.value,
								},
							}));
						}}
						fullWidth
						label="Explanation"
						size="small"
						multiline
					/>
					<div className="flex flex-row gap-2">
						<Button
							variant="contained"
							color="error"
							onClick={async () => {
								setState((prev) => ({
									...prev,
									human: {
										answer: null,
										explanation: "",
										username: prev.human.username,
									},
								}));
							}}
							startIcon={<Clear />}
						>
							Clear
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={async () => {
								console.log(state.id);
								const res = await queryApi.annotate(state.id, {
									answer: state.human.answer,
									explanation: state.human.explanation,
								});
								console.log(res);
								if (res.success) {
									setState((prev) => ({
										...prev,
										human: {
											...prev.human,
											username: res.data[0].username,
										},
									}));
								}
							}}
							startIcon={<Save />}
						>
							Annotate
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
