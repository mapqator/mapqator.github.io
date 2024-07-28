"use client";

import React from "react";

import QueryFields from "./QueryFields";

export default function QueryForm({ contextJSON, context, handleSave }) {
	return (
		<div className="w-full flex flex-col items-center bg-white border-4 rounded-lg border-black">
			<div className="flex flex-col bg-black w-full items-center p-1">
				<h1 className="text-3xl text-white">Create new query</h1>
				<p className="text-base text-white">Context+Question+Answer</p>
			</div>
			<QueryFields {...{ contextJSON, context }} onSave={handleSave} />
		</div>
	);
}
