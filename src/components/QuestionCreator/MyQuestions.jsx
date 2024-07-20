"use client";
import React from "react";
import QuestionsContainer from "../Containers/QuestionsContainer";

export default function MyQuestions() {
	return (
		<QuestionsContainer
			title="My Questions"
			isPersonal={true}
			onEdit={() => window.scrollTo(0, 0)}
		/>
	);
}
