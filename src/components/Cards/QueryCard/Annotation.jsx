"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { GlobalContext } from "@/contexts/GlobalContext";
import { showError } from "@/app/page";
const queryApi = new QueryApi();
export default function Annotation({ state, setState }) {
	const { isAuthenticated } = useContext(GlobalContext);
	const [value, setValue] = useState({
		answer: "",
		explanation: "",
		username: "",
	});

	useEffect(() => {
		if (state.human) {
			console.log("Annotation: ", state.human);
			setValue(state.human);
		}
	}, [state]);
	return (
		<>
			<Divider />
			<CardContent className="flex flex-col gap-2 w-full md:w-[30rem] mx-auto">
				<div className="flex flex-row justify-between">
					<h1 className="text-lg font-bold underline">
						Human Annotation
					</h1>
					<h2 className="text-lg font-semibold text-black px-1 flex flex-row gap-1 items-center">
						<FontAwesomeIcon icon={faUser} />
						{value.username}
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
							value={value.answer}
							onChange={(e) => {
								console.log(e.target.value);
								setValue((prev) => ({
									...prev,
									answer: e.target.value,
								}));
							}}
							input={<OutlinedInput label={"Correct Answer"} />}
						>
							<MenuItem value={0}>No answer</MenuItem>
							{state.answer.options.map((option, index) => (
								<MenuItem key={index} value={index + 1}>
									{option}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						value={value.explanation}
						onChange={(e) => {
							setValue((prev) => ({
								...prev,
								explanation: e.target.value,
							}));
						}}
						fullWidth
						label="Comment"
						size="small"
						multiline
						minRows={3}
					/>
					<div className="flex flex-row gap-2">
						<Button
							variant="contained"
							color="primary"
							onClick={async () => {
								if (isAuthenticated) {
									const res = await queryApi.annotate(
										state.id,
										{
											answer: value.answer,
											explanation: value.explanation,
										}
									);
									console.log(res);
									if (res.success) {
										setState((prev) => ({
											...prev,
											human: {
												answer: value.answer,
												explanation: value.explanation,
												username: res.data[0].username,
											},
										}));
									} else {
										showError("Can't save annotation");
									}
								} else {
									setState((prev) => ({
										...prev,
										human: {
											answer: value.answer,
											explanation: value.explanation,
											username: getUserName(),
										},
									}));
								}
							}}
							startIcon={<Save />}
						>
							Annotate
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={async () => {
								setValue((prev) => ({
									answer: null,
									explanation: "",
									username: prev.username,
								}));
							}}
							startIcon={<Clear />}
						>
							Clear
						</Button>
					</div>
				</div>
			</CardContent>
			<Divider />
		</>
	);
}
