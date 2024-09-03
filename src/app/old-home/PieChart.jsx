"use client";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart({ queries }) {
	const [chart, setChart] = useState(undefined);
	const [data, setData] = useState({
		poi: 0,
		nearby: 0,
		routing: 0,
		trip: 0,
	});
	useEffect(() => {
		queries.forEach((query) => {
			if (query.context !== "") data[query.classification] += 1;
		});
		setChart({
			series: [data.poi, data.nearby, data.routing, data.trip],
			options: {
				chart: {
					type: "pie",
					height: "100%",
				},
				states: {
					active: {
						filter: {
							type: "none" /* none, lighten, darken */,
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
					pie: {
						dataLabels: {
							offset: -20,
						},
					},
				},
				labels: ["Poi", "Nearby", "Routing", "Trip"],
				// colors: ["#ef9c9c", "#96cdbf"],
				dataLabels: {
					position: "top",
					offset: -50, // Adjust this value as needed
					style: {
						// colors: ["#222222", "#222222"], // Add this line. This will make the labels dark black.
						offset: -50, // Adjust this value as needed
						fontSize: "20px",
						shadow: false,
					},
				},
				stroke: {
					width: 0, // Add this line. This will remove the border.
				},
				legend: {
					position: "bottom", // or 'top', 'left', 'right'
				},
			},
		});
	}, [queries]);
	//return the pie chart
	return (
		<div className="bu-card-primary rounded-lg shadow-md relative w-full">
			<h2 className="bu-text-primary py-2 px-5 font-semibold">
				Category Distribution
			</h2>
			<Divider />
			<div className="h-full p-3">
				{chart !== undefined && queries.length > 0 && (
					<ApexCharts
						options={chart.options}
						series={chart.series}
						type="pie"
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
}
