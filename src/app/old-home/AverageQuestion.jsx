import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const AverageQuestion = ({ queries }) => {
	const [chart, setChart] = useState({
		series: [],
		options: {},
	});

	useEffect(() => {
		if (queries.length === 0) return;

		const data = {
			poi: 0,
			nearby: 0,
			routing: 0,
			trip: 0,
		};

		let valid_questions = {
			poi: 0,
			nearby: 0,
			routing: 0,
			trip: 0,
		};
		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				valid_questions[query.classification]++;
				data[query.classification] += query.question.length;
			}
		});

		console.log("Average Context Length: ", data);

		setChart({
			series: [
				{
					data: [
						data["poi"] / valid_questions["poi"],
						data["nearby"] / valid_questions["nearby"],
						data["routing"] / valid_questions["routing"],
						data["trip"] / valid_questions["trip"],
					],
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
				labels: ["poi", "nearby", "routing", "trip"],
				dataLabels: {
					enabled: false,
				},
				yaxis: {
					labels: {
						formatter: function (value) {
							return value.toFixed(2);
						},
					},
				},
			},
		});
	}, [queries]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Average Question Length
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

export default AverageQuestion;
