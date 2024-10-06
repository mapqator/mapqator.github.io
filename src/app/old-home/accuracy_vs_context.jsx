import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const AccuracyVsContext = ({ queries, type }) => {
	const [chart, setChart] = useState({
		series: [],
		options: {},
	});
	const [models, setModels] = useState([]);

	const fetchModels = async () => {
		const res = await queryApi.getModels();
		if (res.success) {
			setModels(res.data);
		}
	};

	useEffect(() => {
		fetchModels();
	}, []);

	useEffect(() => {
		if (queries.length === 0 || models.length === 0) return;

		const ranges = [
			{ label: "0-300", min: 0, max: 300, count: 0 },
			{ label: "301-600", min: 301, max: 600, count: 0 },
			{ label: "601-900", min: 601, max: 900, count: 0 },
			{ label: "901-1200", min: 901, max: 1200, count: 0 },
			{ label: "1201-1500", min: 1201, max: 1500, count: 0 },
		];

		let total = 0;
		// Initialize the data structure for storing accuracy by range and model
		const rangeData = {};
		ranges.forEach((range) => {
			rangeData[range.label] = {};
			models.forEach((model) => {
				// console.log("Model:", model, "Range:", range.label);
				rangeData[range.label][model.name] = { correct: 0, total: 0 };
			});
		});

		// console.log("Range Data:", rangeData);

		// Process each query and categorize by context length and model
		queries.forEach((query) => {
			if (query.context !== "") {
				total += 1;
				const contextLength = query.context.split(/\s+/).length;

				// Determine the range for this query
				const range = ranges.find(
					(r) => contextLength >= r.min && contextLength <= r.max
				);

				// Update the range count
				range.count += 1;

				console.log("Context Length:", contextLength, "Range:", range);
				if (!range) return;

				query.evaluation?.forEach((e) => {
					// if (models.includes(e.model) && e.type === type)
					{
						console.log(
							"Passage ID:",
							"Model:",
							e.model,
							"Range:",
							range.label
						);
						const modelData = rangeData[range.label][e.model];
						modelData.total += 1;

						// Mark as correct if the model's option matches the correct answer
						if (
							(e.option === null && e.verdict === "right") ||
							e.option === query.answer.correct + 1
						) {
							modelData.correct += 1;
						}
						rangeData[range.label][e.model] = modelData;
					}
				});
			}
		});

		console.log("Ranges:", ranges);
		console.log("Accuracy vs Context:", rangeData);
		// Prepare data for the chart
		const series = models.map((model) => ({
			name: model.name,
			data: ranges.map((range) => {
				const modelStats = rangeData[range.label][model.name];
				const accuracy =
					modelStats.total > 0
						? (modelStats.correct / modelStats.total) * 100
						: 0;
				return accuracy.toFixed(2); // Keep accuracy to 2 decimal places
			}),
		}));

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

		// Add bars for each model
		models.forEach((model, index) => {
			tikzResult += `\\addplot coordinates {${ranges
				.map((range) => {
					const modelStats = rangeData[range.label][model.name];
					const accuracy =
						modelStats.total > 0
							? (modelStats.correct / modelStats.total) * 100
							: 0;
					return `(${range.label}, ${accuracy.toFixed(2)})`;
				})
				.join(" ")}};
        `;
		});

		// Add legend
		tikzResult += `\\legend{${models
			.map((model) => model.name)
			.join(",")}}\n`;
		tikzResult += `
\\end{axis}
    \\end{tikzpicture}
    \\caption{Accuracy vs. Context Length for each model}
\\end{figure}
`;

		console.log(tikzResult); // This outputs the TikZ code
		// Update chart options and series
		setChart({
			series: series,
			options: {
				chart: {
					type: "bar",
					height: 350,
					stacked: false,
				},
				plotOptions: {
					bar: {
						horizontal: false,
						dataLabels: {
							position: "top",
						},
					},
				},
				xaxis: {
					categories: ranges.map((range) => range.label),
					title: {
						text: "Context Length (words)",
					},
				},
				yaxis: {
					title: {
						text: "Accuracy (%)",
					},
					labels: {
						formatter: (value) => `${value}%`,
					},
				},
				tooltip: {
					y: {
						formatter: (value) => `${value}%`,
					},
				},
				dataLabels: {
					enabled: false,
				},
			},
		});
	}, [queries, models, type]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Accuracy vs. Context Length
			</h2>
			<Divider />
			<div className="h-full p-3">
				{chart.series.length > 0 && queries.length > 0 ? (
					<ApexCharts
						options={chart.options}
						series={chart.series}
						type="bar"
						height="350px"
					/>
				) : (
					<div className="absolute top-0 left-0 h-full w-full">
						<div className="flex justify-center items-center h-full text-gray-300 dark:text-slate-600 text-3xl font-semibold">
							No data available
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AccuracyVsContext;
