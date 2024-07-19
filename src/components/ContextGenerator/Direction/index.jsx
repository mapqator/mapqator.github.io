"use client";

import React, { useContext, useEffect, useState } from "react";
import { CardContent, Divider } from "@mui/material";
import DirectionCard from "./DirectionCard";
import DirectionForm from "./DirectionForm";
import ContextViewer from "../ContextPreview";
import ContextGeneratorService from "@/services/contextGeneratorService";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function GetDirections() {
	const {
		selectedPlacesMap,
		savedPlacesMap,
		directionInformation,
		setDirectionInformation,
	} = useContext(GlobalContext);

	return (
		<CardContent>
			{Object.keys(directionInformation).map((from_id, index) => (
				<div className="flex flex-col">
					{Object.keys(directionInformation[from_id]).map((to_id) => (
						<DirectionCard
							{...{
								from_id,
								to_id,
							}}
						/>
					))}
				</div>
			))}
			<DirectionForm />
		</CardContent>
	);
}
