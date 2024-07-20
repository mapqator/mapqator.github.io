"use client";
import React from "react";
import QuestionsContainer from "../Containers/QuestionsContainer";

export default function DatasetPage({ onEdit }) {
	return <QuestionsContainer title="Dataset Overview" onEdit={onEdit} />;
}
