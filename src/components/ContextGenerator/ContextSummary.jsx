import { useContext } from "react";
import ContextViewer from "./ContextPreview";
import { GlobalContext } from "@/contexts/GlobalContext";

export default function ContextSummary() {
	const { context } = useContext(GlobalContext);

	let text = "";
	text += context.places !== "" ? context.places : "";
	text +=
		context.nearby !== "" ? (text !== "" ? "\n" : "") + context.nearby : "";
	text += context.area !== "" ? (text !== "" ? "\n" : "") + context.area : "";
	text +=
		context.distance !== ""
			? (text !== "" ? "\n" : "") + context.distance
			: "";
	text +=
		context.direction !== ""
			? (text !== "" ? "\n" : "") + context.direction
			: "";
	text +=
		context.params !== "" ? (text !== "" ? "\n" : "") + context.params : "";

	return <ContextViewer context={text} />;
}
