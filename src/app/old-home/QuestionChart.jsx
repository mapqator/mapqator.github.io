import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const QuestionChart = ({ queries }) => {
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
		const data = new Array(models.length).fill(0);
		queries.forEach((query) => {
			let correct = 0;
			if (query.context !== "" && query.answer.correct !== -1) {
				query.evaluation?.forEach((e) => {
					if (e.verdict === "right" && e.type === 0) {
						correct++;
					}
				});
			}
			data[correct]++;
		});

		console.log(data);
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
				labels: Array.from({ length: models.length }, (_, i) => i),
				dataLabels: {
					enabled: false,
				},
			},
		});
	}, [queries, models]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Question Accuracy
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

export default QuestionChart;
