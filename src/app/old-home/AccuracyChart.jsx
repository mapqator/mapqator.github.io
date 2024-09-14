import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const AccuracyChart = ({ queries, type }) => {
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
		if (queries.length === 0) return;

		console.log("Models:", models);
		const data = {};

		console.log(data);

		let valid_questions = 0;
		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				valid_questions++;
				query.evaluation?.forEach((e) => {
					if (!data[e.model]) {
						data[e.model] = 0;
					}
					if (
						(e.verdict === "right" ||
							e.option === query.answer.correct + 1) &&
						e.type === type
					) {
						data[e.model]++;
					}
				});
			}
		});

		const sorted_data = Object.keys(data)
			.map((key) => {
				return {
					model: key,
					value: data[key],
				};
			})
			.sort((a, b) => b.value - a.value);

		setChart({
			series: [
				{
					// data: models
					// 	.filter((model) => model.id > 0)
					// 	.map((model) => {
					// 		return parseFloat(
					// 			(
					// 				(data[model.name] / valid_questions) *
					// 				100
					// 			).toFixed(2)
					// 		);
					// 	}),
					data: sorted_data.map((e) => {
						return parseFloat(
							((e.value / valid_questions) * 100).toFixed(2)
						);
					}),
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
				labels: sorted_data.map((e) => e.model),
				dataLabels: {
					enabled: false,
				},
				yaxis: {
					labels: {
						formatter: function (value) {
							return value.toFixed(2) + "%";
						},
					},
				},
			},
		});
	}, [queries, models]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Overall Accuracy
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

export default AccuracyChart;
