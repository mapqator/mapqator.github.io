"use client";

import React, { useEffect, useState } from "react";
import {
	IconButton,
	Button,
	FormControl,
	Select,
	InputLabel,
	OutlinedInput,
	MenuItem,
	Radio,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faPen,
	faTrash,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import QueryApi from "@/api/queryApi";
import QueryFields from "./QueryFields";
import GptApi from "@/api/gptApi";
import dayjs from "dayjs";
import { Save } from "@mui/icons-material";
const queryApi = new QueryApi();
const gptApi = new GptApi();

export default function QueryCard({
	initQuery,
	index,
	setSelectedPlacesMap,
	setDistanceMatrix,
	setNearbyPlacesMap,
	setCurrentInformation,
	setDirectionInformation,
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

	useEffect(() => {
		setQuery(initQuery);
	}, [initQuery]);

	useEffect(() => {
		// Check if there is any invalid verdict in evaluation

		const invalid = query.evaluation?.find(
			(e) =>
				e.model !== "mistralai/Mixtral-8x7B-Instruct-v0.1" &&
				e.verdict === "invalid"
		);
		if (invalid) {
			setFlag(true);
		}
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
					<div className="text-xl font-bold text-white px-1 lowercase border-2 rounded-md">
						{query.classification}
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
				<QueryFields
					{...{ contextJSON, context }}
					onSave={async (new_query) => {
						handleEdit(new_query, index);
						setMode("view");
						// window.location.reload();
					}}
					initialQuery={query}
				/>
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
								multiple
								id="outlined-adornment"
								className="outlined-input"
								value={query.classification
									.split(",")
									.filter(Boolean)}
								onChange={(e) => {
									setQuery((prev) => ({
										...prev,
										classification:
											e.target.value.join(","),
									}));
								}}
								input={<OutlinedInput label={"Category"} />}
							>
								{[
									"nearby_poi",
									"planning",
									"time_calculation",
									"routing",
									"location_finding",
									"opinion",
									"navigation",
								].map((value, index) => (
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
								await handleEdit(query, index);
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
											className="flex flex-row gap-2"
										>
											<Radio
												checked={
													query.answer.correct ===
													index
												}
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

					{query.evaluation?.length > 0 && (
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
										{e.verdict == "invalid" ? (
											<h1 className="text-lg w-1/2 ">
												{"Can't answer"}
												{e.answer !== ""
													? "(" + e.answer + ")"
													: ""}
											</h1>
										) : e.verdict == "right" ? (
											<h1 className="text-lg w-1/2  text-green-500 font-semibold">
												Correct
											</h1>
										) : (
											<h1 className="text-lg w-1/2  text-red-500 font-semibold">
												Wrong {"(" + e.answer + ")"}
											</h1>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-row gap-2 mx-auto">
						<Button
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
						</Button>
						<Button
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
						</Button>
						<Button
							variant="contained"
							color="primary"
							startIcon={<FontAwesomeIcon icon={faPen} />}
							onClick={async () => {
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
						{/* <Button
							variant="contained"
							color="error"
							startIcon={<FontAwesomeIcon icon={faTrash} />}
							onClick={() => handleDelete(index)}
						>
							Delete
						</Button> */}
					</div>
				</div>
			) : (
				<h1 className="text-lg px-1">{query.question}</h1>
			)}
		</div>
	);
}
