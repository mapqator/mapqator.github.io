import { AppContext } from "@/contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useContext } from "react";

export default function RouteSummary({ from_id, to_id }) {
	const { savedPlacesMap } = useContext(AppContext);
	return (
		<Box className="flex flex-col">
			<h6 className="text-base md:text-xl text-center md:font-semibold">
				{savedPlacesMap[from_id].name}
			</h6>

			<FontAwesomeIcon icon={faArrowDown} />

			<h6 className="text-base md:text-xl text-center md:font-semibold">
				{savedPlacesMap[to_id].name}
			</h6>
		</Box>
	);
}
