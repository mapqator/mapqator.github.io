import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const TokenDistribution = ({ queries }) => {
	const [chart, setChart] = useState({
		series: [],
		options: {},
	});

	useEffect(() => {
		if (queries.length === 0) return;

		const tokenCounts = [];

		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				// Split by spaces and newlines to count tokens
				const tokens = query.question.split(/[\s\n]+/);
				tokenCounts.push(tokens.length);
			}
		});

		// Sort the token counts to create bins for a histogram
		tokenCounts.sort((a, b) => a - b);

		// Create bins (ranges) for the token counts
		const binSize = 10; // Adjust bin size as needed
		const maxTokenCount = Math.max(...tokenCounts);
		const numberOfBins = Math.ceil(maxTokenCount / binSize);

		const distribution = new Array(numberOfBins).fill(0);
		tokenCounts.forEach((count) => {
			const binIndex = Math.min(
				Math.floor(count / binSize),
				numberOfBins - 1
			);
			distribution[binIndex]++;
		});

		console.log("Question Distribution: ", distribution);

		// Prepare chart data
		setChart({
			series: [
				{
					data: distribution,
				},
			],
			options: {
				chart: {
					height: "100%",
					type: "bar",
				},
				plotOptions: {
					bar: {
						horizontal: false,
					},
				},
				labels: Array.from(
					{ length: numberOfBins },
					(_, i) => `${i * binSize}-${(i + 1) * binSize}`
				),
				xaxis: {
					title: {
						text: "Token Count Ranges",
					},
					categories: Array.from(
						{ length: numberOfBins },
						(_, i) => `${i * binSize}-${(i + 1) * binSize}`
					),
				},
				yaxis: {
					title: {
						text: "Number of Queries",
					},
					labels: {
						formatter: function (value) {
							return value.toFixed(0);
						},
					},
				},
				dataLabels: {
					enabled: false,
				},
			},
		});
	}, [queries]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Token Count Distribution
			</h2>
			<Divider />
			<div className="h-full p-3">
				{chart !== undefined && queries.length > 0 && (
					<ApexCharts
						options={chart.options}
						series={chart.series}
						type="bar"
						height="300px"
					/>
				)}
			</div>

			{chart === undefined ||
				(queries.length === 0 && (
					<div className="absolute top-0 left-0 h-full w-full">
						<div className="flex justify-center items-center h-full text-gray-300 dark:text-slate-600 text-3xl font-semibold">
							No data available
						</div>
					</div>
				))}
		</div>
	);
};

export default TokenDistribution;
