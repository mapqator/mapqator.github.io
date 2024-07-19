"use client";
import { useContext, useEffect, useState } from "react";
import {
	Box,
	Container,
	Typography,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Button,
	Paper,
	Card,
	Divider,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import PlaceIcon from "@mui/icons-material/Place";
import Image from "next/image";
// import { AreaIcon } from "@material-ui/icons";

import { AppBar, Toolbar } from "@mui/material";
import HybridSearch from "../HybridSearch";
import { AutocompleteSearchBox } from "./search";
import { GlobalContext } from "@/contexts/GlobalContext";
import PlaceInformation from "./places";
import NearbyInformation from "../NearbyInformation";
import { NearbyInfo } from "./nearby";
import POI from "../POI";
import { DiscoverArea } from "./area";
import DistanceInformation from "../DistanceInformation";
import { CalculateDistance } from "./distance";
import DirectionInformation from "../DirectionInformation";
import { GetDirections } from "./direction";
import ContextPreview, { ContextViewer } from "../ContextPreview";
import { Flag, Preview, Settings } from "@mui/icons-material";
import ExploreIcon from "@mui/icons-material/Explore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Parameters } from "./params";

export default function MapComponent({ locations }) {
	const mapStyles = {
		height: "400px",
		width: "100%",
	};

	const defaultCenter = {
		lat: 0,
		lng: 0,
	};

	return (
		<LoadScript
			googleMapsApiKey={"AIzaSyAKIdJ1vNr9NoFovmiymReEOfQEsFXyKCs"}
		>
			<GoogleMap
				mapContainerStyle={mapStyles}
				zoom={2}
				center={defaultCenter}
			>
				{locations.map((location, index) => (
					<Marker
						key={index}
						position={{ lat: location[0], lng: location[1] }}
					/>
				))}
			</GoogleMap>
		</LoadScript>
	);
}
