"use client";

import React, { use, useEffect, useState } from "react";
import {
	IconButton,
	Button,
	FormControl,
	Select,
	InputLabel,
	OutlinedInput,
	MenuItem,
	Radio,
	TextField,
	Divider,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faPen,
	faTrash,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import queryApi from "@/api/queryApi";
import QueryFields from "./QueryFields";
import dayjs from "dayjs";
import { Clear, Save } from "@mui/icons-material";
import mapApi from "@/api/mapApi";
import categories from "@/database/categories";
import { showSuccess } from "./home";
export default function QueryCard({
	initQuery,
	index,
	setSelectedPlacesMap,
	setDistanceMatrix,
	setNearbyPlacesMap,
	setCurrentInformation,
	setDirectionInformation,
	setSavedPlacesMap,
	setContext,
	context,
	setContextJSON,
	contextJSON,
	handleDelete,
	handleEdit,
	setPoisMap,
}) {
	const [expanded, setExpanded] = useState(false);
	const [mode, setMode] = useState("view");
	const [flag, setFlag] = useState(false);
	const [query, setQuery] = useState(initQuery);
	const [contextExpanded, setContextExpanded] = useState(false);
	const [difficulty, setDifficulty] = useState("Medium");
	const handleSave = async (place_id) => {
		const res = await mapApi.getDetails(place_id);
		if (res.success) {
			const details = res.data.result;
			console.log("Saving: ", details.name);
			setSavedPlacesMap((prev) => ({
				...prev,
				[place_id]: details,
			}));
		} else {
			console.error("Error fetching data: ", res.error);
			return;
		}
	};

	const calculateDifficulty = () => {
		const invalidCount =
			query.evaluation?.filter((e) => e.verdict === "invalid").length ||
			0;
		const rightCount =
			query.evaluation?.filter(
				(e) =>
					e.type === 0 &&
					(e.verdict === "right" ||
						e.option === query.answer.correct + 1)
			).length || 0;

		if (rightCount < 5) {
			return "Hard";
		} else if (rightCount > 10) {
			return "Easy";
		} else {
			return "Medium";
		}
	};

	useEffect(() => {
		setQuery(initQuery);
		setDifficulty(calculateDifficulty());
	}, [initQuery]);

	useEffect(() => {
		const invalidCount =
			query.evaluation?.filter(
				(e) => e.verdict === "invalid" && !e.option
			).length || 0;
		const rightCount =
			query.evaluation?.filter(
				(e) => e.verdict === "right" && e.type == 0
			).length || 0;
		const flag =
			query.evaluation?.filter(
				(e) => e.verdict === "wrong" && e.model_id === 9
			).length || 0;
		// if (invalidCount > 0) {
		// 	if (query.context !== "") setFlag(true);
		// 	else setFlag(false);
		// } else {
		// 	setFlag(query.human.answer === 0);
		// }

		setFlag(!flag && rightCount >= 16);
	}, [query]);
	return (
		<div
			className={`flex flex-col border-4 rounded-md w-full ${
				flag ? "border-red-500" : "border-black"
			}`}
		>
			<div className="flex flex-row items-center justify-between bg-black">
				<div className="flex flex-row gap-2 items-center">
					<h1 className="text-2xl font-bold text-white pl-2 py-2">
						{" "}
						# {query.id}
					</h1>
					{/* <div className="text-xl font-bold text-white px-1 lowercase border-2 rounded-md">
						{query.classification}
					</div> */}
					<div
						className={`text-xl font-bold px-1 lowercase border-2 rounded-md ${
							difficulty === "Hard"
								? "bg-red-500 border-red-700"
								: difficulty === "Medium"
								? "bg-orange-500 border-orange-700"
								: "bg-green-500 border-green-700"
						}`}
					>
						{difficulty}
					</div>
				</div>

				<div className="flex flex-row justify-end items-center">
					<h2 className="text-xl font-bold text-white px-1 flex flex-row gap-1 items-center">
						<FontAwesomeIcon icon={faUser} />
						{query.username}
					</h2>
					{mode == "view" && (
						<div>
							<IconButton
								sx={{ height: "3rem", width: "3rem" }}
								onClick={() => setExpanded((prev) => !prev)}
							>
								<div className="text-sm md:text-2xl">
									<FontAwesomeIcon
										icon={
											expanded
												? faChevronUp
												: faChevronDown
										}
										color="white"
									/>
								</div>
							</IconButton>
						</div>
					)}
				</div>
			</div>
			{mode === "edit" ? (
				<>
					<QueryFields
						{...{ contextJSON, context }}
						onSave={async (new_query) => {
							handleEdit(new_query, index);
							setMode("view");
							// window.location.reload();
						}}
						initialQuery={query}
					/>
					<Button onClick={() => setMode("view")}>Cancel</Button>
				</>
			) : expanded ? (
				<div className="p-2 flex flex-col gap-2">
					{/* <div className="flex flex-row gap-2">
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
								Category
							</InputLabel>
							<Select
								// multiple
								id="outlined-adornment"
								className="outlined-input"
								value={query.classification}
								onChange={(e) => {
									setQuery((prev) => ({
										...prev,
										classification: e.target.value,
									}));
								}}
								input={<OutlinedInput label={"Category"} />}
							>
								{categories.map((value, index) => (
									<MenuItem key={index} value={value}>
										{value}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Button
							variant="contained"
							color="primary"
							onClick={async () => {
								// await handleEdit(query, index);
								const res = await queryApi.updateCategory(
									query.id,
									query.classification
								);
								if (res.success) {
									showSuccess("Category Updated", res);
								}
							}}
							startIcon={<Save />}
						>
							Save
						</Button>
					</div> */}

					<div className="flex flex-col w-full border-2 border-blue-500">
						<div className="flex justify-center bg-blue-500 flex-row items-center">
							<h1 className="text-sm font-bold text-white p-2">
								{contextExpanded
									? "Hide Context"
									: "Show Context"}
							</h1>
							<IconButton
								sx={{ height: "2rem", width: "2rem" }}
								onClick={() =>
									setContextExpanded((prev) => !prev)
								}
							>
								<div className="text-base">
									<FontAwesomeIcon
										icon={
											contextExpanded
												? faChevronUp
												: faChevronDown
										}
										color="white"
									/>
								</div>
							</IconButton>
						</div>
						{contextExpanded && (
							<div className="p-2 flex flex-col gap-2">
								<h1 className="text-lg font-bold underline">
									Context (Template)
								</h1>
								<h1 className="text-base">
									{query.context
										.split("\n")
										.map((line, index) => (
											<React.Fragment key={index}>
												{/* {line} */}
												<p
													key={index}
													className="w-full text-left"
													dangerouslySetInnerHTML={{
														__html: line,
													}}
												/>
												{/* <br /> */}
											</React.Fragment>
										))}
								</h1>
								<h1 className="text-lg font-bold underline">
									Context (GPT)
								</h1>
								<h1 className="text-base">
									{query.context_gpt
										.split("\n")
										.map((line, index) => (
											<React.Fragment key={index}>
												{line}
												<br />
											</React.Fragment>
										))}
								</h1>
							</div>
						)}
					</div>

					<h1 className="text-xl font-bold underline">Question</h1>
					<h1 className="text-lg">{query.question}</h1>

					<h1 className="text-lg font-bold underline">Options</h1>
					{query.answer.type === "mcq" ? (
						<div className="flex flex-col gap-3">
							{query.answer.options.map(
								(option, index) =>
									option !== "" && (
										<div
											key={index}
											className="flex flex-row gap-2 items-center"
										>
											<Radio
												// checked={
												// 	query.answer.correct ===
												// 	index
												// }
												value={index}
												name="radio-buttons"
												disabled={true}
											/>
											<h1 className="text-lg">
												{option}
											</h1>
										</div>
									)
							)}
						</div>
					) : (
						<h1 className="text-lg">{query.answer.correct}</h1>
					)}

					{/* {query.evaluation?.length > 0 && (
						<div>
							<h1 className="text-lg font-bold underline">
								Evaluation
							</h1>
							<div className="flex flex-col gap-1">
								{query.evaluation?.map((e, index) => (
									<div
										key={index}
										className="flex flex-row gap-2"
									>
										<h1 className="text-lg w-1/2">
											{e.model}
										</h1>
										<h1 className="text-sm w-1/2 ">
											{e.answer}
										</h1>
										{e.verdict === "right" ||
										e.option ===
											query.answer.correct + 1 ? (
											<h1 className="text-lg w-1/2  text-green-500 font-semibold">
												Correct
											</h1>
										) : e.verdict == "invalid" ? (
											<h1 className="text-lg w-1/2 ">
												{"Can't answer"}
											</h1>
										) : (
											<h1 className="text-lg w-1/2  text-red-500 font-semibold">
												Wrong
											</h1>
										)}
									</div>
								))}
							</div>
						</div>
					)} */}
					<div className="flex flex-col gap-2 p-2 border-2 border-black rounded-md">
						<div className="flex flex-row justify-between">
							<h1 className="text-lg font-bold underline">
								Human Annotation
							</h1>
							<h2 className="text-lg font-semibold text-black px-1 flex flex-row gap-1 items-center">
								<FontAwesomeIcon icon={faUser} />
								{query.human.username}
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
										value={query.human.answer}
										onChange={(e) => {
											setQuery((prev) => ({
												...prev,
												human: {
													...prev.human,
													answer: e.target.value,
												},
											}));
										}}
										input={
											<OutlinedInput
												label={"Correct Answer"}
											/>
										}
									>
										<MenuItem value={0}>No answer</MenuItem>
										{query.answer.options.map(
											(value, index) => (
												<MenuItem
													key={index}
													value={index + 1}
												>
													{"Option " + (index + 1)}
												</MenuItem>
											)
										)}
									</Select>
								</FormControl>
								<TextField
									value={query.human.explanation}
									onChange={(e) => {
										setQuery((prev) => ({
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
											setQuery((prev) => ({
												...prev,
												human: {
													answer: null,
													explanation: "",
													username:
														prev.human.username,
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
											console.log(query.id);
											const res = await queryApi.annotate(
												query.id,
												{
													answer: query.human.answer,
													explanation:
														query.human.explanation,
												}
											);
											console.log(res);
											if (res.success) {
												setQuery((prev) => ({
													...prev,
													human: {
														...prev.human,
														username:
															res.data[0]
																.username,
													},
												}));
												showSuccess(
													"Annotation saved successfully",
													res
												);
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

					{/* <div className="w-full h-[0.2rem] bg-black" /> */}
					<div className="flex flex-row gap-2 mx-auto justify-end w-full">
						{/* <Button
							variant="contained"
							color="primary"
							onClick={() => {
								// Copy the question + context to the clipboard
								navigator.clipboard.writeText(
									`${query.question}\nContext:${query.context}`
								);
							}}
						>
							Copy
						</Button> */}
						{/* <Button
							variant="contained"
							color="primary"
							onClick={async () => {
								// Ask GPT for the answer
								const res = await gptApi.askGPT(query.id);
								if (res.success) {
									alert(
										parseInt(res.data) - 1 ===
											query.answer.correct
											? "Correct Answer"
											: "Wrong Answer" + "\n" + res.data
									);
								}
							}}
						>
							Ask GPT
						</Button> */}
						<Button
							variant="contained"
							color="primary"
							startIcon={<FontAwesomeIcon icon={faPen} />}
							onClick={async () => {
								setPoisMap({});
								setDistanceMatrix({});
								setNearbyPlacesMap({});
								setContext([]);
								setContextJSON({});
								setCurrentInformation({
									time: null,
									day: "",
									location: "",
								});
								setDirectionInformation({});
								setSelectedPlacesMap({});
								setSavedPlacesMap({});

								console.log("Saved Places Reset");
								for (let place_id in query.context_json
									.places) {
									await handleSave(place_id);
								}
								setSelectedPlacesMap(
									query.context_json.places ?? {}
								);
								setDistanceMatrix(
									query.context_json.distance_matrix ?? {}
								);
								setDirectionInformation(
									query.context_json.directions ?? {}
								);

								setNearbyPlacesMap(
									query.context_json.nearby_places ?? {}
								);
								setCurrentInformation(
									query.context_json.current_information
										? {
												time: query.context_json
													.current_information.time
													? dayjs(
															query.context_json
																.current_information
																.time
													  )
													: null,
												day: query.context_json
													.current_information.day,
												location:
													query.context_json
														.current_information
														.location,
										  }
										: {
												time: null,
												day: "",
												location: "",
										  }
								);
								setPoisMap(
									query.context_json.pois?.length > 0
										? query.context_json.pois
										: {}
								);
								setContext([]);
								setContextJSON({});
								setMode("edit");
							}}
						>
							Edit
						</Button>
						<Button
							variant="contained"
							color="error"
							startIcon={<FontAwesomeIcon icon={faTrash} />}
							onClick={() => handleDelete(index)}
						>
							Delete
						</Button>
					</div>
				</div>
			) : (
				<h1 className="text-lg px-1">{query.question}</h1>
			)}
		</div>
	);
}
