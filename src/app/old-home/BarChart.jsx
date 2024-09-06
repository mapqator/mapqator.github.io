import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const BarChart = ({ queries }) => {
	const [chart, setChart] = useState({
		series: [],
		options: {},
	});

	useEffect(() => {
		if (queries.length === 0) return;

		const data = {
			poi: {
				mahirlabibdihan: 0,
				tanvirparvez: 0,
				almash: 0,
			},
			nearby: {
				mahirlabibdihan: 0,
				tanvirparvez: 0,
				almash: 0,
			},
			routing: {
				mahirlabibdihan: 0,
				tanvirparvez: 0,
				almash: 0,
			},
			trip: {
				mahirlabibdihan: 0,
				tanvirparvez: 0,
				almash: 0,
			},
		};

		queries.forEach((query) => {
			if (query.context !== "") {
				if (!data[query.classification]) {
					data[query.classification] = {};
				}
				if (!data[query.classification][query.username]) {
					data[query.classification] = {
						...data[query.classification],
						[query.username]: 0,
					};
				}
				data[query.classification][query.username] += 1;
			}
			// console.log(data);
		});

		setChart({
			series: Object.keys(data).map((key) => {
				return {
					name: key,
					data: [
						data[key].mahirlabibdihan,
						data[key].tanvirparvez,
						data[key].almash,
					],
				};
			}),
			options: {
				chart: {
					height: "100%",
					stacked: true,
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
						horizontal: true,
					},
				},
				labels: ["mahirlabibdihan", "tanvirparvez", "almash"],
				dataLabels: {
					enabled: true,
				},
				yaxis: {
					labels: {
						style: {
							fontSize: "15px", // Increase font size for x-axis labels
						},
					},
				},
			},
		});
	}, [queries]);

	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Dataset Contribution
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

export default BarChart;
