"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField } from "@mui/material";

export default function PlaceInformation({
	selectedPlacesMap,
	setSelectedPlacesMap,
	savedPlacesMap,
}) {
	return (
		Object.keys(selectedPlacesMap).length > 0 && (
			<div className="border-4 w-full border-black rounded-lg h-[30rem] overflow-y-auto">
				<div className="flex flex-col items-center bg-black">
					<h1 className="text-3xl text-white">Places Information</h1>
					<p className="text-lg text-white">
						Assign alias to the places
					</p>
				</div>
				<div className="flex flex-col items-center px-2">
					<div className="flex flex-col m-3 p-1 bg-blue-500 gap-1 w-full">
						<div className="flex flex-row">
							<h1 className="text-lg w-[70%] text-center font-bold">
								Place
							</h1>
							<h1 className="text-lg w-[30%] text-center font-bold">
								Alias
							</h1>
						</div>

						{Object.keys(selectedPlacesMap).map(
							(place_id, index) => (
								<div
									key={index}
									className="flex flex-row gap-1 items-center bg-white p-2"
								>
									<div className="flex flex-col gap-2 w-[70%]">
										<h1 className={`w-full text-left`}>
											{/* <h1 className="text-3xl">{index + 1}</h1> */}
											{savedPlacesMap[place_id].name}
											{/*- {savedPlacesMap[place_id].formatted_address} */}
										</h1>
										<FormControl
											// fullWidth
											className="input-field"
											variant="outlined"
											style={{ width: "20rem" }}
											size="small"
										>
											<InputLabel
												htmlFor="outlined-adornment"
												className="input-label"
											>
												Attributes
											</InputLabel>
											<Select
												required
												multiple
												id="outlined-adornment"
												className="outlined-input"
												value={
													selectedPlacesMap[place_id]
														.selectedAttributes
												}
												onChange={(event) => {
													const newAttributes =
														event.target.value;

													const newSelectedPlacesMap =
														{
															...selectedPlacesMap,
														};
													newSelectedPlacesMap[
														place_id
													].selectedAttributes =
														newAttributes;
													setSelectedPlacesMap(
														newSelectedPlacesMap
													);
												}}
												input={
													<OutlinedInput
														label={"Attributes"}
													/>
												}
												// MenuProps={MenuProps}
											>
												{selectedPlacesMap[
													place_id
												].attributes.map(
													(value, index) => (
														<MenuItem
															key={index}
															value={value}
															// sx={{ width: "2rem" }}
															// style={getStyles(name, personName, theme)}
														>
															{value}
														</MenuItem>
													)
												)}
											</Select>
										</FormControl>
									</div>
									<input
										type="text"
										placeholder="Alias"
										value={
											selectedPlacesMap[place_id].alias
										}
										className="border border-black p-2 w-[30%]"
										onChange={(event) => {
											const newSelectedPlacesMap = {
												...selectedPlacesMap,
											};
											newSelectedPlacesMap[
												place_id
											].alias = event.target.value;
											setSelectedPlacesMap(
												newSelectedPlacesMap
											);
										}}
									/>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		)
	);
}
