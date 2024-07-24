import React from "react";
import QuestionsContainer from "@/components/Containers/QuestionsContainer";

export default function DatasetPage({ onEdit }) {
	return <QuestionsContainer title="Dataset Overview" onEdit={onEdit} />;
}
