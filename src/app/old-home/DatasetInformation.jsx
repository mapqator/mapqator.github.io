"use client";

import { useEffect, useState } from "react";

export default function DatasetInformation({ queries }) {
	const [state, setState] = useState(null);
	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		let total_questions = 0;
		let questions_with_context = 0;
		let questions_with_answer = 0;
		let ok = 0;

		queries.forEach((query) => {
			total_questions++;
			if (query.context !== "") {
				questions_with_context++;
			}
			if (query.answer.correct !== -1) {
				questions_with_answer++;
			}
			if (query.context !== "" && query.answer.correct !== -1) {
				const invalidCount =
					query.evaluation?.filter((e) => e.verdict === "invalid")
						.length || 0;
				if (invalidCount > 1) ok++;
				valid_questions++;
			}
		});
		tmp["total_questions"] = total_questions;
		tmp["questions_with_context"] = questions_with_context;
		tmp["questions_with_answer"] = questions_with_answer;
		tmp["valid_questions"] = valid_questions;
		tmp["ok"] = ok;
		setState(tmp);
	}, [queries]);
	return (
		<div className="w-full flex flex-col items-center bg-white border-4 rounded-lg border-black">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">Dataset Information</h1>
			</div>
			<div className="w-full p-2">
				<div className="flex flex-row gap-2 font-bold">
					<h1 className="text-lg w-[33%] text-center">
						Total Questions
					</h1>
					{/* <h1 className="text-lg w-[25%] text-center">No Context</h1>
					<h1 className="text-lg w-[25%] text-center">
						No Ground Truth
					</h1> */}
					<h1 className="text-lg w-[33%] text-center">
						Valid Questions
					</h1>
					<h1 className="text-lg w-[33%] text-center ">OK</h1>
				</div>
				<hr className="bg-black border-black" />
				<div className="flex flex-row gap-1 w-full">
					<h1 className="text-lg w-[33%] text-center">
						{state?.total_questions}
					</h1>
					{/* <h1 className="text-lg w-[25%] text-center">
						{(state?.total_questions ?? 0) -
							(state?.questions_with_context ?? 0)}
					</h1>
					<h1 className="text-lg w-[25%] text-center">
						{(state?.total_questions ?? 0) -
							(state?.questions_with_answer ?? 0)}
					</h1> */}
					<h1 className="text-lg w-[33%] text-center font-semibold">
						{state?.valid_questions}
					</h1>
					<h1 className="text-lg w-[33%] text-center text-green-500 font-semibold">
						{state?.ok}
					</h1>
				</div>
			</div>
		</div>
	);
}
