"use client";

import React, { useEffect, useState } from "react";
import PlaceApi from "@/api/placeApi";
const placeApi = new PlaceApi();
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Select, MenuItem, Button, TextField } from "@mui/material";

export function ContextPreview({ context }) {
	return (
		<div className="p-2 flex flex-col gap-2 w-full min-h-16">
			{context.length > 0 ? (
				context.map((text, index) => (
					<p
						key={index}
						className="w-full text-left"
						dangerouslySetInnerHTML={{
							__html: text,
						}}
					/>
				))
			) : (
				<p className="text-center my-auto text-xl text-zinc-400">
					No context generated. Add information first.
				</p>
			)}
		</div>
	);
}
export default function ContextPreview({ context }) {
	return (
		// Object.keys(selectedPlacesMap).length > 0 &&
		<div className="flex flex-col border-4 w-full border-black rounded-lg">
			<div className="flex flex-col items-center bg-black text-center pb-2">
				<h1 className="text-xl md:text-3xl text-white">
					Generated Context
				</h1>
				<p className="text-sm md:text-lg text-zinc-300">
					Context generated by our system
				</p>
			</div>
			<ContextPreview context={context} />
		</div>
	);
}
