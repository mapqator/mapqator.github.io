"use client";
import GlobalContextProvider from "@/contexts/GlobalContext";
import Home from "./page/Home";
import { useEffect, useState } from "react";
import { getGoogleMapsApiKey } from "@/api/base";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";
import LeftSidebar from "@/components/LeftSidebar";
import { Box, CssBaseline } from "@mui/material";
import config from "@/config/config";
const drawerWidth = config.drawerWidth;
export default function PageComponent() {
	return (
		<GlobalContextProvider>
			<Home />
		</GlobalContextProvider>
	);
}
