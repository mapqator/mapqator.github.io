import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const GroundTruthDistribution = ({ queries }) => {
	const [chart, setChart] = useState({
		series: [],
		options: {},
	});

	useEffect(() => {
		if (queries.length === 0) return;

		const data = new Array(4).fill(0);

		console.log(data);
		let valid_questions = 0;
		queries.forEach((query) => {
			if (query.context !== "") {
				data[query.answer.correct]++;
			}
		});

		setChart({
			series: [
				{
					data: data,
				},
			],
			options: {
				chart: {
					height: "100%",
					// stacked: true,
					type: "bar",
				},
				states: {
					active: {
						filter: {
							type: "none", // none, lighten, darken
						},
					},
					hover: {
						filter: {
							type: "lighten",
							value: 0.0001,
						},
					},
				},
				plotOptions: {
					bar: {
						horizontal: false,
					},
				},
				labels: Array.from({ length: 4 }, (_, i) => i + 1),
				dataLabels: {
					enabled: false,
				},
				yaxis: {
					// labels: {
					// 	formatter: function (value) {
					// 		return value.toFixed(2) + "%";
					// 	},
					// },
				},
			},
		});
	}, [queries]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Groundtruth Distribution
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

export default GroundTruthDistribution;
