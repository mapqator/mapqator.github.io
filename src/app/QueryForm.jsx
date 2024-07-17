"use client";

import React, { useEffect, useState } from "react";
import QueryApi from "@/api/queryApi";
const queryApi = new QueryApi();
import FormControl from "@mui/material/FormControl";
import {
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	IconButton,
	Button,
	TextField,
} from "@mui/material";
import QueryCard from "./QueryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import QueryFields from "./QueryFields";

export default function QueryForm({ contextJSON, context, handleSave }) {
	return (
		<div className="w-full flex flex-col items-center bg-white border-4 rounded-lg border-black">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">Create new query</h1>
				<p className="text-base text-white">Context+Question+Answer</p>
			</div>
			<QuerwwyFields {...{ contextJSON, context }} onSave={handleSave} />
		</div>
	);
}
