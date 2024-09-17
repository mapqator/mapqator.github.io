import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ContextDistribution = ({ queries }) => {
	const [chart, setChart] = useState({
		series: [],
		options: {},
	});

	useEffect(() => {
		if (queries.length === 0) return;

		const contextLengths = [];

		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				contextLengths.push(query.context.length);
			}
		});

		// Sort the context lengths to create bins for a histogram
		contextLengths.sort((a, b) => a - b);

		// Create bins (ranges) for the context lengths
		const binSize = 500; // Adjust bin size as needed
		const maxContextLength = Math.max(...contextLengths);
		const numberOfBins = Math.ceil(maxContextLength / binSize);

		const distribution = new Array(numberOfBins).fill(0);
		contextLengths.forEach((length) => {
			const binIndex = Math.floor(length / binSize);
			distribution[binIndex]++;
		});

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
						text: "Context Length Ranges",
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
				Context Length Distribution
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
				(queries.length == 0 && (
					<div className="absolute top-0 left-0 h-full w-full">
						<div className="flex justify-center items-center h-full text-gray-300 dark:text-slate-600 text-3xl font-semibold">
							No data available
						</div>
					</div>
				))}
		</div>
	);
};

export default ContextDistribution;
