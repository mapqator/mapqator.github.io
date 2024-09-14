import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ColumnChart = ({ queries }) => {
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

		let valid_questions = {
			poi: 0,
			nearby: 0,
			routing: 0,
			trip: 0,
		};
		queries.forEach((query) => {
			if (query.context !== "" && query.answer.correct !== -1) {
				valid_questions[query.classification]++;
				query.evaluation?.forEach((e) => {
					if (!data[e.model]) {
						data[e.model] = {
							poi: 0,
							nearby: 0,
							routing: 0,
							trip: 0,
						};
					}
					if (e.verdict === "right" && e.type === 0) {
						if (!data[e.model][query.classification]) {
							data[e.model][query.classification] = 0;
						}
						data[e.model][query.classification] += 1;
					}
				});
			}
		});

		setChart({
			series: Object.keys(data).map((key) => {
				return {
					name: key,
					data: [
						parseFloat(
							(
								(data[key].poi * 100) /
								valid_questions.poi
							).toFixed(2)
						),
						parseFloat(
							(
								(data[key].nearby * 100) /
								valid_questions.nearby
							).toFixed(2)
						),
						parseFloat(
							(
								(data[key].routing * 100) /
								valid_questions.routing
							).toFixed(2)
						),
						parseFloat(
							(
								(data[key].trip * 100) /
								valid_questions.trip
							).toFixed(2)
						),
					],
				};
			}),
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
				Categorical Accuracy
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

export default ColumnChart;
