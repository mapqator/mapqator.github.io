"use client";
import React from "react";
import {
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	OutlinedInput,
	TextField,
	Card,
	CardContent,
	Divider,
} from "@mui/material";
import QueryApi from "@/api/queryApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Clear, Edit, Save } from "@mui/icons-material";
import { getUserName } from "@/api/base";
const queryApi = new QueryApi();
export default function Annotation({ state, setState }) {
	return (
		<>
			<Divider />
			<CardContent className="flex flex-col gap-2">
				<div className="flex flex-row justify-between">
					<h1 className="text-lg font-bold underline">
						Human Annotation
					</h1>
					<h2 className="text-lg font-semibold text-black px-1 flex flex-row gap-1 items-center">
						<FontAwesomeIcon icon={faUser} />
						{state.human?.username}
					</h2>
				</div>
				<div className="flex flex-col gap-3">
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
							value={state.human?.answer}
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
						value={state.human?.explanation}
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
						label="Comment"
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
								setState((prev) => ({
									...prev,
									human: {
										...prev.human,
										username: getUserName(),
									},
								}));
								const res = await queryApi.annotate(state.id, {
									answer: state.human?.answer,
									explanation: state.human?.explanation,
								});
								console.log(res);
								if (res.success) {
									// Success
								}
							}}
							startIcon={<Save />}
						>
							Annotate
						</Button>
					</div>
				</div>
			</CardContent>
			<Divider />
		</>
	);
}
