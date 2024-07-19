"use client";

import React from "react";

export default function ContextViewer({ context }) {
	return (
		<div className="p-2 flex flex-col gap-2 w-full min-h-16">
			{context?.length > 0 ? (
				context.map((text, index) => (
					<p
						key={index}
						className="w-full text-left"
						dangerouslySetInnerHTML={{
							__html: text,
						}}
					/>
				))
			) : (
				<p className="text-center my-auto text-lg md:text-xl text-zinc-400">
					No context generated. Add information first.
				</p>
			)}
		</div>
	);
}
