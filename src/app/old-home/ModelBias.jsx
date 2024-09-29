import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import queryApi from "@/api/queryApi";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const ModelBias = ({ queries, type }) => {
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
		const data = {};
		const total = new Array(4).fill(0);
		queries.forEach((query) => {
			if (query.context !== "") {
				total[query.answer.correct]++;
				query.evaluation?.forEach((e) => {
					if (!data[e.model]) {
						data[e.model] = new Array(4).fill(0);
					}
					if (
						((e.option === null && e.verdict === "right") ||
							e.option === query.answer.correct + 1) &&
						e.type === type
					) {
						// data[e.model][query.answer.correct] += 1;
					} else if (e.option > 0 && e.type === type) {
						// console.log("e.model: ", e.model);
						data[e.model][e.option - 1] += 1;
					}
				});
			}
		});

		console.log("Biasness: ", data);

		setChart({
			series: Object.keys(data).map((key) => {
				return {
					name: key,
					data: Array.from({ length: 4 }, (_, i) =>
						parseFloat(data[key][i])
					),
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
				labels: ["1", "2", "3", "4"],
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
				Model Biasness
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

export default ModelBias;
