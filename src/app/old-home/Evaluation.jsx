"use client";

import { all } from "axios";
import { useEffect, useState } from "react";

export default function Evaluation({ queries, type }) {
	const [result, setResult] = useState({});
	const [metrics, setMetrics] = useState({
		0: {
			variant: "",
			all: "",
			poi: "",
			nearby: "",
			routing: "",
			trip: "",
		},
	});
	useEffect(() => {
		const tmp = {};
		let valid_questions = 0;
		queries.forEach((query) => {
			if (query.context !== "") {
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
							(e.option === null && e.verdict === "right") ||
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

	useEffect(() => {
		let valid_questions = {
			all: 0,
			poi: 0,
			nearby: 0,
			routing: 0,
			trip: 0,
			unanswerable: 0,
		};
		const tmp = {};
		let annotation = {
			right: 0,
			wrong: 0,
			invalid: 0,
		};
		queries.forEach((query) => {
			if (query.context !== "") {
				if (!query.classification) {
					query.classification = "unanswerable";
				}

				valid_questions[query.classification]++;
				valid_questions["all"]++;

				if (query.human.username === "almash") {
					if (query.human.answer === query.answer.correct + 1) {
						annotation["right"]++;
					} else if (!query.human.answer) {
						annotation["invalid"]++;
					} else {
						annotation["wrong"]++;
					}
				}

				query.evaluation?.forEach((e) => {
					if (!tmp[e.model_id]) {
						tmp[e.model_id] = {
							variant: e.variant,
							all: 0,
							poi: 0,
							nearby: 0,
							routing: 0,
							trip: 0,
							unanswerable: 0,
						};
					}
					if (e.type === type) {
						if (
							(e.option === null && e.verdict === "right") ||
							e.option === query.answer.correct + 1
						) {
							tmp[e.model_id] = {
								...tmp[e.model_id],
								all: tmp[e.model_id].all + 1,
								[query.classification]:
									tmp[e.model_id][query.classification] + 1,
							};
						}
					}
				});
			}
		});
		setMetrics(tmp);
		console.log("Metrics:", tmp);
		console.log(`
			\\begin{tabular}{|l|c|c|c|c|c|c|}
			\hline
			\\textbf{Model} & \\textbf{Correct} & \\textbf{Overall} & \\textbf{Place Info} & \\textbf{Nearby} & \\textbf{Routing} & \\textbf{Trip} \\\\
			\hline
		`);
		let result = "";

		const tmpArray = Object.entries(tmp);
		tmpArray.sort((a, b) => b[1].all - a[1].all);

		console.log("Total unanswerable: ", valid_questions.unanswerable);
		tmpArray.forEach(([key, value]) => {
			result += `${value.variant} &
			${value.all} 
			& ${((value.all * 100) / valid_questions.all).toFixed(2)} & ${(
				(value.poi * 100) /
				valid_questions.poi
			).toFixed(2)} & ${(
				(value.nearby * 100) /
				valid_questions.nearby
			).toFixed(2)} & ${(
				(value.routing * 100) /
				valid_questions.routing
			).toFixed(2)} & ${(
				(value.trip * 100) /
				valid_questions.trip
			).toFixed(2)} & ${(
				(value.unanswerable * 100) /
				valid_questions.unanswerable
			).toFixed(2)} \\\\
`;
		});
		console.log(result);

		console.log(`\\hline
			\\end{tabular}`);

		console.log("Human: ", annotation);

		// Generate LaTeX tikzpicture code
		let tikzResult = `
\\begin{figure}[ht]
    \\centering
    \\begin{tikzpicture}
\\begin{axis}[
    ybar=1,
    symbolic x coords={Place Info, Nearby, Routing, Trip, Unanswerable},
    xtick=data,
    ylabel=Accuracy (\\%),
    ymin=0, ymax=100,
    enlarge x limits=0.15,
    width=1\\textwidth,
    height=0.25\\textheight,
    bar width=4pt,
    legend style={at={(0.5,-0.2)}, anchor=north,legend columns=4, draw=none,column sep=1ex},
    clip=false,
    grid=major,
    minor grid style={},
    ylabel style={yshift=-10pt},
    axis lines*=left,
    legend cell align={left}
    ]
`;

		// Add data for each model
		tmpArray.forEach(([key, value]) => {
			tikzResult += `\\addplot[fill=${getColor(
				key
			)}, line width=0pt] coordinates {(Place Info,${(
				(value.poi * 100) /
				valid_questions.poi
			).toFixed(2)}) (Nearby,${(
				(value.nearby * 100) /
				valid_questions.nearby
			).toFixed(2)}) (Routing,${(
				(value.routing * 100) /
				valid_questions.routing
			).toFixed(2)}) (Trip,${(
				(value.trip * 100) /
				valid_questions.trip
			).toFixed(2)}) (Unanswerable,${(
				(value.unanswerable * 100) /
				valid_questions.unanswerable
			).toFixed(2)})}; % ${value.variant}\n`;
		});

		// Add legend
		tikzResult += `\\legend{${tmpArray
			.map(([key, value]) => value.variant)
			.join(",")}}\n`;

		tikzResult += `
\\end{axis}
    \\end{tikzpicture}
\\end{figure}
`;

		console.log(tikzResult);

		// Function to get color based on key (you can customize this)
		function getColor(key) {
			const colors = [
				"pink!50",
				"magenta!50",
				"purple!50",
				"lime!50",
				"cyan!50",
				"teal!50",
				"brown!50",
				"blue!50",
				"violet!50",
				"orange!50",
				"red!50",
				"gray!50",
				"yellow!50",
			];
			return colors[key % colors.length];
		}
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
