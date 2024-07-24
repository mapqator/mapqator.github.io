"use client";

import React from "react";

export default function ContextPreview({ context }) {
	return (
		<div className="p-0 md:p-2 flex flex-col gap-2 w-full min-h-16">
			{context?.length > 0 ? (
				<p
					className="w-full text-left text-sm"
					style={{
						whiteSpace: "pre-line",
					}}
					dangerouslySetInnerHTML={{
						__html: context,
					}}
				/>
			) : (
				<p className="text-center my-auto text-lg md:text-xl text-zinc-400">
					No context generated. Add information first.
				</p>
			)}
		</div>
	);
}
