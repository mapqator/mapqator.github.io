"use client";

import React, { useEffect, useState } from "react";
import queryApi from "@/api/queryApi";
import gptApi from "@/api/gptApi";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	IconButton,
	Button,
	TextField,
	Select,
	MenuItem,
	Card,
} from "@mui/material";
import QueryCard from "./QueryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronDown,
	faChevronUp,
	faFloppyDisk,
	faRobot,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { Clear, Refresh, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function QueryFields({
	contextJSON,
	context,
	initialQuery,
	onSave,
}) {
	const [expanded, setExpanded] = useState(true);
	const init = {
		question: "",
		answer: {
			type: "mcq",
			options: ["", "", "", ""],
			correct: -1,
		},
		context: "",
		context_json: {},
		context_gpt: "",
		classification: "",
	};
	const [query, setQuery] = useState(init);
	const [translating, setTranslating] = useState(false);
	const [newOption, setNewOption] = useState("");
	useEffect(() => {
		if (initialQuery) {
			setQuery(initialQuery);
		}
	}, [initialQuery]);

	useEffect(() => {
		setQuery((prev) => ({
			...prev,
			context: context.reduce((acc, e) => acc + e + "\n", ""),
			context_json: contextJSON,
		}));
	}, [context]);
	return (
		<div className="p-2 flex flex-col w-full gap-5">
			{context.length > 0 && (
				<div className="flex flex-col w-full border-2 border-blue-500">
					<div className="flex justify-center bg-blue-500">
						<h1 className="text-sm font-bold text-white p-2">
							{expanded ? "Hide Context" : "Show Context"}
						</h1>
						<IconButton
							sx={{ height: "2rem", width: "2rem" }}
							onClick={() => setExpanded((prev) => !prev)}
						>
							<div className="text-base">
								<FontAwesomeIcon
									icon={
										expanded ? faChevronUp : faChevronDown
									}
									color="white"
								/>
							</div>
						</IconButton>
					</div>
					{expanded && (
						<div className="p-2 flex flex-col gap-2">
							<div className="flex flex-row gap-2 w-full justify-between items-center">
								<label className="text-lg text-left font-bold">
									Generated Context
								</label>
								<div className="flex flex-row gap-2">
									{/* {query.context !== "" && (
									<LoadingButton
										// className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
										variant="contained"
										onClick={async () => {
											setTranslating(true);
											console.log(query.context);
											const res = await gptApi.translate(
												query.context
											);
											if (res.success) {
												console.log(
													"Context translated successfully"
												);
												setQuery((prev) => ({
													...prev,
													context: res.data,
												}));
											} else {
												console.error(
													"Error translating context"
												);
											}
											setTranslating(false);
										}}
										loading={translating}
										className="flex flex-row gap-2 items-center"
									>
										Translate
									</LoadingButton>
								)} */}

									{/* <Button
									className="bg-green-500 rounded-lg p-2"
									onClick={() => {
										setQuery((prev) => ({
											...prev,
											context: context.reduce(
												(acc, e) => acc + e + "\n",
												""
											),
											context_json: contextJSON,
										}));
									}}
									variant="contained"
									color="success"
									disabled={context.length === 0}
								>
									{context.length === 0
										? "Generate context first"
										: "Use generated context"}
								</Button> */}
								</div>
							</div>
							{query.context !== "" && (
								<div className="flex flex-col gap-2">
									<Card
										value={query.context}
										onChange={(e) =>
											setQuery((prev) => ({
												...prev,
												context: e.target.value,
											}))
										}
										// sx={{
										// 	borderColor: "black",
										// 	borderWidth: "1px",
										// 	borderRadius: "3px",
										// 	// padding: "2px 5px",
										// }}
										className="p-3 w-full !bg-slate-100"
									>
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
									</Card>
									{/* <textarea
						className="border border-black w-full"
						value={query.context}
						onChange={(e) =>
							setQuery((prev) => ({
								...prev,
								context: e.target.value,
							}))
						}
					/> */}
									<div className="flex flex-row gap-2 w-full justify-between items-center">
										<label className="text-lg text-left font-bold">
											Custom Context
										</label>
										<Button
											// className="bg-blue-500 rounded-lg p-2 mt-2 w-full"
											variant="contained"
											onClick={async () => {
												console.log(query.context);
												setQuery((prev) => ({
													...prev,
													context_gpt:
														"Generating context. Please wait. It may take 20-30 seconds.",
												}));
												const res =
													await queryApi.getGPTContext(
														query.context
													);
												if (res.success) {
													console.log(
														"Context generated successfully"
													);
													setQuery((prev) => ({
														...prev,
														context_gpt: res.data,
													}));
												} else {
													console.error(
														"Error generating context"
													);
												}
											}}
											className="flex flex-row gap-2 items-center"
										>
											<FontAwesomeIcon
												icon={faRobot}
												className="text-xl"
											/>
											Take help from GPT
										</Button>
									</div>
									{query.context_gpt !== "" && (
										<TextField
											value={query.context_gpt}
											onChange={(e) =>
												setQuery((prev) => ({
													...prev,
													context_gpt: e.target.value,
												}))
											}
											style={{
												borderColor: "black",
												borderWidth: "1px",
												borderRadius: "3px",
												// padding: "2px 5px",
											}}
											size="small"
											multiline
										/>
									)}

									{/* <textarea
						className="border border-black w-full"
						value={query.context_gpt}
						onChange={(e) =>
							setQuery((prev) => ({
								...prev,
								context_gpt: e.target.value,
							}))
						}
					/> */}
								</div>
							)}
						</div>
					)}
				</div>
			)}

			{/* <div className="border-t-4 border-black w-full mt-2"></div> */}

			<div className="flex flex-col gap-2">
				<label className="text-lg w-full text-left font-bold flex flex-row gap-2">
					Question
					<h1 className="font-normal">
						(Use place names exactly as in context)
					</h1>
				</label>
				<TextField
					value={query.question}
					onChange={(e) =>
						setQuery((prev) => ({
							...prev,
							question: e.target.value,
						}))
					}
					style={{
						borderColor: "black",
						borderWidth: "1px",
						borderRadius: "3px",
						// padding: "2px 5px",
					}}
					size="small"
					multiline
				/>
			</div>

			<div className="flex flex-col gap-2">
				<div className="flex flex-row">
					<FormLabel id="demo-radio-buttons-group-label">
						<label className="text-lg w-full text-left font-bold text-black focus:text-black flex flex-row gap-2">
							Options{" "}
							<h1 className="font-normal">
								(Mark correct option)
							</h1>
						</label>
					</FormLabel>
					{/* <FormControl fullWidth>
					<RadioGroup
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="mcq"
						name="radio-buttons-group"
						value={query.answer.type}
						onChange={(e) =>
							setQuery((prev) => ({
								...prev,
								answer: {
									...prev.answer,
									type: e.target.value,
									correct: e.target.value === "mcq" ? -1 : "",
									options:
										e.target.value === "mcq"
											? []
											: undefined,
								},
							}))
						}
						row
					>
						<FormControlLabel
							value="mcq"
							control={<Radio />}
							label="MCQ"
						/>
						<FormControlLabel
							value="short"
							control={<Radio />}
							label="Short"
						/>
						<FormControlLabel value="other" control={<Radio />} label="Other" />
					</RadioGroup>
				</FormControl> */}
				</div>

				{query.answer.type === "mcq" ? (
					<div className="w-full flex flex-col gap-2">
						<div className="flex flex-row justify-start items-center gap-2">
							{/* <TextField
							type="text"
							className="border border-black mr-auto !w-[80%]"
							value={newOption}
							onChange={(e) => setNewOption(e.target.value)}
							size="small"
							label="Option"
							fullWidth
						/> */}
							{/* 
						<input
							type="text"
							placeholder="Option"
							className="border border-black rounded p-2"
							value={newOption}
							onChange={(e) => setNewOption(e.target.value)}
						/> */}
							{/* <Button
							variant="contained"
							className="h-10 !w-[20%]"
							fullWidth
							onClick={() => {
								if (newOption === "") return;
								setQuery((prev) => ({
									...prev,
									answer: {
										...prev.answer,
										options: [
											...prev.answer.options,
											newOption,
										],
									},
								}));
								setNewOption("");
							}}
						>
							+ Add option
						</Button> */}
						</div>
						<div className="flex flex-col gap-2">
							{query.answer.options.map((option, index) => (
								<div
									key={index}
									className="flex flex-row justify-start items-center gap-2"
								>
									<Radio
										checked={query.answer.correct === index}
										onChange={() =>
											setQuery((prev) => ({
												...prev,
												answer: {
													...prev.answer,
													correct:
														prev.answer.correct ===
														index
															? -1
															: index,
												},
											}))
										}
										value={index}
										name="radio-buttons"
										inputProps={{
											"aria-label": `Option ${index}`,
										}}
										disabled={option === ""}
									/>
									<TextField
										// className="text-lg border-2 w-full"
										multiline
										value={option}
										size={"small"}
										fullWidth
										label={`Option ${index + 1}`}
										onChange={(e) => {
											setQuery((prev) => {
												const options = [
													...prev.answer.options,
												];
												options[index] = e.target.value;
												return {
													...prev,
													answer: {
														...prev.answer,
														options,
													},
												};
											});
										}}
									></TextField>
									{/* <input
									type="text"
									className="text-lg border-2 w-full"
									value={option}
									onChange={(e) => {
										setQuery((prev) => {
											const options = [
												...prev.answer.options,
											];
											options[index] = e.target.value;
											return {
												...prev,
												answer: {
													...prev.answer,
													options,
												},
											};
										});
									}}
								/> */}
									{/* <IconButton
									onClick={() => {
										setQuery((prev) => {
											const options = [
												...prev.answer.options,
											];
											options.splice(index, 1);
											return {
												...prev,
												answer: {
													...prev.answer,
													options,
												},
											};
										});
									}}
									sx={{ height: "2rem", width: "2rem" }}
								>
									<FontAwesomeIcon
										icon={faTrash}
										color="red"
										size="sm"
									/>
								</IconButton> */}
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col mb-2">
						<TextField
							value={query.answer.correct}
							onChange={(e) =>
								setQuery((prev) => ({
									...prev,
									answer: {
										...prev.answer,
										correct: e.target.value,
									},
								}))
							}
							style={{
								borderColor: "black",
								borderWidth: "1px",
								borderRadius: "3px",
								// padding: "2px 5px",
							}}
							multiline
						/>
						{/* <textarea
						className="border border-black w-full"
						value={query.answer.correct}
						onChange={(e) =>
							setQuery((prev) => ({
								...prev,
								answer: {
									...prev.answer,
									correct: e.target.value,
								},
							}))
						}
					/> */}
					</div>
				)}
			</div>

			{/* <div className="flex flex-col gap-2 mr-auto">
				<label className="text-lg text-left font-bold">Category</label>
				<TextField
					type="text"
					className="border border-black mr-auto"
					value={query.classification}
					onChange={(e) =>
						setQuery((prev) => ({
							...prev,
							classification: e.target.value,
						}))
					}
					size="small"
					// label="Category"
				/>
			</div> */}

			<div className="ml-auto w-full font-bold flex flex-col md:flex-row gap-2 justify-between">
				<div className="input-field w-full md:w-1/2">
					<FormControl fullWidth variant="outlined" size="small">
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
									classification: e.target.value.join(","),
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
				</div>

				<div className="flex flex-row gap-2">
					<Button
						onClick={() => setQuery(init)}
						variant="contained"
						size="small"
						startIcon={<Clear />}
						color="error"
						fullWidth
					>
						Clear
					</Button>
					<Button
						onClick={() => {
							let flag = false;
							const options = query.answer.options;
							for (let i = 0; i < options.length; i++) {
								if (options[i] === "") {
									flag = true;
								}
								if (options[i] !== "" && flag) {
									alert(
										"Can't save. You need to fill option " +
											i +
											" first to use option " +
											(i + 1)
									);
									return;
								}
							}

							onSave(query);
							setQuery(init);
						}}
						startIcon={<Save />}
						variant="contained"
						fullWidth
						disabled={query.context === "" || query.question === ""}
					>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
