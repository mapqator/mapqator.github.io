import React, { useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
export default function ContextPreview({ context }) {
	const [contextExpanded, setContextExpanded] = useState(false);

	return (
		<div>
			{context.split("\n").map(
				(line, index) =>
					(contextExpanded || index < 5) && (
						<p
							key={index}
							className="w-full text-left"
							style={{
								whiteSpace: "pre-line",
							}}
							dangerouslySetInnerHTML={{
								__html:
									line +
									(line === "" &&
									index < context.split("\n").length - 1
										? "\n"
										: ""),
							}}
						/>
					)
			)}

			{context === "" && (
				<p className="text-center py-2 my-auto text-lg md:text-xl text-zinc-400">
					No context generated. Add information first.
				</p>
			)}

			{context.split("\n").length > 5 && (
				<Button
					sx={{ mt: 1, textTransform: "none" }}
					onClick={() => setContextExpanded((prev) => !prev)}
				>
					<div className="flex flex-row gap-1 items-end">
						{!contextExpanded && (
							<FontAwesomeIcon icon={faEllipsis} />
						)}
						{contextExpanded ? "Show Less" : "Read More"}
					</div>
				</Button>
			)}
		</div>
	);
}
