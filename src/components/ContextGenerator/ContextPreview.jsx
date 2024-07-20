"use client";

import { GlobalContext } from "@/contexts/GlobalContext";
import ContextGeneratorService from "@/services/contextGeneratorService";
import React, { useContext, useEffect } from "react";

export default function ContextViewer({ context }) {
	return (
		<div className="p-2 flex flex-col gap-2 w-full min-h-16">
			{context?.length > 0 ? (
				<p
					className="w-full text-left"
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
