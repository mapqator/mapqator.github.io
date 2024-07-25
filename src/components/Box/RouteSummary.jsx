import { AppContext } from "@/contexts/AppContext";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useContext } from "react";

export default function RouteSummary({ from_id, to_id }) {
	const { savedPlacesMap } = useContext(AppContext);
	return (
		<Box className="flex flex-col w-full">
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
