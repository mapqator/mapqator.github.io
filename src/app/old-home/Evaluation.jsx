"use client";

import { useEffect, useState } from "react";

export default function Evaluation({ queries, type }) {
	const [result, setResult] = useState({});

	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				valid_questions++;

				query.evaluation?.forEach((e) => {
					if (!tmp[e.model]) {
						tmp[e.model] = {
							correct: 0,
							invalid: 0,
							accuracy: 0,
							wrong: 0,
						};
					}
					if (e.type === type) {
						if (
							e.verdict === "right" ||
							e.option === query.answer.correct + 1
						) {
							tmp[e.model] = {
								...tmp[e.model],
								correct: tmp[e.model]?.correct
									? tmp[e.model].correct + 1
									: 1,
							};
						} else if (e.verdict == "wrong") {
							tmp[e.model] = {
								...tmp[e.model],
								wrong: tmp[e.model]?.wrong
									? tmp[e.model].wrong + 1
									: 1,
							};
						} else {
							console.log("Invalid question");
							tmp[e.model] = {
								...tmp[e.model],
								invalid: tmp[e.model]?.invalid
									? tmp[e.model].invalid + 1
									: 1,
							};
						}
						tmp[e.model].accuracy =
							(tmp[e.model].correct * 100.0) / valid_questions;
					}
					// console.log(query.id, tmp[e.model], e.model);
				});
			}
		});
		setResult(tmp);
		console.log(result);
	}, [queries]);

	return (
		<div className="w-full flex flex-col items-center bg-white border-4 rounded-lg border-black">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">Evaluation</h1>
			</div>
			<div className="w-full p-2">
				<div className="flex flex-row gap-2 font-bold">
					<h1 className="text-lg w-[40%]">Model</h1>
					<h1 className="text-lg w-[15%] text-center">Accuracy</h1>
					<h1 className="text-lg w-[15%] text-center">Correct</h1>
					<h1 className="text-lg w-[15%] text-center">Wrong</h1>
					<h1 className="text-lg w-[15%] text-center">No Answer</h1>
				</div>
				<hr className="bg-black border-black" />
				<div className="flex flex-col gap-1 w-full">
					{Object.keys(result).map((key, index) => (
						<div key={index} className="flex flex-row gap-2">
							<h1 className="text-lg w-[40%]">{key}</h1>
							<h1 className="text-lg w-[15%]  text-green-500 font-semibold text-center">
								{parseFloat(result[key].accuracy).toFixed(2)} %
							</h1>
							<h1 className="text-lg w-[15%]  text-green-500 font-semibold text-center">
								{result[key].correct}
							</h1>
							<h1 className="text-lg w-[15%]  text-red-500 font-semibold text-center">
								{result[key].wrong}
							</h1>
							<h1 className="text-lg w-[15%]  text-yellow-500 font-semibold text-center">
								{result[key].invalid}
							</h1>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
