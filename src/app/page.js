"use client";
import GlobalContextProvider from "@/contexts/GlobalContext";
import Home from "./page/Home";
import { useEffect, useState } from "react";
import { getGoogleMapsApiKey } from "@/api/base";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";

export default function PageComponent() {
	return (
		<GlobalContextProvider>
			<Home />
		</GlobalContextProvider>
	);
}
